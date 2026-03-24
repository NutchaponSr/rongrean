import bcrypt from "bcryptjs";
import authConfig from "./auth.config";

import { convex } from "better-convex/auth";
import { organization } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { requireActionCtx, requireRunMutationCtx } from "better-convex/server";

import { defineAuth } from "./generated/auth";
import { ActionCtx } from "./generated/server";
import { api, internal } from "./_generated/api";

import { buildEmailTemplate } from "./emailTemplates";

const VALID_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
];

const normalizeName = (name: string) => {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default defineAuth((ctx) => {
  return {
    baseURL: process.env.SITE_URL!,
    trustedOrigins: [process.env.SITE_URL || "http://localhost:3000"],
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24 * 15,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 20,
      password: {
        hash: async (password) => {
          const salt = await bcrypt.genSalt(12);

          return await bcrypt.hash(password, salt);
        },
        verify: async ({ password, hash }) => {
          return await bcrypt.compare(password, hash);
        },
      },
      sendResetPassword: async ({ user, url }) => {
        const actionCtx = requireActionCtx(ctx);
        await actionCtx.scheduler.runAfter(
          0,
          internal.email.sendEmail,
          {
            to: user.email,
            ...buildEmailTemplate(
              url,
              "Reset Your Password",
              "Please click the button below to reset your password."
            ),
          },
        );
      },
    },
    emailVerification: {
      expiresIn: 60 * 60,
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        const link = new URL(url);

        link.searchParams.set("callbackURL", "/auth/verify");

        const actionCtx = requireActionCtx(ctx);
        await actionCtx.scheduler.runAfter(
          0,
          internal.email.sendEmail,
          {
            to: user.email,
            ...buildEmailTemplate(
              link.toString(),
              "Verify Your Email Address",
              "Please verify your email address by using the code below or clicking the verification button."
            ),
          },
        );
      },
    },
    account: {
      accountLinking: {
        enabled: false,
        trustedProviders: ["github", "google", "email-password"],
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-up/email") {
          const email = String(ctx.body.email);
          const domain = email.split("@")[1];

          if (!VALID_DOMAINS.includes(domain)) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid email domain",
            });
          }

          const name = normalizeName(ctx.body.name);

          return {
            context: {
              ...ctx,
              body: {
                ...ctx.body,
                name,
              },
            },
          }
        }

        if (ctx.path === "/update-user") {
          const name = normalizeName(ctx.body.name);

          return {
            context: {
              ...ctx,
              body: {
                ...ctx.body,
                name,
              },
            },
          };
        }
      }),
    },
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            const runCtx = requireRunMutationCtx(ctx);
            const org = await runCtx.runQuery(api.organization.getInitialSession, {
              userId: session.userId,
            });

            return {
              data: {
                ...session,
                activeOrganizationId: org?.id,
              }
            };
          },
        },
      },
    },
    plugins: [
      convex({
        authConfig,
      }),
      organization({
        allowUserToCreateOrganization: true,
        creatorRole: "owner",
        organizationLimit: 1,
        organizationHooks: {
          afterCreateOrganization: async ({ organization }) => {
            await requireRunMutationCtx(ctx).runMutation(api.database.initial, {
              organizationId: organization.id,
            });
          },
          afterCreateInvitation: async (data) => {
            const url = new URL(process.env.SITE_URL!);
            url.pathname = `/invite/${data.invitation.id}`;

            await (ctx as ActionCtx).scheduler.runAfter(
              0,
              internal.email.sendEmail,
              {
                to: data.invitation.email,
                ...buildEmailTemplate(
                  url.toString(),
                  "Join Our Organization",
                  "Please click the button below to join our organization."
                )
              }
            )
          },
        },
        schema: {
          organization: {
            additionalFields: {
              code: {
                required: true,
                type: "string",
              },
              link: {
                required: true,
                type: "string",
              },
              plan: {
                required: true,
                type: "string",
              }
            },
          },
        },
      }),
    ],
  }
});
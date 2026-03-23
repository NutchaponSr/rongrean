import authConfig from "./auth.config";

import { convex } from "better-convex/auth";
import { organization } from "better-auth/plugins";
import { requireRunMutationCtx } from "better-convex/server";

import { defineAuth } from "./generated/auth";
import { api, internal } from "./_generated/api";
import { ActionCtx } from "./generated/server";
import { buildEmailTemplate } from "./emailTemplates";

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
    },
    account: {
      accountLinking: {
        enabled: false,
        trustedProviders: ["github", "google", "email-password"],
      },
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
        organizationHooks: {
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
import authConfig from "./auth.config";

import { convex } from "better-convex/auth";

import { defineAuth } from "./generated/auth";
import { organization } from "better-auth/plugins";

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
    plugins: [
      convex({
        authConfig,
      }),
      organization({
        allowUserToCreateOrganization: true,
        creatorRole: "owner",
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
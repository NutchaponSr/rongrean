import type { Auth } from "convex/server";
import { getHeaders } from "better-convex/auth";
import { CRPCError } from "better-convex/server";

import { initCRPC, MutationCtx, OrmCtx, QueryCtx } from "../functions/generated/server";

import { getSessionUser } from "./auth-helper";
import { getAuth } from "../functions/generated/auth";

import type { SessionUser } from "../shared/auth-shared";
import { rateLimitGuard } from "./rate-limit";

export type AuthCtx<Ctx extends MutationCtx | QueryCtx = QueryCtx> =
  OrmCtx<Ctx> & {
    auth: Auth & ReturnType<typeof getAuth> & { headers: Headers };
    user: SessionUser;
    userId: string;
  };

const c = initCRPC
  .meta<{
    auth?: "optional" | "required";
    ratelimit?: string;
    dev?: boolean;
  }>()
  .create();

export const publicQuery = c.query;
export const publicMutation = c.mutation;

const devMiddleware = c.middleware<object>(({ meta, next, ctx }) => {
  if (meta.dev && process.env.DEPLOY_ENV === "production") {
    throw new CRPCError({
      code: "FORBIDDEN",
      message: "This function is only available in development"
    });
  }

  return next({ ctx });
});

const ratelimitMiddleware = c.middleware<
MutationCtx & { user?: Pick<SessionUser, "id" | "session" | "activeOrganization"> }
>(async ({ meta, next, ctx }) => {
  await rateLimitGuard({
    ...ctx,
    rateLimitKey: meta.ratelimit ?? "default",
    user: ctx.user ?? null,
  });

  return next({ ctx });
});

function requireAuth<T>(user: T | null): T {
  if (!user) {
    throw new CRPCError({
      code: "UNAUTHORIZED",
      message: "Not Unauthorized",
    });
  }
  return user;
}

export const authQuery = c.query
  .meta({ auth: "required" })
  .use(devMiddleware)
  .use(async ({ ctx, next }) => {
    const user = requireAuth(await getSessionUser(ctx));

    return next({
      ctx: {
        ...ctx,
        auth: {
          ...ctx.auth,
          ...getAuth(ctx),
          headers: await getHeaders(ctx, user.session),
        },
        user,
        userId: user.id,
      }
    })
  })

export const optionalAuthQuery = c.query
  .meta({ auth: "optional" })
  .use(devMiddleware)
  .use(async ({ ctx, next }) => {
    const user = await getSessionUser(ctx);

    return next({
      ctx: {
        ...ctx,
        auth: user
          ? {
            ...ctx.auth,
            ...getAuth(ctx),
            headers: await getHeaders(ctx),
          } : ctx.auth,
        user,
        userId: user?.id ?? null,
      },
    });
  });

export const authMutation = c.mutation
  .meta({ auth: "required" })
  .use(devMiddleware)
  .use(async ({ ctx, next }) => {
    const user = requireAuth(await getSessionUser(ctx));

    return next({
      ctx: {
        ...ctx,
        auth: {
          ...ctx.auth,
          ...getAuth(ctx),
          headers: await getHeaders(ctx, user.session),
        },
        user,
        userId: user.id,
      },
    });
  })
  .use(ratelimitMiddleware);
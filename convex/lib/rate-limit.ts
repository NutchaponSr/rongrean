import { CRPCError } from "better-convex/server";
import { getSessionNetworkSignals } from "better-convex/auth";
import { MINUTE, Ratelimit } from "better-convex/plugins/ratelimit";

import { SessionUser } from "../shared/auth-shared";
import type { MutationCtx } from "../functions/generated/server";

const fixed = (rate: number) => Ratelimit.fixedWindow(rate, MINUTE);

const rateLimitConfig = {
  "default:free": fixed(60),
  "default:pro": fixed(200),
  "organization/create:free": fixed(10),
  "organization/create:pro": fixed(30),
} as const;

export function getRateLimitKey(
  baseKey: string,
  tier: "free" | "pro"
): keyof typeof rateLimitConfig {
  const specificKey = `${baseKey}:${tier}` as keyof typeof rateLimitConfig;

  if (specificKey in rateLimitConfig) return specificKey;

  return `default:${tier}`;
}

export async function rateLimitGuard(
  ctx: MutationCtx & {
    rateLimitKey: string;
    user: Pick<SessionUser, "id" | "session" | "activeOrganization"> | null;
  }
) {
  const tier = ctx.user?.activeOrganization?.plan || "free";
  const limitKey = getRateLimitKey(ctx.rateLimitKey, tier as "free" | "pro");
  const identifier = ctx.user?.id || "anonymous";

  const limiter = new Ratelimit({
    db: ctx.db,
    prefix: `example:${limitKey}`,
    limiter: rateLimitConfig[limitKey],
    failureMode: "closed",
    enableProtection: true,
    denyListThreshold: 30,
  });

  const { ip, userAgent } = await getSessionNetworkSignals(ctx, ctx.user?.session);
  const status = await limiter.limit(identifier, {
    ip,
    userAgent,
  });

  if (!status.success) {
    throw new CRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded",
    });
  }
}
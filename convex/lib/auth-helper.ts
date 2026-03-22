import { SessionUser } from "../shared/auth-shared";
import type { QueryCtx } from "../functions/generated/server";
import { getSession } from "better-convex/auth";
import { Id } from "../functions/_generated/dataModel";

export const getSessionData = async (ctx: QueryCtx) => {
  const session = await getSession(ctx);

  if (!session) return null;

  const activeOrganizationId = session.activeOrganizationId;

  const [user] = await Promise.all([
    ctx.orm.query.user.findFirst({
      where: {
        id: session.userId,
      },
    }),
  ]);

  if (!user) return null;

  let activeOrganization: SessionUser["activeOrganization"] = null;
  if (activeOrganizationId) {
    const [activeOrg, currentMember] = await Promise.all([
      ctx.orm.query.organization.findFirst({
        where: {
          id: activeOrganizationId,
        },
      }),
      ctx.orm.query.member.findFirst({
        where: {
          organizationId: activeOrganizationId as Id<"organization">,
          userId: session.userId,
        },
      }),
    ]);

    if (activeOrg) {
      const { id, ...rest } = activeOrg;

      activeOrganization = {
        ...rest,
        id,
        role: currentMember?.role || "member",
      };
    }
  } 

  return {
    activeOrganization,
    session,
    user,
  };
}

export const getSessionUser = async (ctx: QueryCtx): Promise<SessionUser | null> => {
  const data = await getSessionData(ctx);
  
  if (!data) return null;

  const {
    user,
    activeOrganization,
    session,
  } = data;
  
  const { id, ...rest } = user;

  return {
    ...rest,
    id,
    activeOrganization,
    session,
  };
}
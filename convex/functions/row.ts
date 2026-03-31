import z from "zod";

import { CRPCError } from "better-convex/server";

import { authMutation } from "../lib/crpc";
import { propertyValueSchema } from "../shared/zod-schema";

import { Id } from "./_generated/dataModel";

export const update = authMutation
  .input(
    z.object({
      pageId: z.string(),
      propertyId: z.string(),
      value: propertyValueSchema
    })
  )
  .mutation(async ({ ctx, input }) => {
    const page = await ctx.db.get(input.pageId as Id<"page">);

    if (!page) {
      throw new CRPCError({
        code: "NOT_FOUND",
        message: "Page not found",
      });
    }

    const current = page.rowProperties || [];
    const idx = current.findIndex((p) => p.propertyId === input.propertyId);
    const updated = idx >= 0
      ? current.map((p, i) => i === idx ? { ...p, value: input.value } : p)
      : [...current, { propertyId: input.propertyId as Id<"property">, value: input.value }];

    const property = await ctx.db.get(input.propertyId as Id<"property">);

    const isTitle  = property?.isPrimary && input.value.type === "title";
  
    return await ctx.db.patch(input.pageId as Id<"page">, {
      rowProperties: updated as NonNullable<typeof page.rowProperties>,
      ...(isTitle ? { title: (input.value as { type: "title"; value: string }).value } : {}),
      updatedAt: Date.now(),
    });
  })
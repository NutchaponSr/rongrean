import z from "zod";

import { CRPCError } from "better-convex/server";
import { generateKeyBetween } from "fractional-indexing";

import { authMutation } from "../lib/crpc";
import { getDefaultValue } from "../lib/db-helper";
import { propertyConfigSchema } from "../shared/zod-schema";

import { Doc, Id } from "./_generated/dataModel";

export const create = authMutation
  .input(
    z.object({
      databaseId: z.string(),
      name: z.string(),
      config: propertyConfigSchema,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const database = await ctx.db.get(input.databaseId as Id<"database">);

    if (!database) {
      throw new CRPCError({
        code: "NOT_FOUND",
        message: "Database not found",
      });
    }

    const lastProperty = await ctx.db
      .query("property")
      .withIndex("by_databaseId_sortOrder", (q) => q.eq("databaseId", database._id))
      .order("desc")
      .first();

    const order = generateKeyBetween(lastProperty?.sortOrder ?? null, null);

    const propertyId = await ctx.db.insert("property", {
      databaseId: input.databaseId as Id<"database">,
      name:       input.name,
      type:       input.config.type,
      config:     input.config as unknown as Doc<"property">["config"],
      sortOrder:  order,
      isHidden:   false,
      isPrimary:  false,
      width:      200,
    });

    const defaultValue = getDefaultValue(input.config);

    if (defaultValue !== null) {
      const rows = await ctx.db
        .query("row")
        .withIndex("by_databaseId_order", (q) => q.eq("databaseId", database._id))
        .filter((q) => q.eq(q.field("isArchived"), false))
        .collect();

      await Promise.all(
        rows.map(async (row) => {
          const page = await ctx.db.get(row.pageId);
          if (!page || page.isTrashed) return;

          const alreadyExists = page.rowProperties?.some(
            (r) => r.propertyId === propertyId
          );
          if (alreadyExists) return;

          await ctx.db.patch(page._id, {
            rowProperties: [
              ...(page.rowProperties ?? []),
              { propertyId, value: defaultValue },
            ],
            updatedAt: Date.now(),
          });
        })
      );
    }

    return propertyId;
  });
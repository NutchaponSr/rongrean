import z from "zod";

import { CRPCError } from "better-convex/server";
import { generateKeyBetween } from "fractional-indexing";

import { authMutation } from "../lib/crpc";

import { Id } from "./_generated/dataModel";
import { getDefaultValue } from "../lib/db-helper";

export const create = authMutation
  .input(
    z.object({
      databaseId: z.string(),
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

    const rows = await ctx.db
      .query("row")
      .withIndex("by_databaseId_order", (q) => q.eq("databaseId", database._id))
      .order("desc")
      .first();

    // a0 เป็นของ database page ให้เริ่ม a0 สำหรับ page ใน database นั้นๆ
    const order = rows 
      ? generateKeyBetween(rows.order, null) 
      : generateKeyBetween(null, null);

    const properties = await ctx.db
      .query("property")
      .withIndex("by_databaseId", (q) => q.eq("databaseId", database._id))
      .collect();

    const rowProperties = properties
      .map((prop) => {
        const type = prop.type;

        const defaultValue = getDefaultValue({ type });
        if (defaultValue === null) return null; // computed fields ข้ามไป

        return {
          propertyId: prop._id,
          value: type === "title"
            ? { type: "title" as const, value: "New Page" }
            : defaultValue,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    const now = new Date().getTime();

    const pageId = await ctx.db.insert("page", {
      organizationId: database.organizationId as Id<"organization">,
      title: "New Page",
      isArchived: false,
      isTrashed: false,
      createdBy: ctx.user.id as Id<"user">,
      lastEditedBy: ctx.user.id as Id<"user">,
      sortOrder: order,
      rowProperties,
      createdAt: now,
      updatedAt: now,
    });

    const rowId = await ctx.db.insert("row", {
      pageId: pageId as Id<"page">,
      databaseId: database._id as Id<"database">,
      createdBy: ctx.user.id as Id<"user">,
      isArchived: false,
      order,
      createdAt: now,
      updatedAt: now,
    });
    
    return { pageId, rowId };
  })
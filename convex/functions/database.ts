import z from "zod";

import { CRPCError } from "better-convex/server";
import { generateKeyBetween } from "fractional-indexing";

import { authMutation, authQuery } from "../lib/crpc";

import { Id } from "./_generated/dataModel"
export const initial = authMutation
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .output(
    z.object({
      pageId: z.string(),
      databaseId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const pageId = await ctx.db.insert("page", {
      organizationId: input.organizationId as Id<"organization">,
      title: "Student Information System (SIS)",
      createdBy: ctx.user.id as Id<"user">,
      isArchived: false,
      isTrashed: false,
      lastEditedBy: ctx.user.id as Id<"user">,
      sortOrder: generateKeyBetween(null, null),
    });

    const databaseId = await ctx.db.insert("database", {
      organizationId: input.organizationId as Id<"organization">,
      createdAt: new Date().getTime(),
      createdBy: ctx.user.id as Id<"user">,
      pageId: pageId as Id<"page">,
      lastEditedBy: ctx.user.id as Id<"user">,
      title: "Student Information System (SIS)",
    });

    await ctx.db.insert("property", {
      databaseId: databaseId as Id<"database">,
      name: "Name",
      type: "title",
      config: { type: "title" },
      sortOrder: generateKeyBetween(null, null),
      isHidden: false,
      isPrimary: true,
      width: 240,
    });

    return { pageId, databaseId };
  });

export const getOne = authQuery
  .input(
    z.object({
      databaseId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const database = await ctx.db.get(input.databaseId as Id<"database">);

    if (!database) {
      throw new CRPCError({
        code: "NOT_FOUND",
        message: "Database not found",
      });
    }

    const [properties, rawRows] = await Promise.all([
      ctx.db
        .query("property")
        .withIndex("by_databaseId", (q) => q.eq("databaseId", database._id))
        .collect(),
      ctx.db
        .query("row")
        .withIndex("by_databaseId_isArchived", (q) => q.eq("databaseId", database._id).eq("isArchived", false))
        .collect(),
    ]);

    const rows = (await Promise.all(
      rawRows.map(async (row) => {
        const page = await ctx.db.get(row.pageId);

        if (!page || page.isTrashed) return null;

        return {
          ...row,
          page,
        }
      })
    )).filter((row) => row !== null)

    return {
      ...database,
      properties,
      rows,
    };
  });

export const getMany = authQuery
  .query(async ({ ctx }) => {
    const databases = await ctx.db
      .query("database")
      .withIndex("organizationId", (q) => q.eq("organizationId", ctx.user.activeOrganization?.id as Id<"organization">))
      .collect();

    return databases;
  });

export const update = authMutation
  .input(
    z.object({
      databaseId: z.string(),
      title: z.string().nullable().optional(),
      icon: z.string().nullable().optional(),
      coverImage: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      position: z.number().nullable().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { databaseId, ...fields } = input;
    const updates = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));

    if (Object.keys(updates).length === 0) return;

    await ctx.db.patch(databaseId as Id<"database">, updates);
  });
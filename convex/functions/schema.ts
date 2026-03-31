import {
  aggregateIndex,
  boolean,
  convexTable,
  custom,
  defineRelations,
  defineSchema,
  id,
  index,
  integer,
  text,
  textEnum,
  timestamp,
  uniqueIndex,
} from "better-convex/orm";
import { ratelimitPlugin } from "better-convex/plugins/ratelimit";

import { v } from "convex/values";

const selectOptionValidator = v.object({
  id: v.string(),
  name: v.string(),
  color: v.optional(v.string()),
});

const numberFormatValidator = v.union(
  v.literal("number"),
  v.literal("dollar"),
  v.literal("euro"),
  v.literal("pound"),
  v.literal("baht"),
  v.literal("yen"),
  v.literal("percent"),
  v.literal("rupee"),
  v.literal("won"),
  v.literal("ruble"),
);

const rollupFunctionValidator = v.union(
  v.literal("count"),
  v.literal("count_values"),
  v.literal("sum"),
  v.literal("average"),
  v.literal("min"),
  v.literal("max"),
  v.literal("median"),
  v.literal("percent_empty"),
  v.literal("percent_not_empty"),
  v.literal("show_original"),
  v.literal("show_unique"),
);

const richTextSpanValidator = v.object({
  type: v.union(
    v.literal("text"),
    v.literal("mention_user"),
    v.literal("mention_page"),
    v.literal("equation"),
  ),
  text: v.optional(v.string()),
  href: v.optional(v.string()),
  bold: v.optional(v.boolean()),
  italic: v.optional(v.boolean()),
  strikethrough: v.optional(v.boolean()),
  underline: v.optional(v.boolean()),
  code: v.optional(v.boolean()),
  color: v.optional(v.string()),
  mentionTargetId: v.optional(v.string()),
  expression: v.optional(v.string()),
});

const richTextBodyValidator = v.array(richTextSpanValidator);

export const user = convexTable("user", {
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
}, (t) => [
  index("by_email").on(t.email),
]);

export const session = convexTable("session", {
  token: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  ipAddress: text(),
  userAgent: text(),
  userId: id("user").notNull(),
  activeOrganizationId: text(),
}, (t) => [
  index("by_token").on(t.token),
  index("by_userId").on(t.userId),
  index("by_expiresAt").on(t.expiresAt),
  index("by_expiresAt_userId").on(t.expiresAt, t.userId),
]);

export const account = convexTable("account", {
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: id("user").notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: integer(),
  refreshTokenExpiresAt: integer(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
}, (t) => [
  index("by_accountId").on(t.accountId),
  index("by_userId").on(t.userId),
  index("by_accountId_providerId").on(t.accountId, t.providerId),
  index("by_providerId_userId").on(t.providerId, t.userId),
]);

export const verification = convexTable("verification", {
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
}, (t) => [
  uniqueIndex("by_identifier").on(t.identifier),
  index("by_expiresAt").on(t.expiresAt),
]);

export const jwks = convexTable("jwks", {
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const organization = convexTable("organization", {
  logo: text(),
  name: text().notNull(),
  slug: text().notNull(),
  code: text().notNull(),
  link: text().notNull(),
  plan: text().notNull().default("free"),
  customIcons: custom(v.optional(v.array(v.string()))),
  metadata: text(),
  createdAt: timestamp().notNull().defaultNow(),
}, (t) => [
  uniqueIndex("by_slug").on(t.slug),
  index("by_name").on(t.name),
]);

export const member = convexTable("member", {
  role: text().notNull(),
  userId: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
  organizationId: id("organization").references(() => organization.id, { onDelete: "cascade" }).notNull(),
}, (t) => [
  index("by_role").on(t.role),
  aggregateIndex("by_organizationId").on(t.organizationId),
  index("by_organizationId_userId").on(t.organizationId, t.userId),
  index("by_organizationId_role").on(t.organizationId, t.role),
  index("by_userId").on(t.userId),
]);

export const invitation = convexTable("invitation", {
  role: text(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  email: text().notNull(),
  status: text().notNull(),
  organizationId: id("organization").references(() => organization.id, { onDelete: "cascade" }).notNull(),
  inviterId: id("user").references(() => user.id, { onDelete: "cascade" }),
}, (t) => [
  index("by_email").on(t.email),
  index("by_status").on(t.status),
  index("by_email_organizationId_status").on(t.email, t.organizationId, t.status),
  index("by_organizationId_status").on(t.organizationId, t.status),
  index("by_email_status").on(t.email, t.status),
  index("by_organizationId_email").on(t.organizationId, t.email),
  index("by_organizationId_email_status").on(t.organizationId, t.email, t.status),
  index("by_inviterId").on(t.inviterId),
]);

export const page = convexTable("page", {
  organizationId: id("organization").notNull(),
  parentId: id("page"),
  title: text(),
  icon: text(),
  coverImage: text(),
  sortOrder: text().notNull(),
  isArchived: boolean().notNull(),
  isTrashed: boolean().notNull(),
  trashedAt: timestamp(),
  rowProperties: custom(v.optional(v.array(v.object({
    propertyId: v.id("property"),
    value: v.union(
      v.object({ type: v.literal("title"), value: v.string() }),
      v.object({ type: v.literal("text"), value: v.string() }),
      v.object({ type: v.literal("number"), value: v.number() }),
      v.object({ type: v.literal("checkbox"), value: v.boolean() }),
      v.object({ type: v.literal("date"), value: v.number(), endValue: v.optional(v.number()) }),
      v.object({ type: v.literal("select"), value: v.string() }),
      v.object({ type: v.literal("multi_select"), value: v.array(v.string()) }),
      v.object({ type: v.literal("person"), value: v.array(v.id("user")) }),
      v.object({ type: v.literal("relation"), value: v.array(v.id("page")) }),
      v.object({ type: v.literal("url"), value: v.string() }),
      v.object({ type: v.literal("email"), value: v.string() }),
      v.object({ type: v.literal("phone"), value: v.string() }),
      v.object({ type: v.literal("files"), value: v.array(v.object({ name: v.string(), url: v.string() })) }),
      v.object({ type: v.literal("formula"), value: v.union(v.string(), v.number(), v.boolean()) }),
      v.object({ type: v.literal("rollup"), value: v.union(v.string(), v.number()) }),
      v.object({ type: v.literal("status"), value: v.string() }),
      v.object({ type: v.literal("created_time"), value: v.number() }),
      v.object({ type: v.literal("last_edited_time"), value: v.number() }),
      v.object({ type: v.literal("created_by"), value: v.string() }),
      v.object({ type: v.literal("last_edited_by"), value: v.string() }),
    )
  })))),
  createdAt: timestamp().notNull().defaultNow(),
  createdBy: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  lastEditedBy: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
}, (t) => [
  index("organizationId").on(t.organizationId),
  index("parentId").on(t.parentId),
  index("parentId_sortOrder").on(t.parentId, t.sortOrder),
  index("createdBy").on(t.createdBy),
  index("isTrashed").on(t.isTrashed),
]);

export const database = convexTable("database", {
  organizationId: id("organization").notNull(),
  pageId: id("page").notNull(),
  title: text(),
  icon: text(),
  coverImage: text(),
  position: integer(),
  description: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  lastEditedBy: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
  createdBy: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
}, (t) => [
  index("organizationId").on(t.organizationId),
  index("pageId").on(t.pageId),
  index("createdBy").on(t.createdBy),
]);

export const property = convexTable("property", {
  databaseId: id("database").notNull(),
  type: textEnum([
    "title",
    "text",
    "date",
    "person",
    "files",
    "checkbox",
    "url",
    "email",
    "phone",
    "created_time",
    "created_by",
    "last_edited_time",
    "last_edited_by",
    "select",
    "multi_select",
    "status",
    "number",
    "formula",
    "relation",
    "rollup",
  ] as const).notNull(),
  name: text().notNull(),
  config: custom(
    v.union(
      v.object({ type: v.literal("title") }),
      v.object({ type: v.literal("text") }),
      v.object({ type: v.literal("date") }),
      v.object({ type: v.literal("person") }),
      v.object({ type: v.literal("files") }),
      v.object({ type: v.literal("checkbox") }),
      v.object({ type: v.literal("url") }),
      v.object({ type: v.literal("email") }),
      v.object({ type: v.literal("phone") }),
      v.object({ type: v.literal("created_time") }),
      v.object({ type: v.literal("created_by") }),
      v.object({ type: v.literal("last_edited_time") }),
      v.object({ type: v.literal("last_edited_by") }),
      v.object({
        type: v.literal("select"),
        options: v.array(selectOptionValidator),
      }),
      v.object({
        type: v.literal("multi_select"),
        options: v.array(selectOptionValidator),
      }),
      v.object({
        type: v.literal("status"),
        options: v.array(selectOptionValidator),
        groups: v.array(selectOptionValidator),
      }),
      v.object({
        type: v.literal("number"),
        numberFormat: numberFormatValidator,
      }),
      v.object({
        type: v.literal("formula"),
        expression: v.string(),
      }),
      v.object({
        type: v.literal("relation"),
        relationDatabaseId: v.optional(v.id("database")),
        syncedPropertyId: v.optional(v.string()),
      }),
      v.object({
        type: v.literal("rollup"),
        relationPropertyId: v.string(),
        rollupPropertyId: v.string(),
        rollupFunction: rollupFunctionValidator,
      }),
    )
  ),
  width: integer().notNull(),
  sortOrder: text().notNull(),
  isPrimary: boolean().notNull().default(false),
  isHidden: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
}, (t) => [
  index("by_databaseId").on(t.databaseId),
  index("by_databaseId_sortOrder").on(t.databaseId, t.sortOrder),
]);

export const row = convexTable("row", {
  pageId: id("page").notNull(),
  databaseId: id("database").notNull(),
  createdBy: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
  isArchived: boolean().notNull().default(false),
  order: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
}, (t) => [
  index("by_databaseId_order").on(t.databaseId, t.order),
  index("by_databaseId_isArchived").on(t.databaseId, t.isArchived),
]);

export const tables = { user, session, account, verification, jwks, organization, member, invitation, page, database, property, row };
export const relations = defineRelations(tables, (r) => ({
  organization: {
    members: r.many.member({
      from: r.organization.id,
      to: r.member.organizationId,
    }),
  },
  member: {
    organization: r.one.organization({
      from: r.member.organizationId,
      to: r.organization.id,
    }),
  },
}));

export default defineSchema(tables, { 
  strict: false,
  defaults: {
    defaultLimit: 100,
  },
  plugins: [
    ratelimitPlugin(),
  ],
});
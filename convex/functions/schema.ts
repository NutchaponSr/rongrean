import {
  aggregateIndex,
  arrayOf,
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
  databaseId: id("database"),
  type: textEnum([
    "page",
    "database",
    "paragraph",
    "heading_1",
    "heading_2",
    "heading_3",
    "heading_4",
    "heading_5",
    "heading_6",
    "bulleted_list_item",
    "numbered_list_item",
    "to_do",
    "toggle",
    "quote",
    "callout",
    "divider",
    "code",
    "image",
    "video",
    "file",
    "bookmark",
    "embed",
    "table",
    "table_row",
    "column_list",
    "column",
    "template",
    "synced_block",
  ] as const).notNull(),
  title: text(),
  icon: text(),
  coverImage: text(),
  sortOrder: text().notNull(),
  isArchived: boolean().notNull(),
  isTrashed: boolean().notNull(),
  color: textEnum([
    "default",
    "gray",
    "brown",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "red",
    "gray_background",
    "brown_background",
    "orange_background",
    "yellow_background",
    "green_background",
    "blue_background",
    "purple_background",
    "pink_background",
    "red_background",
  ] as const),
  block: custom(
    v.union(
      v.object({ type: v.literal("page") }),
      v.object({ type: v.literal("database") }),
      v.object({ type: v.literal("divider") }),
      v.object({ type: v.literal("column_list") }),
      v.object({ type: v.literal("column") }),
      v.object({ type: v.literal("table_row"), cells: v.array(richTextBodyValidator) }),
      v.object({ type: v.literal("template") }),
      v.object({ type: v.literal("paragraph"), body: richTextBodyValidator }),
      v.object({ type: v.literal("heading_1"), body: richTextBodyValidator, isToggleable: v.optional(v.boolean()) }),
      v.object({ type: v.literal("heading_2"), body: richTextBodyValidator, isToggleable: v.optional(v.boolean()) }),
      v.object({ type: v.literal("heading_3"), body: richTextBodyValidator, isToggleable: v.optional(v.boolean()) }),
      v.object({ type: v.literal("bulleted_list_item"), body: richTextBodyValidator }),
      v.object({ type: v.literal("numbered_list_item"), body: richTextBodyValidator }),
      v.object({ type: v.literal("toggle"), body: richTextBodyValidator }),
      v.object({ type: v.literal("quote"), body: richTextBodyValidator }),
      v.object({ type: v.literal("callout"), body: richTextBodyValidator, calloutIcon: v.optional(v.string()) }),
      v.object({ type: v.literal("to_do"), body: richTextBodyValidator, checked: v.boolean() }),
      v.object({
        type: v.literal("code"),
        code: v.string(),
        language: v.union(
          v.literal("abap"), v.literal("arduino"), v.literal("bash"), v.literal("basic"),
          v.literal("c"), v.literal("clojure"), v.literal("coffeescript"), v.literal("cpp"),
          v.literal("csharp"), v.literal("css"), v.literal("dart"), v.literal("diff"),
          v.literal("docker"), v.literal("elixir"), v.literal("elm"), v.literal("erlang"),
          v.literal("flow"), v.literal("fortran"), v.literal("fsharp"), v.literal("gherkin"),
          v.literal("glsl"), v.literal("go"), v.literal("graphql"), v.literal("groovy"),
          v.literal("haskell"), v.literal("html"), v.literal("java"), v.literal("javascript"),
          v.literal("json"), v.literal("julia"), v.literal("kotlin"), v.literal("latex"),
          v.literal("less"), v.literal("lisp"), v.literal("livescript"), v.literal("lua"),
          v.literal("makefile"), v.literal("markdown"), v.literal("markup"), v.literal("matlab"),
          v.literal("mermaid"), v.literal("nix"), v.literal("objective_c"), v.literal("ocaml"),
          v.literal("pascal"), v.literal("perl"), v.literal("php"), v.literal("plain_text"),
          v.literal("powershell"), v.literal("prolog"), v.literal("protobuf"), v.literal("python"),
          v.literal("r"), v.literal("reason"), v.literal("ruby"), v.literal("rust"),
          v.literal("sass"), v.literal("scala"), v.literal("scheme"), v.literal("scss"),
          v.literal("shell"), v.literal("sql"), v.literal("swift"), v.literal("typescript"),
          v.literal("vb_net"), v.literal("verilog"), v.literal("vhdl"), v.literal("visual_basic"),
          v.literal("webassembly"), v.literal("xml"), v.literal("yaml"), v.literal("java_or_kotlin"),
        ),
        caption: v.optional(v.string()),
      }),
      v.object({ type: v.literal("image"), url: v.string(), caption: v.optional(v.string()), width: v.optional(v.number()) }),
      v.object({ type: v.literal("video"), url: v.string(), caption: v.optional(v.string()) }),
      v.object({ type: v.literal("file"), url: v.string(), name: v.string(), mimeType: v.optional(v.string()), size: v.optional(v.number()), caption: v.optional(v.string()) }),
      v.object({ type: v.literal("bookmark"), url: v.string(), bookmarkTitle: v.optional(v.string()), description: v.optional(v.string()), previewImage: v.optional(v.string()) }),
      v.object({ type: v.literal("embed"), url: v.string(), caption: v.optional(v.string()) }),
      v.object({ type: v.literal("table"), columnCount: v.number(), hasColumnHeader: v.boolean(), hasRowHeader: v.boolean() }),
      v.object({ type: v.literal("synced_block"), syncedFromPageId: v.optional(v.id("page")) }),
    )
  ),
  trashedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  createdBy: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  lastEditedBy: id("user").references(() => user.id, { onDelete: "cascade" }).notNull(),
}, (t) => [
  index("organizationId").on(t.organizationId),
  index("parentId").on(t.parentId),
  index("databaseId").on(t.databaseId),
  index("organizationId_type").on(t.organizationId, t.type),
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
  name: text().notNull(),
  type: textEnum([
    "title",
    "text",
    "number",
    "select",
    "multi_select",
    "status",
    "date",
    "person",
    "files",
    "checkbox",
    "url",
    "email",
    "phone",
    "formula",
    "relation",
    "rollup",
    "created_time",
    "created_by",
    "last_edited_time",
    "last_edited_by",
  ] as const).notNull(),
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
        relationDatabaseId: v.id("database"),
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
  sortOrder: text().notNull(),
  isPrimary: boolean().notNull().default(false),
  isHidden: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
}, (t) => [
  index("databaseId").on(t.databaseId),
  index("databaseId_type").on(t.databaseId, t.type),
]);

export const cellValue = convexTable("cellValue", {
  pageId: id("page").notNull(),
  propertyId: id("property").notNull(),
  databaseId: id("database").notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  value: custom(
    v.union(
      v.object({ type: v.literal("title"), text: v.string() }),
      v.object({ type: v.literal("text"), text: v.string() }),
      v.object({ type: v.literal("number"), number: v.number() }),
      v.object({ type: v.literal("checkbox"), checkbox: v.boolean() }),
      v.object({ type: v.literal("select"), optionId: v.string() }),
      v.object({ type: v.literal("multi_select"), optionIds: v.array(v.string()) }),
      v.object({ type: v.literal("date"), start: v.number(), end: v.optional(v.number()) }),
      v.object({ type: v.literal("person"), userIds: v.array(v.id("user")) }),
      v.object({
        type: v.literal("files"),
        files: v.array(v.object({
          name: v.string(),
          url: v.string(),
          mimeType: v.optional(v.string()),
        })),
      }),
      v.object({ type: v.literal("url"), url: v.string() }),
      v.object({ type: v.literal("email"), email: v.string() }),
      v.object({ type: v.literal("phone"), phone: v.string() }),
      v.object({ type: v.literal("formula"), result: v.string() }),
      v.object({ type: v.literal("relation"), pageIds: v.array(v.id("page")) }),
      v.object({ type: v.literal("rollup"), result: v.string() }),
      v.object({ type: v.literal("status"), optionId: v.string() }),
      v.object({ type: v.literal("created_time") }),
      v.object({ type: v.literal("created_by") }),
      v.object({ type: v.literal("last_edited_time") }),
      v.object({ type: v.literal("last_edited_by") }),
    )
  )
}, (t) => [
  index("pageId").on(t.pageId),
  index("propertyId").on(t.propertyId),
  index("pageId_propertyId").on(t.pageId, t.propertyId),
  index("databaseId").on(t.databaseId),
]);

export const tables = { user, session, account, verification, jwks, organization, member, invitation, page, database, property, cellValue };
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
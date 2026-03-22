import {
  aggregateIndex,
  boolean,
  convexTable,
  defineRelations,
  defineSchema,
  id,
  index,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from "better-convex/orm";

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
  index("by_identifier").on(t.identifier),
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

export const tables = { user, session, account, verification, jwks, organization, member, invitation };
export const relations = defineRelations(tables)
export default defineSchema(tables, { strict: false });
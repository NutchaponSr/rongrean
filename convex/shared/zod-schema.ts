import z from "zod";

const selectOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
});

const numberFormatSchema = z.enum([
  "number", "dollar", "euro", "pound", "baht", 
  "yen", "percent", "rupee", "won", "ruble"
]);

const rollupFunctionSchema = z.enum([
  "count", "count_values", "sum", "average", "min", "max", 
  "median", "percent_empty", "percent_not_empty", 
  "show_original", "show_unique"
]);

export const propertyConfigSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title") }),
  z.object({ type: z.literal("text") }),
  z.object({ type: z.literal("date") }),
  z.object({ type: z.literal("person") }),
  z.object({ type: z.literal("files") }),
  z.object({ type: z.literal("checkbox") }),
  z.object({ type: z.literal("url") }),
  z.object({ type: z.literal("email") }),
  z.object({ type: z.literal("phone") }),
  z.object({ type: z.literal("created_time") }),
  z.object({ type: z.literal("created_by") }),
  z.object({ type: z.literal("last_edited_time") }),
  z.object({ type: z.literal("last_edited_by") }),
  z.object({
    type: z.literal("select"),
    options: z.array(selectOptionSchema),
  }),
  z.object({
    type: z.literal("multi_select"),
    options: z.array(selectOptionSchema),
  }),
  z.object({
    type: z.literal("status"),
    options: z.array(selectOptionSchema),
    groups: z.array(selectOptionSchema),
  }),
  z.object({
    type: z.literal("number"),
    numberFormat: numberFormatSchema,
  }),
  z.object({
    type: z.literal("formula"),
    expression: z.string(),
  }),
  z.object({
    type: z.literal("relation"),
    relationDatabaseId: z.string().optional(),
    syncedPropertyId: z.string().optional(),
  }),
  z.object({
    type: z.literal("rollup"),
    relationPropertyId: z.string(),
    rollupPropertyId: z.string(),
    rollupFunction: rollupFunctionSchema,
  }),
]);

export type PropertyConfig = z.infer<typeof propertyConfigSchema>;

export function getDefaultConfig(type: PropertyConfig["type"]): PropertyConfig {
  switch (type) {
    case "number":       return { type, numberFormat: "number" };
    case "select":       return { type, options: [] };
    case "multi_select": return { type, options: [] };
    case "status":       return { type, options: [], groups: [] };
    case "formula":      return { type, expression: "" };
    case "relation":     return { type };
    case "rollup":       return { type, relationPropertyId: "", rollupPropertyId: "", rollupFunction: "count" };
    default:             return { type };
  }
}

export const propertyValueSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title"), value: z.string() }),
  z.object({ type: z.literal("text"), value: z.string() }),
  z.object({ type: z.literal("number"), value: z.number() }),
  z.object({ type: z.literal("checkbox"), value: z.boolean() }),
  z.object({ type: z.literal("date"), value: z.number(), endValue: z.number().optional() }),
  z.object({ type: z.literal("select"), value: z.string() }),
  z.object({ type: z.literal("multi_select"), value: z.array(z.string()) }),
  z.object({ type: z.literal("person"), value: z.array(z.string()) }),
  z.object({ type: z.literal("relation"), value: z.array(z.string()) }),
  z.object({ type: z.literal("url"), value: z.string() }),
  z.object({ type: z.literal("email"), value: z.string() }),
  z.object({ type: z.literal("phone"), value: z.string() }),
  z.object({ type: z.literal("files"), value: z.array(z.object({ name: z.string(), url: z.string() })) }),
  z.object({ type: z.literal("formula"), value: z.union([z.string(), z.number(), z.boolean()]) }),
  z.object({ type: z.literal("rollup"), value: z.union([z.string(), z.number()]) }),
  z.object({ type: z.literal("status"), value: z.string() }),
  z.object({ type: z.literal("created_time"), value: z.number() }),
  z.object({ type: z.literal("last_edited_time"), value: z.number() }),
  z.object({ type: z.literal("created_by"), value: z.string() }),
  z.object({ type: z.literal("last_edited_by"), value: z.string() }),
]);

export type PropertyValue = z.infer<typeof propertyValueSchema>;


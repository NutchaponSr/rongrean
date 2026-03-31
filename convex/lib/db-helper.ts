import { PropertyConfig } from "../shared/zod-schema";
import { Id } from "../functions/_generated/dataModel";

type PropertyValue =
  | { type: "title";        value: string }
  | { type: "text";         value: string }
  | { type: "number";       value: number }
  | { type: "checkbox";     value: boolean }
  | { type: "date";         value: number; endValue?: number }
  | { type: "select";       value: string }
  | { type: "multi_select"; value: string[] }
  | { type: "person";       value: Id<"user">[] }
  | { type: "relation";     value: Id<"page">[] }
  | { type: "url";          value: string }
  | { type: "email";        value: string }
  | { type: "phone";        value: string }
  | { type: "files";        value: { name: string; url: string }[] }
  | { type: "formula";      value: string | number | boolean }
  | { type: "rollup";       value: string | number }
  | { type: "status";            value: string }
  | { type: "created_time";      value: number }
  | { type: "last_edited_time";  value: number }
  | { type: "created_by";        value: string }
  | { type: "last_edited_by";    value: string };

const COMPUTED_TYPES = new Set([
  "formula",
  "rollup",
  "created_time",
  "last_edited_time",
  "created_by",
  "last_edited_by",
]);

export function getDefaultValue(
  config: Pick<PropertyConfig, "type">
): PropertyValue | null {
  if (COMPUTED_TYPES.has(config.type)) return null;

  switch (config.type) {
    case "title":        return { type: "title",        value: "" };
    case "text":         return { type: "text",         value: "" };
    case "number":       return { type: "number",       value: 0 };
    case "checkbox":     return { type: "checkbox",     value: false };
    case "date":         return null;
    case "select":       return { type: "select",       value: "" };
    case "multi_select": return { type: "multi_select", value: [] };
    case "person":       return { type: "person",       value: [] };
    case "relation":     return { type: "relation",     value: [] };
    case "url":          return { type: "url",          value: "" };
    case "email":        return { type: "email",        value: "" };
    case "phone":        return { type: "phone",        value: "" };
    case "files":        return { type: "files",        value: [] };
    default:             return null;
  }
}
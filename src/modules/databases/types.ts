import { ApiOutputs } from "@convex/api";
import { IconType } from "react-icons/lib";

export const LAYOUT_TYPES = ["table"] as const;
export const PROPERTY_TYPES = [
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
] as const;

export type LayoutType = (typeof LAYOUT_TYPES)[number];
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export type Cell = NonNullable<ApiOutputs["database"]["getOne"]["rows"][0]["page"]["rowProperties"]>[number]["value"];

export interface PropertyProps {
  value: PropertyType;
  label: string;
  isPremium: boolean;
  definition?: string;
  icon: IconType;
}
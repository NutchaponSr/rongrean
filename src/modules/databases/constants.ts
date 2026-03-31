import { RiFunctions, RiLoader2Fill } from "react-icons/ri";
import { GoCalendar, GoHash, GoLink, GoMention, GoPaperclip, GoSearch } from "react-icons/go";
import { BsBoxArrowUpRight, BsCardList, BsCardText, BsCaretDownSquare, BsCheckSquareFill, BsClockFill, BsFillTelephoneFill, BsPencilFill, BsPeopleFill, BsPersonFill, BsType } from "react-icons/bs";

import { PropertyProps, PropertyType } from "@/modules/databases/types";
import { IconType } from "react-icons/lib";

export const properties: PropertyProps[] = [
  {
    value: "title",
    label: "Title",
    icon: BsType,
    isPremium: false,
  },
  {
    value: "text",
    label: "Text",
    icon: BsCardText,
    isPremium: false,
    definition: "Add text that can be formatted. Get to summarizes, notes or descriptions",
  },
  {
    value: "number",
    label: "Number",
    icon: GoHash,
    isPremium: false,
  },
  {
    value: "select",
    label: "Select",
    icon: BsCaretDownSquare,
    isPremium: false,
  },
  {
    value: "multi_select",
    label: "Multi-select",
    icon: BsCardList,
    isPremium: false,
  },
  {
    value: "status",
    label: "Status",
    icon: RiLoader2Fill,
    isPremium: false,
    definition: "Track the item's progress using status tags categorized by TO-DO, in progress, and complete.",
  },
  {
    value: "date",
    label: "Date",
    icon: GoCalendar,
    isPremium: false,
  },
  {
    value: "person",
    label: "Person",
    icon: BsPeopleFill,
    isPremium: false,
  },
  {
    value: "files",
    label: "Files & media",
    icon: GoPaperclip,
    isPremium: false,
  },
  {
    value: "checkbox",
    label: "Checkbox",
    icon: BsCheckSquareFill,
    isPremium: false,
  },
  {
    value: "url",
    label: "URL",
    icon: GoLink,
    isPremium: false,
  },
  {
    value: "email",
    label: "Email",
    icon: GoMention,
    isPremium: false,
  },
  {
    value: "phone",
    label: "Phone",
    icon: BsFillTelephoneFill,
    isPremium: false,
  },
  {
    value: "formula",
    label: "Formula",
    icon: RiFunctions,
    isPremium: false,
  },
  {
    value: "relation",
    label: "Relation",
    icon: BsBoxArrowUpRight,
    isPremium: false,
  },
  {
    value: "rollup",
    label: "Rollup",
    icon: GoSearch,
    isPremium: false,
  },
  {
    value: "created_time",
    label: "Created time",
    icon: BsClockFill,
    isPremium: false,
  },
  {
    value: "created_by",
    label: "Created by",
    icon: BsPersonFill,
    isPremium: false,
  },
  {
    value: "last_edited_time",
    label: "Last edited time",
    icon: BsPencilFill,
    isPremium: false,
  },
  {
    value: "last_edited_by",
    label: "Last edited by",
    icon: BsPersonFill,
    isPremium: false,
  },
];

export const propertyIconMap = Object.fromEntries(
  properties.map((p) => [p.value, p.icon])
) as Record<PropertyType, IconType>;
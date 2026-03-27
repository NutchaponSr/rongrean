import icons from "../constants/emojis.json";

import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomIcon() {
  const CATEGORIES = Object.keys(icons) as (keyof typeof icons)[];
  const ALL_EMOJIS = CATEGORIES.flatMap((c) => Object.values(icons[c]).map((n) => ({ name: n, category: c as string })));

  return ALL_EMOJIS[Math.floor(Math.random() * ALL_EMOJIS.length)].name;
}

export function formatCategory(category: string) {
  const result = category.split("-").join(" ")
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function formatName(name: string) {
  name = name.split("twemoji:").join("");
  return formatCategory(name);
}
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "./types";
import en from "./en";
import ar from "./ar";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

/** Returns the copy for a locale. Static import keeps it fully server-rendered. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary } from "./types";

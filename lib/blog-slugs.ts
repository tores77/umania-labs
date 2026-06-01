import type { Locale } from "@/i18n/routing";

const SLUG_PAIRS: Array<{ es: string; en: string }> = [
  {
    es: "por-que-tu-web-no-aparece-en-chatgpt",
    en: "why-your-website-doesnt-appear-in-chatgpt",
  },
];

export function getBlogLanguageSlugs(
  slug: string,
  locale: string
): { es: string; en: string } {
  for (const pair of SLUG_PAIRS) {
    if (pair.es === slug || pair.en === slug) {
      return pair;
    }
  }
  return { es: slug, en: slug };
}

export function getBlogTranslationSlug(slug: string, locale: Locale): string {
  const slugs = getBlogLanguageSlugs(slug, locale);
  return locale === "es" ? slugs.en : slugs.es;
}

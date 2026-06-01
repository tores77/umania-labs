import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/briefing": "/briefing",
    "/privacy": {
      es: "/privacidad",
      en: "/privacy",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

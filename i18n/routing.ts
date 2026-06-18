import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/briefing": "/briefing",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/privacy": {
      es: "/privacidad",
      en: "/privacy",
    },
    "/services/luxury-villas": {
      es: "/servicios/diseno-web-villas-lujo-mallorca",
      en: "/services/luxury-villa-real-estate-web-design",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

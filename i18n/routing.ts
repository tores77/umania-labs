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
    "/services/fine-dining": {
      es: "/servicios/diseno-web-restaurantes-alta-gama-mallorca",
      en: "/services/fine-dining-restaurant-web-design-mallorca",
    },
    "/services/yacht-charter": {
      es: "/servicios/diseno-web-empresas-charter-yates-mallorca",
      en: "/services/yacht-charter-web-design-mallorca",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

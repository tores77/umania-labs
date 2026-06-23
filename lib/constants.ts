export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/umanialabs";

/** Digits only — strips accidental wa.me/ or + prefixes from env vars. */
function normalizeWhatsAppNumber(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\/(?:api\.)?whatsapp\.com\/send\?phone=/i, "")
    .replace(/^https?:\/\/wa\.me\//i, "")
    .replace(/\?.*$/, "")
    .replace(/^\+/, "");
}

export const WHATSAPP_NUMBER = normalizeWhatsAppNumber(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "34676967465",
);

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio.umanialabs.com";

export function whatsappLink(locale: "es" | "en") {
  const text =
    locale === "es"
      ? "Hola Umania Labs, me gustaría hablar sobre mi proyecto web."
      : "Hi Umania Labs, I'd like to talk about my web project.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function whatsappDirect() {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}

export function whatsappLuxuryVillasLink(locale: "es" | "en") {
  const text =
    locale === "es"
      ? "Hola Umania Labs, me interesa diseño web para inmobiliaria de villas de lujo en Mallorca."
      : "Hi Umania Labs, I'm interested in luxury villa real estate web design in Mallorca.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function whatsappFineDiningLink(locale: "es" | "en") {
  const text =
    locale === "es"
      ? "Hola Umania Labs, me interesa diseño web para restaurantes de alta gama en Mallorca."
      : "Hi Umania Labs, I'm interested in fine dining restaurant web design in Mallorca.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const BRIEFING_SUBSCRIBE_URL =
  "https://briefing.umanialabs.com/api/subscribe";

export const BRIEFING_LANDING_URL =
  "https://briefing.umanialabs.com/suscribirse";

export const BRIEFING_TEAL = "#2DD4BF";

export const VILLA_HERO_IMAGE = "/villa-hero-2.jpg";
export const VILLA_HERO_WIDTH = 1071;
export const VILLA_HERO_HEIGHT = 1920;

export const RESTAURANT_HERO_IMAGE = "/restaurant-2.jpg";
export const RESTAURANT_HERO_VIDEO = "/restaurant-hero.mp4";
export const RESTAURANT_HERO_WIDTH = 1920;
export const RESTAURANT_HERO_HEIGHT = 1071;

export const RESTAURANT_GALLERY_IMAGES = [
  "/restaurant-2.jpg",
  "/restaurant-3.jpg",
  "/restaurant-4.jpg",
  "/restaurant-5.jpg",
  "/restaurant-6.jpg",
] as const;

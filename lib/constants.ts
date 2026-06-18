export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/umanialabs";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "34676967465";

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

export const BRIEFING_SUBSCRIBE_URL =
  "https://briefing.umanialabs.com/api/subscribe";

export const BRIEFING_LANDING_URL =
  "https://briefing.umanialabs.com/suscribirse";

export const BRIEFING_TEAL = "#2DD4BF";

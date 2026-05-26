export type Locale = "es" | "en";

export const WHATSAPP = {
  es: {
    cta: "https://wa.me/34676967465?text=Hola%20Umania%20Labs%2C%20me%20gustar%C3%ADa%20hablar%20sobre%20mi%20proyecto%20web.",
    link: "https://wa.me/34676967465",
  },
  en: {
    cta: "https://wa.me/34676967465?text=Hi%20Umania%20Labs%2C%20I%27d%20like%20to%20talk%20about%20my%20web%20project.",
    link: "https://wa.me/34676967465",
  },
} as const;

const es = {
  nav: {
    work: "WORK",
    process: "PROCESS",
    contact: "CONTACT",
  },
  lang: {
    switchTo: "EN",
    ariaLabel: "Switch to English",
  },
  hero: {
    videos: [
      {
        label: "EL PROCESO · DE PRINCIPIO A FIN",
        line1: "Nos conocemos.",
        line2: "Cuéntanos tu proyecto.",
      },
      {
        label: "FASE 01 · DISEÑO",
        line1: "Diseñamos tu",
        line2: "identidad visual.",
      },
      {
        label: "FASE 02 · ITERACIÓN",
        line1: "Lo revisamos juntos.",
        line2: "Hasta que sea perfecto.",
      },
      {
        label: "FASE 03 · ENTREGA",
        line1: "Lo construimos.",
        line2: "Lo lanzamos. En semanas.",
      },
    ],
  },
  portfolio: {
    title: "Nuestro trabajo",
    subtitle: "habla por nosotros.",
    meta: "6 PROYECTOS · DISTINTOS SECTORES",
    scrollHint: "DESLIZA →",
    progressAria: "Progreso del portfolio",
    cards: [
      { category: "WEB PREMIUM", niche: "Real Estate" },
      { category: "WEB PREMIUM", niche: "Yacht Charter" },
      { category: "APP", niche: "Club Deportivo" },
      { category: "WEB PREMIUM", niche: "Arquitectura" },
      { category: "E-COMMERCE", niche: "Moda Premium" },
      { category: "LANDING", niche: "Restauración" },
    ],
  },
  process: {
    label: "CÓMO TRABAJAMOS",
    steps: [
      {
        title: "BRIEF",
        description:
          "Entendemos tu negocio, tu sector y lo que necesitas que la web haga por ti.",
      },
      {
        title: "DISEÑO",
        description:
          "Concepto visual, copy y motion. Todo alineado con tu marca antes de escribir código.",
      },
      {
        title: "BUILD",
        description:
          "Next.js, GSAP, IA y WebGL cuando hace falta. Desarrollo ágil, sin plantillas.",
      },
      {
        title: "DEPLOY",
        description:
          "Lanzamiento, optimización y entrega. Semanas, no meses. Listo para ganar premios.",
      },
    ],
  },
  studioEnd: {
    label: "¿LISTO PARA EMPEZAR?",
    headline1: "Tu web más importante",
    headline2: "aún no existe.",
    sub: "La construimos juntos. En semanas, no en meses.",
    cta: "Agendar llamada →",
    response: "Respondemos en menos de 24h · Mallorca, España",
    footerWhatsApp: "Escríbenos por WhatsApp →",
    footerLocation: "Mallorca, España",
  },
} as const;

const en = {
  nav: {
    work: "WORK",
    process: "PROCESS",
    contact: "CONTACT",
  },
  lang: {
    switchTo: "ES",
    ariaLabel: "Switch to Spanish",
  },
  hero: {
    videos: [
      {
        label: "THE PROCESS · START TO FINISH",
        line1: "We get to know you.",
        line2: "Tell us about your project.",
      },
      {
        label: "PHASE 01 · DESIGN",
        line1: "We design your",
        line2: "visual identity.",
      },
      {
        label: "PHASE 02 · ITERATION",
        line1: "We review together.",
        line2: "Until it's perfect.",
      },
      {
        label: "PHASE 03 · DELIVERY",
        line1: "We build it.",
        line2: "We launch it. In weeks.",
      },
    ],
  },
  portfolio: {
    title: "Our work",
    subtitle: "speaks for itself.",
    meta: "6 PROJECTS · DIFFERENT SECTORS",
    scrollHint: "SCROLL →",
    progressAria: "Portfolio progress",
    cards: [
      { category: "WEB PREMIUM", niche: "Real Estate" },
      { category: "WEB PREMIUM", niche: "Yacht Charter" },
      { category: "APP", niche: "Sports Club" },
      { category: "WEB PREMIUM", niche: "Architecture" },
      { category: "E-COMMERCE", niche: "Premium Fashion" },
      { category: "LANDING", niche: "Hospitality" },
    ],
  },
  process: {
    label: "HOW WE WORK",
    steps: [
      {
        title: "BRIEF",
        description:
          "We understand your business, your sector, and what you need the website to do for you.",
      },
      {
        title: "DESIGN",
        description:
          "Visual concept, copy, and motion. Everything aligned with your brand before writing code.",
      },
      {
        title: "BUILD",
        description:
          "Next.js, GSAP, AI, and WebGL when needed. Agile development, no templates.",
      },
      {
        title: "DEPLOY",
        description:
          "Launch, optimization, and delivery. Weeks, not months. Ready to win awards.",
      },
    ],
  },
  studioEnd: {
    label: "READY TO START?",
    headline1: "Your most important website",
    headline2: "doesn't exist yet.",
    sub: "We build it together. In weeks, not months.",
    cta: "Book a call →",
    response: "We reply within 24h · Mallorca, Spain",
    footerWhatsApp: "Message us on WhatsApp →",
    footerLocation: "Mallorca, Spain",
  },
} as const;

export const translations = { es, en } as const;

export type Translations = (typeof translations)[Locale];

export const STORAGE_KEY = "umania-locale";

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "en") return stored;
  return navigator.language.startsWith("en") ? "en" : "es";
}

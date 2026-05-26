import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import LanguageProvider from "@/components/LanguageProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://umanialabs.com"),
  title: {
    default: "Umania Labs — Award-Winning Web Studio · Mallorca",
    template: "%s · Umania Labs",
  },
  description:
    "Studio de diseño web premium en Mallorca. Construimos webs nivel Awwwards con IA, GSAP y WebGL. Entregamos en semanas, no en meses.",
  keywords: [
    "Umania Labs",
    "web studio",
    "Mallorca",
    "Awwwards",
    "GSAP",
    "Three.js",
    "premium web design",
    "diseño web Mallorca",
  ],
  authors: [{ name: "Umania Labs" }],
  creator: "Umania Labs",
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    title: "Umania Labs — Award-Winning Web Studio · Mallorca",
    description:
      "Entramos donde otros no llegan. Studio de diseño web premium con IA basado en Mallorca.",
    siteName: "Umania Labs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umania Labs — Award-Winning Web Studio",
    description:
      "Entramos donde otros no llegan. Studio premium con IA · Mallorca.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${syne.variable} ${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>
        <LanguageProvider>
          <Preloader />
          <Cursor />
          <Nav />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

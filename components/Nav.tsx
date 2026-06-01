"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import LangToggle from "@/components/LangToggle";
import { CALENDLY_URL } from "@/lib/constants";

const LINKS = [
  { href: "#services", key: "services" as const },
  { href: "#packages", key: "packages" as const },
  { href: "#portfolio", key: "work" as const },
  { href: "#process", key: "process" as const },
  { href: "#agent", key: "agent" as const },
  { href: "#contact", key: "contact" as const },
];

export default function Nav() {
  const t = useTranslations("nav");
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 200 && y > lastY) setHidden(true);
      else setHidden(false);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <nav
      aria-label="Primary"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "20px clamp(20px, 5vw, 40px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pointerEvents: "none",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        background: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <a
        href="#top"
        data-cursor="HOME"
        className="text-label"
        style={{
          color: "var(--fg)",
          textDecoration: "none",
          pointerEvents: "auto",
          fontSize: 11,
          letterSpacing: "0.3em",
        }}
      >
        UMANIA LABS
      </a>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          pointerEvents: "auto",
        }}
      >
        <div className="hidden sm:flex items-center gap-6">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              data-cursor="GO"
              className="text-label"
              style={{
                color: "var(--fg-muted)",
                textDecoration: "none",
                fontSize: 9,
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")
              }
            >
              {t(l.key)}
            </a>
          ))}
        </div>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn"
          style={{ padding: "10px 20px", fontSize: 9, display: "none" }}
          id="nav-cta-desktop"
        >
          {t("contact")}
        </a>
        <LangToggle />
      </div>

      <style jsx global>{`
        @media (min-width: 1100px) {
          #nav-cta-desktop {
            display: inline-flex !important;
          }
        }
      `}</style>
    </nav>
  );
}

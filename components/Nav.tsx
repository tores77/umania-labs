"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import LangToggle from "@/components/LangToggle";
import { CALENDLY_URL } from "@/lib/constants";
import { subscribeLenisScroll } from "@/lib/scroll";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const lastYRef = useRef(0);

  useEffect(() => {
    const update = (y: number) => {
      if (menuOpen) return;
      if (y > 200 && y > lastYRef.current) setHidden(true);
      else setHidden(false);
      lastYRef.current = y;
    };

    const mobile = window.matchMedia("(max-width: 767px)").matches;

    if (mobile) {
      const onScroll = () => update(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    return subscribeLenisScroll(update);
  }, [menuOpen]);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
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
          transform: hidden && !menuOpen ? "translateY(-100%)" : "translateY(0)",
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
          <div className="nav-desktop-links hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <a
                key={l.key}
                href={l.href}
                data-cursor="GO"
                className="text-label"
                style={{
                  color:
                    activeHash === l.href ? "var(--accent)" : "var(--fg-muted)",
                  textDecoration: "none",
                  fontSize: 9,
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (activeHash !== l.href) {
                    (e.currentTarget as HTMLElement).style.color = "var(--fg)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    activeHash === l.href ? "var(--accent)" : "var(--fg-muted)";
                }}
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
          <button
            type="button"
            className="nav-menu-toggle md:hidden"
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-menu"
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 5,
              width: 44,
              height: 44,
              padding: 0,
              background: "transparent",
              border: "1px solid var(--line)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                display: "block",
                width: 18,
                height: 1,
                background: menuOpen ? "var(--accent)" : "var(--fg)",
                margin: "0 auto",
                transition: "background 0.3s, transform 0.3s",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1,
                background: "var(--fg)",
                margin: "0 auto",
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1,
                background: menuOpen ? "var(--accent)" : "var(--fg)",
                margin: "0 auto",
                transition: "background 0.3s, transform 0.3s",
                transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
              }}
            />
          </button>
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

      <div
        id="nav-mobile-menu"
        className="nav-mobile-overlay md:hidden"
        aria-hidden={!menuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "var(--bg)",
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          padding: "80px 32px 48px",
        }}
      >
        {LINKS.map((l) => (
          <a
            key={l.key}
            href={l.href}
            className="text-label"
            onClick={closeMenu}
            style={{
              color: activeHash === l.href ? "var(--accent)" : "var(--fg)",
              textDecoration: "none",
              fontSize: 14,
              letterSpacing: "0.25em",
              padding: "12px 0",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
            }}
          >
            {t(l.key)}
          </a>
        ))}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn-outline"
          onClick={closeMenu}
          style={{ marginTop: 24, minHeight: 44 }}
        >
          {t("contact")}
        </a>
      </div>
    </>
  );
}

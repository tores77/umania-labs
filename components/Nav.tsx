"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#portfolio", label: "WORK" },
  { href: "#process", label: "PROCESS" },
  { href: "#contact", label: "CONTACT" },
];

export default function Nav() {
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
        padding: "22px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pointerEvents: "none",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        background: "rgba(250, 250, 248, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "0.5px solid var(--line)",
      }}
    >
      <a
        href="#top"
        data-cursor="HOME"
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.35em",
          color: "var(--fg)",
          textDecoration: "none",
          pointerEvents: "auto",
        }}
      >
        UMANIA LABS
      </a>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          pointerEvents: "auto",
        }}
        className="hidden sm:flex"
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            data-cursor="GO"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "var(--fg-muted)",
              textDecoration: "none",
              transition: "color 0.3s ease-out",
              display: "inline-flex",
              alignItems: "center",
              gap: 28,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--fg-muted)")
            }
          >
            {i > 0 && (
              <span
                aria-hidden
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 999,
                  background: "var(--fg-subtle)",
                  marginRight: 28,
                  marginLeft: -28,
                }}
              />
            )}
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

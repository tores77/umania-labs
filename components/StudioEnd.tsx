"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export default function StudioEnd() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=10%",
        },
      });

      tl.from(labelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          headlineRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          subRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section"
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "140px 8vw 120px",
        paddingBottom: "max(120px, calc(80px + env(safe-area-inset-bottom, 0px)))",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(200, 169, 110, 0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "min(900px, 100%)",
          textAlign: "center",
        }}
      >
        <div
          ref={labelRef}
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "var(--fg-muted)",
            marginBottom: 48,
          }}
        >
          ¿LISTO PARA EMPEZAR?
        </div>

        <div ref={headlineRef}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(32px, 6vw, 80px)",
              color: "var(--fg)",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Tu web más importante
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "clamp(32px, 6vw, 80px)",
              color: "var(--fg-muted)",
              lineHeight: 1.05,
              margin: "8px 0 0",
            }}
          >
            aún no existe.
          </p>
        </div>

        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 300,
            fontSize: 18,
            color: "var(--fg-muted)",
            marginTop: 36,
            lineHeight: 1.55,
          }}
        >
          La construimos juntos. En semanas, no en meses.
        </p>

        <div
          ref={ctaRef}
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <a
            href="mailto:hola@umanialabs.com"
            data-cursor="LET'S TALK"
            className="studio-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "18px 48px",
              background: "var(--fg)",
              color: "var(--bg)",
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.1em",
              borderRadius: 2,
              textDecoration: "none",
              transition: "background 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--accent-warm)";
              el.style.color = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--fg)";
              el.style.color = "var(--bg)";
            }}
          >
            Agendar llamada →
          </a>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: 12,
              color: "var(--fg-muted)",
            }}
          >
            Respondemos en menos de 24h · Mallorca, España
          </span>
        </div>
      </div>

      <footer
        style={{
          position: "absolute",
          bottom: "max(24px, env(safe-area-inset-bottom, 0px))",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 8vw",
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: "0.05em",
          color: "var(--fg-muted)",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        © 2026 Umania Labs · Mallorca, España · hola@umanialabs.com
      </footer>

      <style jsx global>{`
        .studio-cta:focus-visible {
          outline: 2px solid var(--accent-warm);
          outline-offset: 4px;
        }
      `}</style>
    </section>
  );
}

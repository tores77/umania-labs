"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export default function RoomWebGL() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const stars2Ref = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Slow infinite planet rotation
      if (planetRef.current) {
        gsap.to(planetRef.current, {
          rotate: 360,
          duration: 80,
          ease: "none",
          repeat: -1,
        });
      }
      // Slow drift parallax for star layers as section scrolls
      gsap.to(starsRef.current, {
        backgroundPosition: "100px -60px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(stars2Ref.current, {
        backgroundPosition: "-160px 80px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Background bg-color shift from green to deep space
      gsap.to(sceneRef.current, {
        backgroundColor: "#02040A",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      });

      // Copy fade in
      gsap.from(copyRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=15%",
        },
      });

      // Fade out scene at end (transition to next section)
      gsap.to(sceneRef.current, {
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom bottom-=15%",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="room-webgl"
      className="section"
      style={{ height: "120vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          ref={sceneRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "#0D1A0D",
            transition: "opacity 0.6s ease-out",
          }}
        >
          <div ref={starsRef} className="starfield" />
          <div ref={stars2Ref} className="starfield-2" />
          <div ref={planetRef} className="planet" />
          {/* Atmospheric glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 50%, transparent 38%, rgba(125,196,65,0.06) 42%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Copy overlay */}
        <div
          ref={copyRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8vw",
            textAlign: "center",
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "var(--accent)",
              marginBottom: 24,
            }}
          >
            SALA 03 · TECNOLOGÍA
          </div>
          <h2
            className="text-display"
            style={{
              fontSize: "clamp(36px, 5.4vw, 76px)",
              margin: 0,
              color: "var(--fg)",
              maxWidth: 900,
            }}
          >
            Nosotros también
            <br />
            vivimos en nuestras webs.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.3vw, 16px)",
              color: "var(--fg-muted)",
              maxWidth: 480,
              marginTop: 28,
              lineHeight: 1.6,
            }}
          >
            Esta es la web de Umania Labs. Construida con
            <br />
            CSS 3D, GSAP y la obsesión de quienes la firman.
          </p>
          <a
            href="#"
            data-cursor="SOURCE"
            style={{
              marginTop: 36,
              fontFamily: "var(--font-space-grotesk)",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid var(--accent-line)",
              paddingBottom: 6,
            }}
          >
            VER EL CÓDIGO FUENTE
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

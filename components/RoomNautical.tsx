"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerGsap } from "@/lib/gsap";

const DATA = [
  { label: "Cliente",    value: "Our Moment Charter" },
  { label: "Sector",     value: "Yacht Charter · Lujo" },
  { label: "Técnica",    value: "Scroll-scrubbed video" },
  { label: "Stack",      value: "Next.js 15 · GSAP · Higgsfield" },
  { label: "Resultado",  value: "Web nivel Awwwards · 48h" },
];

export default function RoomNautical() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Label typewriter-like reveal
      gsap.from(labelRef.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.7,
        ease: "steps(20)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=20%",
        },
      });

      // Headline + sub stagger
      const animTargets = [
        headlineRef.current,
        mockupRef.current,
        dataRef.current,
        quoteRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.from(animTargets, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=15%",
        },
      });

      // Parallax on mockup while scrolling section
      if (mockupRef.current) {
        gsap.to(mockupRef.current, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="room-nautical"
      className="section"
      style={{ height: "150vh", position: "relative", background: "var(--surface)" }}
    >
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--surface)",
        }}
      />
      {/* Subtle gold caustics gradient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(196,165,108,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(20,40,55,0.4) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "0 8vw",
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto 1fr auto",
            gap: 28,
            alignContent: "center",
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: 110,
            }}
          >
            <div>
              <div
                ref={labelRef}
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: "var(--accent-warm)",
                  marginBottom: 18,
                }}
              >
                SALA 01 · NÁUTICA
              </div>
              <h2
                ref={headlineRef}
                className="text-display"
                style={{
                  fontSize: "clamp(36px, 5.4vw, 76px)",
                  margin: 0,
                  color: "var(--fg)",
                }}
              >
                Our Moment Charter
              </h2>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 12,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                  marginTop: 12,
                }}
              >
                Yacht Charter · Mallorca
              </div>
            </div>
          </div>

          {/* Mockup + data row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "5vw",
              alignItems: "center",
            }}
          >
            {/* Mockup */}
            <div
              ref={mockupRef}
              style={{
                perspective: "1500px",
              }}
            >
              <div
                style={{
                  transform:
                    "rotateY(-7deg) rotateX(4deg) translateZ(0)",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                }}
                className="ourmoment-mockup-wrap"
              >
                <div className="frame-browser" style={{ aspectRatio: "16/10" }}>
                  <div className="frame-browser-bar">
                    <div className="frame-browser-dot" />
                    <div className="frame-browser-dot" />
                    <div className="frame-browser-dot" />
                    <div
                      style={{
                        marginLeft: 12,
                        fontFamily: "var(--font-space-mono)",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: "var(--fg-muted)",
                      }}
                    >
                      ourmomentcharter.com
                    </div>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      background: "#06121A",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src="/mockup-ourmoment.png"
                      alt="Our Moment Charter — captura del proyecto"
                      fill
                      sizes="(max-width: 1280px) 60vw, 720px"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                    {/* Subtle inner shadow for depth */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.45) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Floor reflection */}
                <div
                  aria-hidden
                  style={{
                    height: 40,
                    marginTop: 8,
                    background:
                      "linear-gradient(180deg, rgba(196,165,108,0.06) 0%, transparent 100%)",
                    filter: "blur(8px)",
                    transformOrigin: "top center",
                    transform: "scaleY(-1)",
                  }}
                />
              </div>
            </div>

            {/* Data column */}
            <div
              ref={dataRef}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: "var(--fg-muted)",
                  marginBottom: 8,
                }}
              >
                FICHA TÉCNICA
              </div>
              <div className="divider" />
              {DATA.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr",
                    gap: 18,
                    paddingBlock: 6,
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      color: "var(--fg-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "var(--fg)",
                    }}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote row */}
          <div
            ref={quoteRef}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 50,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(14px, 1.4vw, 18px)",
                color: "var(--fg-muted)",
                margin: 0,
                maxWidth: 540,
              }}
            >
              &ldquo;Nivel Apple. El scroll controla la cámara.&rdquo;
            </p>
            <a
              href="#"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                borderBottom: "1px solid var(--line)",
                paddingBottom: 8,
              }}
            >
              VER CASO
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

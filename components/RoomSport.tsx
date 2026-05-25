"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerGsap } from "@/lib/gsap";

const DATA = [
  { label: "Cliente",   value: "SET · Padel Club (concept)" },
  { label: "Sector",    value: "Deporte premium · Lifestyle" },
  { label: "Técnica",   value: "App design + Landing web" },
  { label: "Stack",     value: "Next.js 15 · Tailwind · Framer Motion" },
  { label: "Resultado", value: "Identidad digital completa · 72h" },
];

export default function RoomSport() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const devicesRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.7,
        ease: "steps(20)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=20%",
        },
      });

      const animTargets = [
        headlineRef.current,
        devicesRef.current,
        dataRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.from(animTargets, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=15%",
        },
      });

      // Elastic bounce on devices
      const desktop = devicesRef.current?.querySelector<HTMLElement>(
        "[data-device='desktop']"
      );
      const mobile = devicesRef.current?.querySelector<HTMLElement>(
        "[data-device='mobile']"
      );
      [desktop, mobile].forEach((d, i) => {
        if (!d) return;
        gsap.from(d, {
          y: 30,
          scale: 0.95,
          duration: 1.1,
          delay: i * 0.12,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center+=10%",
          },
        });
      });

      // parallax devices
      if (devicesRef.current) {
        gsap.to(devicesRef.current, {
          y: -40,
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
      id="room-sport"
      className="section"
      style={{ height: "150vh", position: "relative", background: "var(--bg)" }}
    >
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--bg)",
        }}
      />
      {/* subtle net texture */}
      <div
        aria-hidden
        className="padel-net"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.7,
        }}
      />

      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "0 8vw",
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            gap: 28,
            alignContent: "center",
          }}
        >
          {/* Top */}
          <div style={{ paddingTop: 110 }}>
            <div
              ref={labelRef}
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "var(--accent)",
                marginBottom: 18,
              }}
            >
              SALA 02 · DEPORTE
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
              SET · Padel Club
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
              Club de pádel premium · Mallorca
            </div>
          </div>

          {/* Devices + Data */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: "5vw",
              alignItems: "center",
            }}
          >
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

            <div
              ref={devicesRef}
              style={{
                position: "relative",
                display: "flex",
                gap: "3vw",
                alignItems: "center",
                justifyContent: "flex-end",
                perspective: "1500px",
              }}
            >
              {/* Mobile */}
              <div
                data-device="mobile"
                data-cursor="VIEW"
                style={{
                  width: "min(180px, 18vw)",
                  transform:
                    "rotateY(8deg) rotateX(2deg) translateZ(0)",
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <div
                  className="frame-mobile"
                  style={{ aspectRatio: "9/19" }}
                >
                  <div
                    className="frame-mobile-inner"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      background: "#050C05",
                    }}
                  >
                    <Image
                      src="/padel-mobile.png"
                      alt="SET Padel Club — app mockup"
                      fill
                      sizes="(max-width: 1280px) 18vw, 180px"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  </div>
                </div>
              </div>

              {/* Desktop */}
              <div
                data-device="desktop"
                data-cursor="VIEW"
                style={{
                  flex: 1,
                  maxWidth: 540,
                  transform:
                    "rotateY(-6deg) rotateX(3deg) translateZ(0)",
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <div
                  className="frame-browser"
                  style={{ aspectRatio: "16/10" }}
                >
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
                      set-padel.club
                    </div>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(180deg, #050C05 0%, #0E1A0E 100%)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Court at night */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "20% 10% 16% 10%",
                        border: "1px solid var(--fg-subtle)",
                        boxShadow:
                          "0 0 80px rgba(13,13,11,0.04) inset",
                        background: "rgba(13,13,11,0.02)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          bottom: 0,
                          width: 1,
                          background: "var(--fg-subtle)",
                        }}
                      />
                    </div>
                    {/* Title */}
                    <div
                      style={{
                        position: "absolute",
                        top: 24,
                        left: 28,
                        right: 28,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-syne)",
                          fontWeight: 800,
                          fontSize: "clamp(16px, 2.6vw, 28px)",
                          color: "var(--fg)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        SET<span style={{ color: "var(--accent-warm)" }}>.</span>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-space-mono)",
                          fontSize: 9,
                          letterSpacing: "0.3em",
                          color: "var(--fg-muted)",
                        }}
                      >
                        MEMBERS · ONLY
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
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
              &ldquo;Identidad deportiva premium, sin clichés.&rdquo;
            </p>
            <a
              href="#"
              data-cursor="OPEN CASE"
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
              VER CONCEPT
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

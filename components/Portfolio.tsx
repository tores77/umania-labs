"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

const GAP = 32;

const CARDS = [
  {
    imageName: "portfolio-realestate.jpg",
    category: "WEB PREMIUM",
    niche: "Real Estate",
  },
  {
    imageName: "portfolio-yacht.jpg",
    category: "WEB PREMIUM",
    niche: "Yacht Charter",
  },
  {
    imageName: "portfolio-padel.jpg",
    category: "APP",
    niche: "Club Deportivo",
  },
  {
    imageName: "portfolio-architecture.jpg",
    category: "WEB PREMIUM",
    niche: "Arquitectura",
  },
  {
    imageName: "portfolio-fashion.jpg",
    category: "E-COMMERCE",
    niche: "Moda Premium",
  },
  {
    imageName: "portfolio-restaurant.jpg",
    category: "LANDING",
    niche: "Restauración",
  },
];

function getLayout() {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const padding = Math.max(24, Math.min(64, vw * 0.05));
  const cardWidth = Math.min(480, Math.max(300, vw * 0.78));
  const cardHeight = Math.round(cardWidth * (640 / 480));
  return { padding, cardWidth, cardHeight };
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ padding: 64, cardWidth: 480, cardHeight: 640 });

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const updateLayout = () => setLayout(getLayout());
    updateLayout();

    let scrollTrigger: ScrollTrigger | undefined;

    const buildScroll = () => {
      const { padding, cardWidth } = getLayout();
      const totalWidth = CARDS.length * (cardWidth + GAP);
      const scrollDistance = Math.max(
        0,
        totalWidth - window.innerWidth + padding * 2
      );

      gsap.set(track, { x: 0 });
      scrollTrigger?.kill();

      scrollTrigger = gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      }).scrollTrigger!;
    };

    const ctx = gsap.context(() => {
      buildScroll();

      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top bottom-=20%",
            end: "top center",
            scrub: 1,
          },
        });
      }
    }, section);

    const onResize = () => {
      updateLayout();
      buildScroll();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      scrollTrigger?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="section"
      style={{
        height: "300vh",
        background: "var(--bg)",
        marginTop: 0,
        paddingTop: 0,
        marginBottom: 0,
        paddingBottom: 0,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: 88,
        }}
      >
        <div
          ref={headerRef}
          style={{
            padding: `0 ${layout.padding}px 32px`,
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 56px)",
              color: "var(--fg)",
              lineHeight: 1.0,
              margin: 0,
            }}
          >
            Nuestro trabajo
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "clamp(32px, 5vw, 56px)",
              color: "var(--fg-muted)",
              lineHeight: 1.0,
              margin: "6px 0 16px",
            }}
          >
            habla por nosotros.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "var(--fg-muted)",
              }}
            >
              6 PROYECTOS · DISTINTOS SECTORES
            </div>
            <div
              className="portfolio-scroll-hint"
              aria-hidden
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "var(--fg-muted)",
                whiteSpace: "nowrap",
              }}
            >
              DESLIZA →
            </div>
          </div>
        </div>

        <div
          style={{
            overflow: "visible",
            width: "100%",
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: GAP,
              paddingLeft: layout.padding,
              paddingRight: layout.padding,
              width: "max-content",
              willChange: "transform",
              overflow: "visible",
            }}
          >
            {CARDS.map((card, i) => (
              <div
                key={card.niche}
                style={{
                  overflow: "visible",
                  flexShrink: 0,
                  marginLeft: i > 0 ? -20 : 0,
                  paddingBottom: 0,
                }}
              >
                <article
                  data-cursor="VIEW"
                  className="portfolio-card"
                  tabIndex={0}
                  aria-label={`${card.category}: ${card.niche}`}
                  style={{
                    position: "relative",
                    width: layout.cardWidth,
                    height: layout.cardHeight,
                    borderRadius: 4,
                    overflow: "hidden",
                    backgroundColor: "var(--surface-2)",
                    backgroundImage: `url('/${card.imageName}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    paddingBottom: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "24px 20px 20px",
                      background:
                        "linear-gradient(to top, rgba(13,13,11,0.9) 0%, transparent 100%)",
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.25em",
                        color: "rgba(250,250,248,0.55)",
                        textTransform: "uppercase",
                        marginBottom: "6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {card.category}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 700,
                        fontSize: "clamp(16px, 1.8vw, 22px)",
                        color: "#FAFAF8",
                        lineHeight: 1.2,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {card.niche}
                    </h3>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal scroll progress */}
        <div
          style={{
            padding: `0 ${layout.padding}px 28px`,
            flexShrink: 0,
          }}
        >
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso del portfolio"
            style={{
              height: 1,
              background: "var(--line)",
              overflow: "hidden",
            }}
          >
            <div
              ref={progressRef}
              style={{
                width: "100%",
                height: "100%",
                background: "var(--fg)",
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .portfolio-card {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          outline: none;
        }
        .portfolio-card:focus-visible {
          outline: 2px solid var(--accent-warm);
          outline-offset: 4px;
        }
        @media (hover: hover) and (pointer: fine) {
          .portfolio-card:hover {
            transform: scale(1.02);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .portfolio-card {
            transition: none;
          }
          .portfolio-card:hover {
            transform: none;
          }
        }
        @media (min-width: 1024px) {
          .portfolio-scroll-hint {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

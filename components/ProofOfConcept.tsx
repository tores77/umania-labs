"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

const GAP = 32;
const CARD_IMAGES = [
  "portfolio-realestate.jpg",
  "portfolio-yacht.jpg",
  "portfolio-padel.jpg",
  "portfolio-architecture.jpg",
  "portfolio-fashion.jpg",
  "portfolio-restaurant.jpg",
];

function getLayout() {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const padding = Math.max(24, Math.min(64, vw * 0.05));
  const cardWidth = Math.min(480, Math.max(280, vw * 0.78));
  const cardHeight = Math.round(cardWidth * (640 / 480));
  return { padding, cardWidth, cardHeight };
}

export default function ProofOfConcept() {
  const t = useTranslations("proof");
  const tc = useTranslations("common");
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ padding: 64, cardWidth: 480, cardHeight: 640 });

  const cases = t.raw("cases") as Array<{
    name: string;
    sector: string;
    tech: string;
    status: string;
    url: string;
  }>;

  const portfolioCards = t.raw("portfolioCards") as Array<{
    category: string;
    niche: string;
  }>;

  const cards = portfolioCards.map((card, i) => ({
    ...card,
    imageName: CARD_IMAGES[i],
  }));

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
      const totalWidth = cards.length * (cardWidth + GAP);
      const scrollDistance = Math.max(0, totalWidth - window.innerWidth + padding * 2);

      gsap.set(track, { x: 0 });
      scrollTrigger?.kill();

      if (scrollDistance > 0) {
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
      }
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      buildScroll();

      const onResize = () => {
        updateLayout();
        buildScroll();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        scrollTrigger?.kill();
      };
    });

    mm.add("(max-width: 767px)", () => {
      scrollTrigger?.kill();
      gsap.set(track, { x: 0, clearProps: "transform" });
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleX(0)";
      }
      return () => {
        scrollTrigger?.kill();
      };
    });

    let caseCtx: gsap.Context | null = null;
    const caseCards = document.querySelectorAll(".case-card");
    if (caseCards.length > 0) {
      caseCtx = gsap.context(() => {
        gsap.from(Array.from(caseCards), {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: "#proof",
            start: "top 85%",
            invalidateOnRefresh: true,
          },
        });
      });
    }

    return () => {
      scrollTrigger?.kill();
      caseCtx?.revert();
      mm.revert();
    };
  }, [cards.length]);

  return (
    <>
      <section id="proof" className="section section-padding">
        <h2 className="section-title" style={{ marginBottom: 48 }}>
          {t("title")}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 80,
          }}
        >
          {cases.map((c, i) => (
            <article
              key={i}
              className="case-card"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                padding: "clamp(28px, 4vw, 40px)",
              }}
            >
              <h3
                className="text-display"
                style={{ fontSize: 28, margin: "0 0 8px", color: "var(--fg)" }}
              >
                {c.name}
              </h3>
              <p
                className="text-label"
                style={{ color: "var(--fg-muted)", marginBottom: 16, fontSize: 11 }}
              >
                {c.sector}
              </p>
              <p style={{ fontSize: 14, color: "var(--fg-muted)", margin: "0 0 8px" }}>
                {c.tech}
              </p>
              <p
                className="text-label"
                style={{ color: "var(--accent)", marginBottom: 24, fontSize: 11 }}
              >
                {c.status}
              </p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn-outline"
                style={{ fontSize: 10, padding: "12px 24px", minHeight: 44 }}
              >
                {tc("viewLive")} →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={sectionRef}
        id="portfolio"
        className="section portfolio-section"
        style={{ background: "var(--surface)" }}
      >
        <div className="portfolio-sticky-inner">
          <div style={{ padding: `0 ${layout.padding}px 32px`, flexShrink: 0 }}>
            <h2 className="section-title">{t("portfolioTitle")}</h2>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(32px, 5vw, 56px)",
                color: "var(--fg-muted)",
                margin: "6px 0 16px",
              }}
            >
              {t("portfolioSubtitle")}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="text-label" style={{ color: "var(--fg-muted)" }}>
                {t("portfolioMeta")}
              </span>
              <span
                className="portfolio-scroll-hint text-label"
                style={{ color: "var(--fg-muted)" }}
                aria-hidden
              >
                {t("scrollHint")}
              </span>
            </div>
          </div>

          <div className="portfolio-cards-viewport">
            <div
              ref={trackRef}
              className="portfolio-track"
              style={{
                display: "flex",
                gap: GAP,
                paddingLeft: layout.padding,
                paddingRight: layout.padding,
                width: "max-content",
              }}
            >
              {cards.map((card) => (
                <article
                  key={card.niche}
                  className="portfolio-card-item"
                  data-cursor="VIEW"
                  tabIndex={0}
                  aria-label={`${card.category}: ${card.niche}`}
                  style={{
                    flexShrink: 0,
                    width: layout.cardWidth,
                    height: layout.cardHeight,
                    borderRadius: 4,
                    overflow: "hidden",
                    backgroundColor: "var(--surface-2)",
                    backgroundImage: `url('/${card.imageName}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "24px 20px",
                      background:
                        "linear-gradient(to top, rgba(10,10,10,0.92) 0%, transparent 100%)",
                    }}
                  >
                    <div
                      className="text-label"
                      style={{ color: "var(--fg-muted)", marginBottom: 6, fontSize: 11 }}
                    >
                      {card.category}
                    </div>
                    <h3
                      className="text-display"
                      style={{ fontSize: 22, margin: 0, color: "var(--fg)" }}
                    >
                      {card.niche}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="portfolio-progress" style={{ padding: `0 ${layout.padding}px 28px`, flexShrink: 0 }}>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("progressAria")}
              style={{ height: 1, background: "var(--line)", overflow: "hidden" }}
            >
              <div
                ref={progressRef}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "var(--accent)",
                  transformOrigin: "left center",
                  transform: "scaleX(0)",
                }}
              />
            </div>
          </div>
        </div>

        <style jsx global>{`
          @media (min-width: 768px) {
            .portfolio-section {
              height: 300vh;
            }
            .portfolio-sticky-inner {
              position: sticky;
              top: 0;
              height: 100dvh;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding-top: 88px;
            }
            .portfolio-cards-viewport {
              overflow: visible;
              flex: 1;
              display: flex;
              align-items: center;
            }
          }
          @media (max-width: 767px) {
            .portfolio-section {
              height: auto;
            }
            .portfolio-sticky-inner {
              position: static;
              height: auto;
              overflow: visible;
              display: block;
              padding: clamp(80px, 12vw, 140px) 0 clamp(48px, 8vw, 80px);
            }
            .portfolio-cards-viewport {
              overflow-x: auto;
              overflow-y: visible;
              -webkit-overflow-scrolling: touch;
              scroll-snap-type: x mandatory;
              scrollbar-width: none;
              padding-bottom: 8px;
            }
            .portfolio-cards-viewport::-webkit-scrollbar {
              display: none;
            }
            .portfolio-track {
              transform: none !important;
            }
            .portfolio-card-item {
              scroll-snap-align: start;
            }
            .portfolio-progress {
              display: none;
            }
          }
          @media (min-width: 1024px) {
            .portfolio-scroll-hint {
              display: none;
            }
          }
        `}</style>
      </section>
    </>
  );
}

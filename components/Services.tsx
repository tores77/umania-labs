"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap, registerGsap } from "@/lib/gsap";
import {
  ScrollTrigger,
  animationVisibleFallback,
} from "@/lib/scrollTriggerUtils";
import { getLenis, waitForLenis } from "@/lib/scroll";

const NUMBERS = ["01", "02", "03", "04", "05", "06", "07"];

async function waitForPaintReady() {
  try {
    await document.fonts.ready;
  } catch {
    /* fonts API unavailable */
  }
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export default function Services() {
  const t = useTranslations("services");
  const tc = useTranslations("common");
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const items = t.raw("items") as Array<{
    name: string;
    tagline: string;
    description: string;
    includes: string[];
    price: string;
  }>;
  const sectorLinks = t.raw("sectorLinks") as Array<{
    label: string;
    href: "/services/luxury-villas";
  }>;

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = () => track.querySelectorAll(".service-card");
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      let cancelled = false;
      let ctx: gsap.Context | null = null;
      let clearFallback: (() => void) | undefined;

      const initDesktop = async () => {
        await waitForPaintReady();
        if (cancelled) return;

        await waitForLenis();
        if (cancelled) return;

        if (!getLenis()) {
          console.error("[Services] Lenis not available — aborting GSAP init");
          return;
        }

        const trackEl = trackRef.current;
        const wrapEl = wrapRef.current;

        if (!trackEl || !wrapEl) {
          console.error(
            "[Services] track element not found — aborting GSAP init"
          );
          return;
        }

        const distance = trackEl.scrollWidth - wrapEl.clientWidth;

        if (distance <= 0) {
          console.error("[Services] distance <= 0 — aborting GSAP init");
          return;
        }

        ctx = gsap.context(() => {
          gsap.set(trackEl, { x: 0, clearProps: "transform" });

          const horizontalTween = gsap.to(trackEl, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: wrapEl,
              start: "top top",
              end: "+=" + distance,
              scrub: 1,
              pin: true,
              pinSpacing: true,
              pinType: "transform",
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const cardEls = Array.from(
            trackEl.querySelectorAll<HTMLElement>(".service-card")
          );

          cardEls.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, x: 40 },
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  invalidateOnRefresh: true,
                },
              }
            );
          });
        });

        ScrollTrigger.refresh(true);
        clearFallback = animationVisibleFallback(section, ".service-card", 500);
      };

      initDesktop();

      return () => {
        cancelled = true;
        clearFallback?.();
        ctx?.revert();
        ScrollTrigger.getAll()
          .filter((st) => st.trigger === wrapRef.current || st.trigger === section)
          .forEach((st) => st.kill());
        const trackEl = trackRef.current;
        if (trackEl) {
          gsap.set(trackEl, { x: 0, clearProps: "transform" });
        }
      };
    });

    mm.add("(max-width: 767px)", () => {
      gsap.set(track, { x: 0, clearProps: "transform" });

      gsap.from(cards(), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          invalidateOnRefresh: true,
        },
      });

      const clearFallback = animationVisibleFallback(section, ".service-card", 500);

      return () => {
        clearFallback();
        gsap.set(track, { x: 0, clearProps: "transform" });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section services-section"
      style={{ background: "var(--surface)" }}
    >
      <div style={{ padding: "clamp(80px, 12vw, 120px) clamp(20px, 5vw, 64px) 40px" }}>
        <h2 className="section-title">{t("title")}</h2>
      </div>

      <div ref={wrapRef} className="services-scroll-wrap">
        <div ref={trackRef} className="services-track">
          {items.map((item, i) => (
            <article key={i} className="service-card">
              <span
                className="text-label"
                style={{ color: "var(--accent)", marginBottom: 24 }}
              >
                {NUMBERS[i]}
              </span>
              <h3
                className="text-display"
                style={{ fontSize: 28, margin: "0 0 8px", color: "var(--fg)" }}
              >
                {item.name}
              </h3>
              <p
                className="text-label"
                style={{ color: "var(--fg-muted)", marginBottom: 16, fontSize: 9 }}
              >
                {item.tagline}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--fg-muted)",
                  lineHeight: 1.65,
                  margin: "0 0 24px",
                  flex: 1,
                }}
              >
                {item.description}
              </p>
              <div style={{ marginBottom: 24 }}>
                <div
                  className="text-label"
                  style={{ color: "var(--fg-muted)", marginBottom: 12, fontSize: 9 }}
                >
                  {tc("includes")}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {item.includes.map((inc, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 13,
                        color: "var(--fg)",
                        padding: "6px 0",
                        borderBottom:
                          j < item.includes.length - 1 ? "1px solid var(--line)" : "none",
                      }}
                    >
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="text-label"
                style={{ color: "var(--accent)", fontSize: 10 }}
              >
                {item.price}
              </div>
            </article>
          ))}
        </div>
      </div>

      {sectorLinks.length > 0 && (
        <div
          style={{
            padding: "0 clamp(20px, 5vw, 64px) clamp(80px, 12vw, 120px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {sectorLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label"
              style={{
                fontSize: 10,
                color: "var(--fg-muted)",
                textDecoration: "none",
                border: "1px solid var(--line)",
                padding: "12px 20px",
                transition: "color 0.3s, border-color 0.3s",
              }}
            >
              {link.label} →
            </Link>
          ))}
        </div>
      )}

      <style jsx global>{`
        .services-scroll-wrap {
          overflow: hidden;
          padding-bottom: clamp(80px, 12vw, 120px);
        }
        .services-track {
          display: flex;
          flex-direction: row;
          gap: 24px;
          padding: 0 clamp(20px, 5vw, 64px);
          width: max-content;
        }
        .services-section .service-card {
          flex-shrink: 0;
          width: clamp(300px, 38vw, 420px);
          background: var(--bg);
          border: 1px solid var(--line);
          padding: clamp(28px, 4vw, 40px);
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 767px) {
          .services-scroll-wrap {
            overflow: visible;
          }
          .services-track {
            flex-direction: column;
            width: auto;
          }
          .services-section .service-card {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

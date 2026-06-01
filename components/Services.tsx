"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import {
  ScrollTrigger,
  animationVisibleFallback,
} from "@/lib/scrollTriggerUtils";

const NUMBERS = ["01", "02", "03", "04", "05", "06", "07"];

function getHorizontalScrollDistance(track: HTMLElement) {
  return Math.max(0, track.scrollWidth - window.innerWidth);
}

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
  const trackRef = useRef<HTMLDivElement>(null);

  const items = t.raw("items") as Array<{
    name: string;
    tagline: string;
    description: string;
    includes: string[];
    price: string;
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

        const trackEl = section.querySelector(
          ".services-track"
        ) as HTMLElement | null;
        const scrollWrap = section.querySelector(
          ".services-scroll-wrap"
        ) as HTMLElement | null;

        console.log("[Services desktop] track:", trackEl);
        console.log("[Services desktop] scrollWidth:", trackEl?.scrollWidth);
        console.log(
          "[Services desktop] totalWidth:",
          trackEl ? trackEl.scrollWidth - window.innerWidth : undefined
        );

        if (!trackEl || !scrollWrap) {
          console.error(
            "[Services] track element not found — aborting GSAP init"
          );
          return;
        }

        const scrollWidth = trackEl.scrollWidth;
        const innerWidth = window.innerWidth;
        const totalWidth = getHorizontalScrollDistance(trackEl);

        console.log("[Services desktop] measurements:", {
          scrollWidth,
          innerWidth,
          totalWidth,
        });

        ctx = gsap.context(() => {
          gsap.set(trackEl, { x: 0, clearProps: "transform" });

          const horizontalTween = gsap.to(trackEl, {
            x: () => -getHorizontalScrollDistance(trackEl),
            ease: "none",
            scrollTrigger: {
              trigger: scrollWrap,
              start: "top top",
              end: () => `+=${getHorizontalScrollDistance(trackEl)}`,
              pin: scrollWrap,
              pinSpacing: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          console.log(
            "[Services desktop] ScrollTrigger end:",
            horizontalTween.scrollTrigger?.end
          );

          gsap.from(cards(), {
            opacity: 0,
            x: 40,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              invalidateOnRefresh: true,
            },
          });
        }, section);

        ScrollTrigger.refresh(true);
        clearFallback = animationVisibleFallback(section, ".service-card", 500);
      };

      initDesktop();

      return () => {
        cancelled = true;
        clearFallback?.();
        ctx?.revert();
        const trackEl = section.querySelector(".services-track") as HTMLElement | null;
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

      <div className="services-scroll-wrap">
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

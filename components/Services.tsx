"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useIsMobile } from "@/hooks/useIsMobile";

const NUMBERS = ["01", "02", "03", "04", "05", "06", "07"];

export default function Services() {
  const t = useTranslations("services");
  const tc = useTranslations("common");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(900);

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

    let st: ScrollTrigger | undefined;

    const build = () => {
      gsap.set(track, { x: 0 });
      st?.kill();

      if (isMobile) {
        gsap.from(track.querySelectorAll(".service-card"), {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        });
        return;
      }

      const totalWidth = track.scrollWidth - window.innerWidth + 128;
      if (totalWidth <= 0) return;

      st = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }).scrollTrigger;

      gsap.from(track.querySelectorAll(".service-card"), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    };

    build();
    window.addEventListener("resize", build);
    return () => {
      window.removeEventListener("resize", build);
      st?.kill();
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section"
      style={{ background: "var(--surface)" }}
    >
      <div style={{ padding: "clamp(80px, 12vw, 120px) clamp(20px, 5vw, 64px) 40px" }}>
        <h2 className="section-title">{t("title")}</h2>
      </div>

      <div
        style={{
          overflow: "hidden",
          paddingBottom: "clamp(80px, 12vw, 120px)",
        }}
      >
        <div
          ref={trackRef}
          className="services-track"
          style={{
            display: "flex",
            gap: 24,
            padding: "0 clamp(20px, 5vw, 64px)",
            width: isMobile ? "auto" : "max-content",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {items.map((item, i) => (
            <article
              key={i}
              className="service-card"
              style={{
                flexShrink: 0,
                width: isMobile ? "100%" : "clamp(300px, 38vw, 420px)",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                padding: "clamp(28px, 4vw, 40px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
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
                        borderBottom: j < item.includes.length - 1 ? "1px solid var(--line)" : "none",
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
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";

export default function MarketContext() {
  const t = useTranslations("market");
  const sectionRef = useRef<HTMLElement>(null);

  const items = t.raw("items") as Array<{
    name: string;
    marketRange: string;
    ourPrice: string;
    insight: string;
  }>;

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="market"
      className="section section-padding"
      style={{ background: "var(--surface)" }}
    >
      <h2 data-fade className="section-title" style={{ marginBottom: 64 }}>
        {t("title")}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          marginBottom: 64,
        }}
      >
        {items.map((item, i) => (
          <article
            key={i}
            data-fade
            style={{
              background: "var(--bg)",
              border: "1px solid var(--line)",
              padding: "clamp(28px, 4vw, 40px)",
            }}
          >
            <h3
              className="text-display"
              style={{ fontSize: 28, margin: "0 0 20px", color: "var(--fg)" }}
            >
              {item.name}
            </h3>
            <div style={{ marginBottom: 12 }}>
              <span className="text-label" style={{ color: "var(--fg-muted)", fontSize: 11 }}>
                {t("marketLabel")}
              </span>
              <p style={{ fontSize: 14, color: "var(--fg)", margin: "4px 0 0" }}>
                {item.marketRange}
              </p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span className="text-label" style={{ color: "var(--fg-muted)", fontSize: 11 }}>
                {t("brandLabel")}
              </span>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--accent)",
                  margin: "4px 0 0",
                }}
              >
                {item.ourPrice}
              </p>
            </div>
            <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.65, margin: 0 }}>
              {item.insight}
            </p>
          </article>
        ))}
      </div>

      <div
        data-fade
        style={{
          border: "1px solid var(--line)",
          padding: "clamp(28px, 4vw, 48px)",
          background: "var(--bg)",
          maxWidth: 800,
        }}
      >
        <h3
          className="text-display"
          style={{ fontSize: 24, margin: "0 0 16px", color: "var(--accent)" }}
        >
          {t("ruleTitle")}
        </h3>
        <p style={{ fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.7, margin: 0 }}>
          {t("ruleDescription")}
        </p>
      </div>
    </section>
  );
}

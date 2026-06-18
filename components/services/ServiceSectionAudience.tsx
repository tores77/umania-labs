"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import type { ServiceDefinition } from "@/lib/services/registry";

export default function ServiceSectionAudience({
  service,
}: {
  service: ServiceDefinition;
}) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const sectionRef = useRef<HTMLElement>(null);
  const items = t.raw("audience.items") as Array<{
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
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section section-padding">
      <p className="text-label" style={{ color: "var(--fg-muted)", marginBottom: 20 }}>
        {t("audience.label")}
      </p>
      <h2 data-fade className="section-title" style={{ marginBottom: 64 }}>
        {t("audience.title")}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          marginBottom: 64,
        }}
      >
        {items.map((item, index) => (
          <article
            key={index}
            data-fade
            style={{
              background: "var(--surface)",
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
                {t("audience.marketLabel")}
              </span>
              <p style={{ fontSize: 14, color: "var(--fg)", margin: "4px 0 0" }}>
                {item.marketRange}
              </p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span className="text-label" style={{ color: "var(--fg-muted)", fontSize: 11 }}>
                {t("audience.brandLabel")}
              </span>
              <p style={{ fontSize: 14, color: "var(--accent)", margin: "4px 0 0" }}>
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
          background: "var(--surface)",
          maxWidth: 800,
        }}
      >
        <h3
          className="text-display"
          style={{ fontSize: 24, margin: "0 0 16px", color: "var(--accent)" }}
        >
          {t("audience.ruleTitle")}
        </h3>
        <p style={{ fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.7, margin: 0 }}>
          {t("audience.ruleDescription")}
        </p>
      </div>
    </section>
  );
}

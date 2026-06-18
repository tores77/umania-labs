"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import type { ServiceDefinition } from "@/lib/services/registry";

export default function ServiceSectionPainPoints({
  service,
}: {
  service: ServiceDefinition;
}) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const sectionRef = useRef<HTMLElement>(null);
  const items = t.raw("challenge.items") as Array<{
    stat: string;
    title: string;
    description: string;
    solution: string;
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
        {t("challenge.label")}
      </p>
      <h2 data-fade className="section-title" style={{ marginBottom: 64 }}>
        {t("challenge.title")}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 1,
          background: "var(--line)",
          border: "1px solid var(--line)",
        }}
      >
        {items.map((item, index) => (
          <article
            key={index}
            data-fade
            style={{
              background: "var(--bg)",
              padding: "clamp(28px, 4vw, 40px)",
            }}
          >
            <div
              className="text-display"
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "var(--accent)",
                marginBottom: 16,
              }}
            >
              {item.stat}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 400,
                fontSize: 18,
                color: "var(--fg)",
                margin: "0 0 10px",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--fg-muted)",
                lineHeight: 1.65,
                margin: "0 0 16px",
              }}
            >
              {item.description}
            </p>
            <p className="text-label" style={{ color: "var(--accent)", fontSize: 10, margin: 0 }}>
              → {item.solution}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

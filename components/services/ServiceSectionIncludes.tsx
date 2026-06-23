"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import type { ServiceDefinition } from "@/lib/services/registry";

function formatItemNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default function ServiceSectionIncludes({
  service,
}: {
  service: ServiceDefinition;
}) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const sectionRef = useRef<HTMLElement>(null);
  const items = t.raw("solution.items") as Array<{
    title: string;
    description: string;
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
        stagger: 0.1,
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
      className="section section-padding"
      style={{ background: "var(--surface)" }}
    >
      <p className="text-label" style={{ color: "var(--fg-muted)", marginBottom: 20 }}>
        {t("solution.label")}
      </p>
      <h2 data-fade className="section-title" style={{ marginBottom: 64 }}>
        {t("solution.title")}
      </h2>

      <div style={{ display: "grid", gap: 1, background: "var(--line)" }}>
        {items.map((item, index) => (
          <article
            key={index}
            data-fade
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "clamp(20px, 4vw, 48px)",
              alignItems: "start",
              background: "var(--bg)",
              padding: "clamp(28px, 4vw, 40px)",
            }}
          >
            <span className="text-label" style={{ color: "var(--accent)", fontSize: 11 }}>
              {formatItemNumber(index)}
            </span>
            <div>
              <h3
                className="text-display"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", margin: "0 0 12px", color: "var(--fg)" }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.7, margin: 0 }}>
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

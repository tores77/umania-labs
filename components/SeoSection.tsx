"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";

export default function SeoSection() {
  const t = useTranslations("seoSection");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section section-padding"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
      }}
      aria-label={t("title")}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2
          data-fade
          className="text-display"
          style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            color: "var(--fg)",
            margin: "0 0 20px",
            lineHeight: 1.2,
          }}
        >
          {t("title")}
        </h2>
        <p
          data-fade
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 15,
            color: "var(--fg-muted)",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {t("body")}
        </p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import BriefingForm from "@/components/BriefingForm";

export default function BriefingSection() {
  const t = useTranslations("briefing");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="briefing"
      className="section"
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(245, 242, 237, 0.08)",
        padding: "clamp(80px, 12vw, 120px) clamp(20px, 5vw, 64px)",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p
          data-fade
          className="text-label"
          style={{ color: "var(--fg-muted)", marginBottom: 20 }}
        >
          {t("label")}
        </p>
        <h2
          data-fade
          className="text-display"
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            color: "#f5f2ed",
            margin: "0 0 12px",
          }}
        >
          {t("title")}
        </h2>
        <p
          data-fade
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 18,
            color: "#f5f2ed",
            margin: "0 0 16px",
          }}
        >
          {t("subtitle")}
        </p>
        <p
          data-fade
          style={{
            fontSize: 15,
            color: "var(--fg-muted)",
            lineHeight: 1.65,
            margin: "0 0 36px",
          }}
        >
          {t("description")}
        </p>
        <div data-fade>
          <BriefingForm layout="inline" />
        </div>
      </div>
    </section>
  );
}

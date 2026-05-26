"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useLanguage } from "@/components/LanguageProvider";

const STEP_NUMS = ["01", "02", "03", "04"];

export default function RoomProcess() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current || !stepsRef.current) return;

    const ctx = gsap.context(() => {
      const items = stepsRef.current!.querySelectorAll<HTMLElement>(".process-step");
      gsap.from(items, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=10%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section"
      style={{
        minHeight: "100vh",
        background: "var(--surface-2)",
        padding: "120px 8vw 100px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "var(--fg-muted)",
          marginBottom: 56,
        }}
      >
        {t.process.label}
      </div>

      <div
        ref={stepsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}
        className="process-grid"
      >
        {t.process.steps.map((step, i) => (
          <div
            key={STEP_NUMS[i]}
            className="process-step"
            style={{
              padding: "0 32px 0 0",
              borderRight: i < t.process.steps.length - 1 ? "1px solid var(--line)" : "none",
              paddingRight: i < t.process.steps.length - 1 ? 32 : 0,
              marginRight: i < t.process.steps.length - 1 ? 32 : 0,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "clamp(40px, 8vw, 72px)",
                color: "var(--accent-warm)",
                opacity: 0.35,
                lineHeight: 1,
                marginBottom: 24,
              }}
            >
              {STEP_NUMS[i]}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: "clamp(20px, 2.2vw, 28px)",
                color: "var(--fg)",
                margin: "0 0 16px",
                letterSpacing: "-0.01em",
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: 14,
                color: "var(--fg-muted)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 260,
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .process-step {
            border-right: none !important;
            padding-right: 0 !important;
            margin-right: 0 !important;
            border-bottom: 1px solid var(--line);
            padding-bottom: 48px !important;
          }
          .process-step:last-child {
            border-bottom: none;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

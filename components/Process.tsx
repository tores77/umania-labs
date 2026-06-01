"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";

const STEP_NUMS = ["01", "02", "03", "04", "05", "06"];

export default function Process() {
  const t = useTranslations("process");
  const sectionRef = useRef<HTMLElement>(null);

  const steps = t.raw("steps") as Array<{
    title: string;
    description: string;
  }>;

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".process-step"), {
        opacity: 0,
        y: 40,
        duration: 1,
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
    <section
      ref={sectionRef}
      id="process"
      className="section section-padding"
      style={{ background: "var(--surface-2)" }}
    >
      <h2 className="section-title" style={{ marginBottom: 64 }}>
        {t("title")}
      </h2>

      <div
        className="process-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 48,
        }}
      >
        {steps.map((step, i) => (
          <div key={STEP_NUMS[i]} className="process-step">
            <div
              className="text-display"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "var(--accent)",
                opacity: 0.4,
                marginBottom: 20,
              }}
            >
              {STEP_NUMS[i]}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 400,
                fontSize: 18,
                color: "var(--fg)",
                margin: "0 0 12px",
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--fg-muted)",
                lineHeight: 1.65,
                margin: 0,
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
            gap: 40px !important;
          }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

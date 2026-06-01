"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";

const NUMBERS = ["01", "02", "03"];

export default function Packages() {
  const t = useTranslations("packages");
  const tc = useTranslations("common");
  const sectionRef = useRef<HTMLElement>(null);

  const items = t.raw("items") as Array<{
    name: string;
    price: string;
    retainer?: string;
    audience: string;
    includes: string[];
  }>;

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll(".package-card"), {
        opacity: 0,
        y: 50,
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
    <section ref={sectionRef} id="packages" className="section section-padding">
      <h2 className="section-title" style={{ marginBottom: 64 }}>
        {t("title")}
      </h2>

      <div
        className="packages-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {items.map((item, i) => {
          const featured = i === 1;
          return (
            <article
              key={i}
              className={`package-card${featured ? " featured-glow" : ""}`}
              style={{
                background: featured ? "var(--surface-2)" : "var(--surface)",
                border: featured
                  ? "1px solid var(--accent)"
                  : "1px solid var(--line)",
                padding: "clamp(28px, 4vw, 44px)",
                position: "relative",
              }}
            >
              {featured && (
                <span
                  className="text-label"
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    color: "var(--accent)",
                    fontSize: 9,
                  }}
                >
                  {t("featured")}
                </span>
              )}
              <span
                className="text-label"
                style={{ color: "var(--fg-muted)", marginBottom: 20, display: "block" }}
              >
                {NUMBERS[i]}
              </span>
              <h3
                className="text-display"
                style={{ fontSize: 32, margin: "0 0 12px", color: "var(--fg)" }}
              >
                {item.name}
              </h3>
              <div
                className="text-label"
                style={{ color: "var(--accent)", marginBottom: 8, fontSize: 10 }}
              >
                {item.price}
              </div>
              {item.retainer && (
                <div
                  style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}
                >
                  {item.retainer}
                </div>
              )}
              <p
                style={{
                  fontSize: 14,
                  color: "var(--fg-muted)",
                  margin: "0 0 28px",
                  lineHeight: 1.5,
                }}
              >
                {item.audience}
              </p>
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
                      padding: "8px 0",
                      borderBottom:
                        j < item.includes.length - 1 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    {inc}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .packages-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import type { ServiceDefinition } from "@/lib/services/registry";

export default function ServiceFAQ({ service }: { service: ServiceDefinition }) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const sectionRef = useRef<HTMLElement>(null);
  const items = t.raw("faq.items") as Array<{ question: string; answer: string }>;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
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
      id="faq"
      className="section section-padding"
      style={{ background: "var(--surface)" }}
    >
      <h2 data-fade className="section-title" style={{ marginBottom: 48 }}>
        {t("faq.title")}
      </h2>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article
              key={index}
              data-fade
              style={{
                borderTop: "1px solid var(--line)",
                borderBottom: index === items.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "24px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 17,
                    color: "var(--fg)",
                    lineHeight: 1.4,
                  }}
                >
                  {item.question}
                </span>
                <span
                  className="text-label"
                  style={{ color: "var(--accent)", fontSize: 14, flexShrink: 0 }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--fg-muted)",
                    lineHeight: 1.7,
                    margin: "0 0 24px",
                    paddingRight: 32,
                  }}
                >
                  {item.answer}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";

export default function PainPoints() {
  const t = useTranslations("painPoints");
  const sectionRef = useRef<HTMLElement>(null);
  const items = t.raw("items") as Array<{
    stat: string;
    title: string;
    description: string;
    solution: string;
  }>;

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const stats = sectionRef.current!.querySelectorAll(".pain-stat");
      gsap.from(stats, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      const cards = sectionRef.current!.querySelectorAll(".pain-card");
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderCard = (item: (typeof items)[number], index: number) => (
    <article
      key={index}
      className="pain-card"
      style={{
        background: "var(--bg)",
        padding: "clamp(28px, 4vw, 40px)",
      }}
    >
      <div
        className="pain-stat text-display"
        style={{
          fontSize: "clamp(40px, 6vw, 56px)",
          color: "var(--accent)",
          marginBottom: 20,
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
          lineHeight: 1.6,
          margin: "0 0 20px",
        }}
      >
        {item.description}
      </p>
      <div className="text-label" style={{ color: "var(--accent)", fontSize: 9 }}>
        → {item.solution}
      </div>
    </article>
  );

  return (
    <section ref={sectionRef} id="pain-points" className="section section-padding">
      <h2 data-fade className="section-title" style={{ marginBottom: 64 }}>
        {t("title")}
      </h2>

      <div
        className="pain-grid"
        style={{
          background: "var(--line)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="pain-row pain-row-top">
          {items.slice(0, 3).map((item, i) => renderCard(item, i))}
        </div>
        <div className="pain-row pain-row-bottom">
          {items.slice(3).map((item, i) => renderCard(item, i + 3))}
        </div>
      </div>

      <style jsx global>{`
        .pain-row-top {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
        }
        .pain-row-bottom {
          display: flex;
          justify-content: center;
          gap: 1px;
          margin-top: 1px;
        }
        .pain-row-bottom .pain-card {
          flex: 0 0 calc((100% - 2px) / 3);
          max-width: calc((100% - 2px) / 3);
        }
        @media (max-width: 900px) {
          .pain-row-top {
            grid-template-columns: 1fr;
          }
          .pain-row-bottom {
            flex-direction: column;
            align-items: stretch;
          }
          .pain-row-bottom .pain-card {
            flex: 1 1 auto;
            max-width: none;
          }
        }
      `}</style>
    </section>
  );
}

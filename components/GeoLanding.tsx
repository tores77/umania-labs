"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import AIAgent from "@/components/AIAgent";
import Footer from "@/components/Footer";
import GeoFAQ from "@/components/GeoFAQ";

function scrollToAgent() {
  const el = document.getElementById("agent");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    document.getElementById("agent-input")?.focus();
  }, 450);
}

function AgentCta({ label, className = "cta-btn" }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={scrollToAgent}>
      {label}
    </button>
  );
}

export default function GeoLanding() {
  const t = useTranslations("geoLanding");
  const locale = useLocale();
  const rootRef = useRef<HTMLElement>(null);
  const stats = t.raw("stats.items") as Array<{
    stat: string;
    title: string;
    description: string;
  }>;
  const whatWeDo = t.raw("whatWeDo.items") as Array<{
    title: string;
    description: string;
  }>;

  const onMidCta = useCallback(() => scrollToAgent(), []);

  useEffect(() => {
    registerGsap();
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const hero = rootRef.current!.querySelector("section");
      if (hero) {
        gsap.from(hero.querySelectorAll("[data-fade]"), {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        });
      }

      rootRef.current!.querySelectorAll("[data-fade-section]").forEach((section) => {
        gsap.from(section.querySelectorAll("[data-fade-item]"), {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <main
        ref={rootRef}
        id="main-content"
        style={{ background: "var(--bg)", paddingTop: 100 }}
      >
        {/* HERO */}
        <section
          className="section-padding"
          style={{
            paddingTop: "clamp(48px, 10vw, 100px)",
            paddingBottom: "clamp(64px, 10vw, 120px)",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <p
            data-fade
            className="text-label"
            style={{ color: "var(--accent)", marginBottom: 24 }}
          >
            {t("hero.eyebrow")}
          </p>
          <h1
            data-fade
            className="text-display"
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              color: "var(--fg)",
              margin: "0 0 24px",
              lineHeight: 1.05,
            }}
          >
            {t("hero.headline")}
          </h1>
          <p
            data-fade
            style={{
              fontSize: "clamp(16px, 2.2vw, 19px)",
              color: "var(--fg-muted)",
              lineHeight: 1.65,
              margin: "0 0 40px",
              maxWidth: 680,
            }}
          >
            {t("hero.subline")}
          </p>
          <div data-fade>
            <AgentCta label={t("hero.cta")} />
          </div>
        </section>

        {/* MIRROR */}
        <section
          data-fade-section
          className="section-padding"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2
              data-fade-item
              className="section-title"
              style={{ marginBottom: 24 }}
            >
              {t("mirror.title")}
            </h2>
            <p
              data-fade-item
              style={{
                fontSize: 17,
                color: "var(--fg-muted)",
                lineHeight: 1.7,
                margin: "0 0 28px",
              }}
            >
              {t("mirror.body")}
            </p>
            <p
              data-fade-item
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(20px, 3vw, 26px)",
                color: "var(--accent)",
                fontStyle: "italic",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {t("mirror.microCta")}
            </p>
          </div>
        </section>

        {/* STATS */}
        <section
          data-fade-section
          className="section-padding"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2
              data-fade-item
              className="section-title"
              style={{ marginBottom: 48 }}
            >
              {t("stats.title")}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 1,
                background: "var(--line)",
                border: "1px solid var(--line)",
              }}
            >
              {stats.map((item) => (
                <article
                  key={item.stat + item.title}
                  data-fade-item
                  style={{
                    background: "var(--bg)",
                    padding: "clamp(28px, 4vw, 40px)",
                  }}
                >
                  <div
                    className="text-display"
                    style={{
                      fontSize: "clamp(40px, 6vw, 56px)",
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
                      fontSize: 16,
                      color: "var(--fg)",
                      margin: "0 0 12px",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--fg-muted)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
            <div data-fade-item style={{ marginTop: 48, textAlign: "center" }}>
              <button type="button" className="cta-btn-outline" onClick={onMidCta}>
                {t("midCta")}
              </button>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section
          data-fade-section
          className="section-padding"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              data-fade-item
              className="section-title"
              style={{ marginBottom: 48 }}
            >
              {t("whatWeDo.title")}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 32,
              }}
            >
              {whatWeDo.map((item) => (
                <article key={item.title} data-fade-item>
                  <h3
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 500,
                      fontSize: 18,
                      color: "var(--fg)",
                      margin: "0 0 12px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--fg-muted)",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HONESTY */}
        <section
          data-fade-section
          className="section-padding"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <div
            data-fade-item
            style={{
              maxWidth: 720,
              margin: "0 auto",
              padding: "clamp(28px, 4vw, 40px)",
              border: "1px solid rgba(200, 169, 110, 0.35)",
              background: "var(--accent-dim)",
            }}
          >
            <h2
              className="text-display"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "var(--fg)",
                margin: "0 0 20px",
              }}
            >
              {t("honesty.title")}
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--fg-muted)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {t("honesty.body")}
            </p>
          </div>
        </section>

        <AIAgent key={locale} />

        <GeoFAQ />

        {/* FINAL CTA */}
        <section
          data-fade-section
          className="section-padding"
          style={{
            borderTop: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2
              data-fade-item
              className="section-title"
              style={{ marginBottom: 16 }}
            >
              {t("finalCta.title")}
            </h2>
            <p
              data-fade-item
              style={{
                fontSize: 16,
                color: "var(--fg-muted)",
                lineHeight: 1.65,
                margin: "0 0 36px",
              }}
            >
              {t("finalCta.subtitle")}
            </p>
            <div data-fade-item>
              <AgentCta label={t("finalCta.cta")} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

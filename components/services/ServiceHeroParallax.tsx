"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import { scrollToHash } from "@/lib/scroll";
import type { ServiceDefinition } from "@/lib/services/registry";

type ServiceHeroParallaxProps = {
  service: ServiceDefinition;
  whatsappHref: string;
};

/**
 * Interim cinematic hero (GSAP scroll parallax, Umania patterns).
 * Replace with `@skiper-ui/skiper29` once Skiper UI Pro registry is available:
 *   npx shadcn add @skiper-ui/skiper29
 * Do not manually clone Skiper Siena Parallax — use the official component.
 */
export default function ServiceHeroParallax({
  service,
  whatsappHref,
}: ServiceHeroParallaxProps) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const tc = useTranslations("common");
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageBackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!containerRef.current || !imageRef.current) return;

    const trigger = gsap.to(imageRef.current, {
      y: "18%",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    const triggerBack =
      imageBackRef.current &&
      gsap.to(imageBackRef.current, {
        y: "8%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
      if (triggerBack) {
        triggerBack.scrollTrigger?.kill();
        triggerBack.kill();
      }
    };
  }, []);

  const scrollToAgent = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash("#agent");
    window.history.pushState(null, "", "#agent");
  };

  return (
    <section
      ref={containerRef}
      id="top"
      aria-label={t("hero.headline")}
      style={{ height: "420vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "var(--bg)",
        }}
      >
        <div
          ref={imageBackRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: "-10% 0 0",
            height: "120%",
            opacity: 0.35,
            transform: "scale(1.08)",
          }}
        >
          <Image
            src="/portfolio-architecture.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          ref={imageRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: "-15% 0 0",
            height: "130%",
          }}
        >
          <Image
            src="/portfolio-realestate.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              to bottom,
              rgba(10,10,10,0.82) 0%,
              rgba(10,10,10,0.45) 35%,
              rgba(10,10,10,0.55) 65%,
              rgba(10,10,10,0.94) 100%
            )`,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "clamp(100px, 14vh, 140px) clamp(20px, 5vw, 64px)",
            zIndex: 2,
            maxWidth: 960,
          }}
        >
          <p
            className="text-label"
            style={{ color: "var(--accent)", marginBottom: 20, fontSize: 10 }}
          >
            {t("hero.label")}
          </p>
          <h1
            className="text-display"
            style={{
              fontSize: "clamp(34px, 6vw, 68px)",
              color: "var(--fg)",
              margin: "0 0 24px",
              lineHeight: 1.05,
            }}
          >
            {t("hero.headline")}
          </h1>
          <p
            className="text-body"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "var(--fg-muted)",
              lineHeight: 1.65,
              margin: "0 0 36px",
              maxWidth: 640,
            }}
          >
            {t("hero.subline")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <a href="#agent" onClick={scrollToAgent} className="cta-btn" data-cursor="GO">
              {tc("talkToAgent")}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn-outline"
              data-cursor="BOOK"
            >
              {t("hero.ctaWhatsapp")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

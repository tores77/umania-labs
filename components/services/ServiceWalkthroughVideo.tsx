"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import type { ServiceDefinition } from "@/lib/services/registry";

type ServiceWalkthroughVideoProps = {
  service: ServiceDefinition;
  videoSrc: string;
  posterSrc: string;
};

export default function ServiceWalkthroughVideo({
  service,
  videoSrc,
  posterSrc,
}: ServiceWalkthroughVideoProps) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!shouldLoad || !video) return;

    video.src = videoSrc;
    video.load();
  }, [shouldLoad, videoSrc]);

  return (
    <section ref={sectionRef} id="walkthrough" className="section" style={{ padding: 0 }}>
      <div
        className="section-padding"
        style={{ maxWidth: 1200, margin: "0 auto 48px" }}
      >
        <p data-fade className="text-label" style={{ color: "var(--fg-muted)", marginBottom: 20 }}>
          {t("walkthrough.label")}
        </p>
        <h2 data-fade className="section-title" style={{ marginBottom: 20 }}>
          {t("walkthrough.title")}
        </h2>
        <p
          data-fade
          style={{
            fontSize: 16,
            color: "var(--fg-muted)",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: 720,
          }}
        >
          {t("walkthrough.description")}
        </p>
      </div>

      <div
        data-fade
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          maxHeight: "85vh",
          background: "var(--surface)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <video
          ref={videoRef}
          poster={posterSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          aria-label={t("walkthrough.title")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}

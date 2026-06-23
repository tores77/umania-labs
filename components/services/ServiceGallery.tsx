"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import { RESTAURANT_GALLERY_IMAGES } from "@/lib/constants";
import type { ServiceDefinition } from "@/lib/services/registry";

type ServiceGalleryProps = {
  service: ServiceDefinition;
};

export default function ServiceGallery({ service }: ServiceGalleryProps) {
  const t = useTranslations(`servicePages.${service.messageKey}.gallery`);
  const sectionRef = useRef<HTMLElement>(null);
  const alts = t.raw("alts") as string[];

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-gallery-item]"), {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section section-padding">
      <p className="text-label" style={{ color: "var(--fg-muted)", marginBottom: 20 }}>
        {t("label")}
      </p>
      <h2 data-fade className="section-title" style={{ marginBottom: 20 }}>
        {t("title")}
      </h2>
      <p
        data-fade
        style={{
          fontSize: 16,
          color: "var(--fg-muted)",
          lineHeight: 1.7,
          maxWidth: 640,
          margin: "0 0 48px",
        }}
      >
        {t("description")}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {RESTAURANT_GALLERY_IMAGES.map((src, index) => (
          <figure
            key={src}
            data-gallery-item
            style={{
              margin: 0,
              overflow: "hidden",
              border: "1px solid var(--line)",
              aspectRatio: index % 3 === 0 ? "3 / 4" : "4 / 3",
            }}
          >
            <Image
              src={src}
              alt={alts[index] ?? ""}
              width={800}
              height={index % 3 === 0 ? 1067 : 600}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

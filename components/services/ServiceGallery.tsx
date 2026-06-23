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

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1071;

function GalleryFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure
      data-gallery-item
      className="flex items-center justify-center overflow-hidden border border-[var(--line)] bg-[var(--bg)]"
      style={{ margin: 0, aspectRatio: "16 / 9" }}
    >
      <Image
        src={src}
        alt={alt}
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="h-full w-full object-contain"
      />
    </figure>
  );
}

export default function ServiceGallery({ service }: ServiceGalleryProps) {
  const t = useTranslations(`servicePages.${service.messageKey}.gallery`);
  const sectionRef = useRef<HTMLElement>(null);
  const alts = t.raw("alts") as string[];
  const topRow = RESTAURANT_GALLERY_IMAGES.slice(0, 3);
  const bottomRow = RESTAURANT_GALLERY_IMAGES.slice(3, 5);

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

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topRow.map((src, index) => (
            <GalleryFigure key={src} src={src} alt={alts[index] ?? ""} />
          ))}
        </div>

        <div className="mx-auto grid w-full max-w-[920px] grid-cols-1 gap-5 sm:grid-cols-2">
          {bottomRow.map((src, index) => (
            <GalleryFigure key={src} src={src} alt={alts[index + 3] ?? ""} />
          ))}
        </div>
      </div>
    </section>
  );
}

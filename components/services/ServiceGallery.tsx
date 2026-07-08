"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import {
  HOTEL_GALLERY_IMAGES,
  RESTAURANT_GALLERY_IMAGES,
  YACHT_GALLERY_IMAGES,
} from "@/lib/constants";
import type { ServiceDefinition, ServiceMessageKey } from "@/lib/services/registry";

type ServiceGalleryProps = {
  service: ServiceDefinition;
};

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;
const MARQUEE_SPEED = 42;

function getGalleryImages(messageKey: ServiceMessageKey) {
  switch (messageKey) {
    case "fineDining":
      return RESTAURANT_GALLERY_IMAGES;
    case "yachtCharter":
      return YACHT_GALLERY_IMAGES;
    case "boutiqueHotels":
      return HOTEL_GALLERY_IMAGES;
    default:
      return [];
  }
}

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

function StaticGalleryGrid({
  images,
  alts,
}: {
  images: readonly string[];
  alts: string[];
}) {
  const topRow = images.slice(0, 3);
  const bottomRow = images.slice(3);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topRow.map((src, index) => (
          <GalleryFigure key={src} src={src} alt={alts[index] ?? ""} />
        ))}
      </div>

      <div
        className={`mx-auto grid w-full grid-cols-1 gap-5 ${
          bottomRow.length === 3
            ? "lg:grid-cols-3"
            : "max-w-[920px] sm:grid-cols-2"
        }`}
      >
        {bottomRow.map((src, index) => (
          <GalleryFigure key={src} src={src} alt={alts[index + 3] ?? ""} />
        ))}
      </div>
    </div>
  );
}

function YachtMarqueeGallery({
  images,
  alts,
}: {
  images: readonly string[];
  alts: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const loopImages = [...images, ...images];

  useEffect(() => {
    registerGsap();
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const buildMarquee = () => {
      gsap.set(track, { x: 0 });
      const loopWidth = track.scrollWidth / 2;
      if (loopWidth <= 0) return;

      tweenRef.current?.kill();
      tweenRef.current = gsap.to(track, {
        x: -loopWidth,
        duration: loopWidth / MARQUEE_SPEED,
        ease: "none",
        repeat: -1,
      });
    };

    buildMarquee();

    const observer = new ResizeObserver(buildMarquee);
    observer.observe(track);

    const pause = () => tweenRef.current?.pause();
    const resume = () => tweenRef.current?.resume();
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    return () => {
      observer.disconnect();
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      tweenRef.current?.kill();
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        marginInline: "calc(-1 * clamp(20px, 5vw, 64px))",
        paddingBlock: 8,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
        style={{
          background: "linear-gradient(to right, var(--bg), transparent)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
        style={{
          background: "linear-gradient(to left, var(--bg), transparent)",
        }}
        aria-hidden
      />
      <div
        ref={trackRef}
        className="flex w-max gap-5 will-change-transform"
        style={{ paddingInline: "clamp(20px, 5vw, 64px)" }}
      >
        {loopImages.map((src, index) => {
          const altIndex = index % images.length;
          return (
            <figure
              key={`${src}-${index}`}
              data-gallery-item
              className="flex shrink-0 items-center justify-center overflow-hidden border border-[var(--line)] bg-[var(--bg)]"
              style={{
                margin: 0,
                width: "min(46vw, 620px)",
                aspectRatio: "16 / 9",
              }}
            >
              <Image
                src={src}
                alt={alts[altIndex] ?? ""}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                sizes="46vw"
                className="h-full w-full object-contain"
              />
            </figure>
          );
        })}
      </div>
    </div>
  );
}

export default function ServiceGallery({ service }: ServiceGalleryProps) {
  const t = useTranslations(`servicePages.${service.messageKey}.gallery`);
  const sectionRef = useRef<HTMLElement>(null);
  const alts = t.raw("alts") as string[];
  const galleryImages = getGalleryImages(service.messageKey);
  const usesMarqueeGallery =
    service.messageKey === "yachtCharter" || service.messageKey === "boutiqueHotels";

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-gallery-header]"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      if (!usesMarqueeGallery) {
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [usesMarqueeGallery]);

  return (
    <section ref={sectionRef} className="section section-padding">
      <p
        data-gallery-header
        className="text-label"
        style={{ color: "var(--fg-muted)", marginBottom: 20 }}
      >
        {t("label")}
      </p>
      <h2
        data-gallery-header
        className="section-title"
        style={{ marginBottom: 20 }}
      >
        {t("title")}
      </h2>
      <p
        data-gallery-header
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

      {usesMarqueeGallery ? (
        <YachtMarqueeGallery images={galleryImages} alts={alts} />
      ) : (
        <StaticGalleryGrid images={galleryImages} alts={alts} />
      )}
    </section>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { scrollToHash } from "@/lib/scroll";

export type Skiper29Props = {
  label: string;
  eyebrow: string;
  headline: string;
  subline: string;
  heroImage: ReactNode;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

const Skiper29 = ({
  label,
  eyebrow,
  headline,
  subline,
  heroImage,
  primaryCta,
  secondaryCta,
}: Skiper29Props) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!galleryRef.current || !parallaxRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parallaxRef.current,
        { y: "0%" },
        {
          y: "30%",
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  const scrollToAgent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToHash("#agent");
    window.history.pushState(null, "", "#agent");
  };

  return (
    <section id="top" aria-label={headline}>
      <div className="flex w-full flex-col items-center overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
        <div
          ref={galleryRef}
          className="relative flex h-[70vh] w-full items-end overflow-hidden"
        >
          <div className="absolute left-[clamp(20px,5vw,40px)] top-[clamp(80px,12vh,100px)] z-30 flex items-center justify-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] p-2 text-[var(--accent)]">
              <ArrowWeired className="rotate-90" />
            </div>
            <p className="text-label text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] md:text-[11px]">
              {label}
            </p>
          </div>
          <div className="absolute left-0 top-0 z-10 h-1/2 w-full bg-gradient-to-t from-transparent to-[var(--bg)]/95" />
          <div
            ref={parallaxRef}
            className="absolute inset-0 h-full w-full will-change-transform"
          >
            {heroImage}
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center px-[clamp(20px,5vw,64px)] pb-[clamp(48px,8vw,80px)]">
          <p className="text-label my-10 text-[10px] tracking-[0.25em] text-[var(--fg-muted)] md:text-[11px]">
            {eyebrow}
          </p>
          <h1 className="text-display w-full border-b border-t border-[var(--line)] py-2 text-center text-[clamp(28px,6vw,72px)] leading-[1.05]">
            {headline}
          </h1>
          <div className="my-4 flex size-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--accent)] p-2 text-[var(--bg)]">
            <ArrowWeired />
          </div>
          <p className="text-body mb-10 max-w-[640px] text-center text-[clamp(16px,2vw,20px)] leading-[1.65] text-[var(--fg-muted)]">
            {subline}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {primaryCta && (
                <a
                  href={primaryCta.href}
                  onClick={scrollToAgent}
                  className="cta-btn"
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  target={secondaryCta.external ? "_blank" : undefined}
                  rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                  className="cta-btn-outline"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Skiper29 };

const ArrowWeired = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      width="100%"
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M69.022 85.363c16.693-13.32 20.658-33.261 20.16-43.736H77.95c0 17.454-11.106 29.106-20.543 35.517-4.676 3.177-10.818 2.998-15.414-.293-17.124-12.264-19.958-27.753-18.988-35.224H10.305c0 20.438 9.697 34.444 20.244 43.16 11.033 9.118 27.285 9.503 38.473.576Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M56.016 5v79.243H43.56V5h12.455Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

/**
 * Skiper 29 Parallax_001 — design adapted from Skiper UI (https://skiper-ui.com)
 * Original inspiration: https://www.siena.film/films/my-project-x
 * Attribution: @gurvinder-singh02 / https://gxuri.me
 * Parallax implemented with GSAP ScrollTrigger + Lenis (same stack as the rest of the site).
 */

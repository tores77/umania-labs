"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

export type Skiper29Props = {
  label: string;
  eyebrow: string;
  headline: string;
  subline: string;
  parallaxImage: string;
  featuredImage: string;
  walkthroughHref?: string;
  walkthroughLabel?: string;
  walkthroughTitle?: string;
  primaryCta?: {
    label: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  clipPathId?: string;
};

const Skiper29 = ({
  label,
  eyebrow,
  headline,
  subline,
  parallaxImage,
  featuredImage,
  walkthroughHref = "#walkthrough",
  walkthroughLabel = "Experience",
  walkthroughTitle = "Villa walkthrough",
  primaryCta,
  secondaryCta,
  clipPathId = "skiper29-video",
}: Skiper29Props) => {
  const gallery = useRef<HTMLDivElement>(null);
  const gallery2 = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: gallery2,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0.6, 1], ["0%", "30%"]);
  const scaleDiv = useTransform(scrollYProgress2, [0, 1], [1, 0.7]);
  const scaleImg = useTransform(scrollYProgress2, [0, 1], [1, 1.3]);

  return (
    <section id="top" aria-label={headline}>
      <div className="flex w-full flex-col items-center overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
        <div
          ref={gallery}
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
          <motion.img
            src={parallaxImage}
            alt=""
            className="h-screen w-full object-cover"
            style={{ y }}
          />
        </div>

        <div className="flex w-full flex-col items-center justify-center px-[clamp(20px,5vw,64px)]">
          <p className="text-label my-10 text-[10px] tracking-[0.25em] text-[var(--fg-muted)] md:text-[11px]">
            {eyebrow}
          </p>
          <h1 className="text-display w-full border-b border-t border-[var(--line)] py-2 text-center text-[clamp(28px,6vw,72px)] leading-[1.05]">
            {headline}
          </h1>
          <div className="my-4 flex size-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--accent)] p-2 text-[var(--bg)]">
            <ArrowWeired />
          </div>
          <p
            className="text-body max-w-[640px] text-center text-[clamp(16px,2vw,20px)] leading-[1.65] text-[var(--fg-muted)]"
            style={{ margin: "0 0 48px" }}
          >
            {subline}
          </p>
        </div>

        <motion.div
          ref={gallery2}
          style={{ scale: scaleDiv, clipPath: `url(#${clipPathId})` }}
          className="relative mt-24 flex aspect-video w-full items-center justify-center overflow-hidden lg:mt-32 lg:w-[80%]"
        >
          <div className="absolute z-20 size-full bg-[var(--bg)]/20" />
          <WalkthroughCue
            href={walkthroughHref}
            label={walkthroughLabel}
            title={walkthroughTitle}
          />
          <SvgMask clipPathId={clipPathId} />
          <motion.img
            src={featuredImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ scale: scaleImg }}
          />
        </motion.div>

        {(primaryCta || secondaryCta) && (
          <div
            className="my-20 flex flex-wrap items-center justify-center gap-4 px-[clamp(20px,5vw,64px)] pb-8 md:my-28"
          >
            {primaryCta && (
              <a
                href={primaryCta.href}
                onClick={primaryCta.onClick}
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
    </section>
  );
};

export { Skiper29 };

const SvgMask = ({ clipPathId }: { clipPathId: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1836 1053"
      width="100%"
      aria-hidden
    >
      <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
        <path
          fill="currentColor"
          d="M457.525 1.148c-20.789-3.198-193.979 1.16-283.854 2.496 11.104-.178 1.297-2.868-81.146-2.496-103.5.468-86 102.499-86 109.999s-7 524.5-6.5 547.5 10 59 6.5 99c-2.8 32-1.167 234.667 0 332.003.5 75 62.5 66.5 67 68.5s38.5 0 81.5 0 436 6 526 10.5 438.995-.5 505.495 0 330.01-12.5 417.51-12.5 230.99 2 270.99 0 40.5-16 51-31.5 12.5-61 12.5-105.5c0-44.503 7.01-274.504 7.01-348.004s-3.51-159.998-7.01-230.998 0-256.002 0-318.002 7.01-92.998-22.5-110.999c-18.79-11.471-81.99-9.999-133.49-9.999H853.525c-29 0-370 4-396 0Z"
          transform="scale(0.0005139987561, 0.0008543065594)"
        />
      </clipPath>
    </svg>
  );
};

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

const WalkthroughCue = ({
  href,
  label,
  title,
}: {
  href: string;
  label: string;
  title: string;
}) => {
  return (
    <a
      href={href}
      className="absolute z-20 flex scale-75 flex-col items-center justify-center gap-3 text-center text-[var(--accent)] transition-opacity hover:opacity-90 lg:scale-100"
      style={{ textDecoration: "none" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100%"
        className="size-16 lg:size-20"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M80.593 43.765c4.543 3.072 4.543 9.762 0 12.834L28.219 92.021c-5.145 3.48-12.087-.206-12.087-6.417V14.76c0-6.21 6.942-9.897 12.087-6.417l52.374 35.422Z"
        />
      </svg>
      <p className="text-label text-[10px] uppercase tracking-[0.25em] md:text-[11px]">
        {label}
      </p>
      <span className="text-display text-[clamp(20px,3vw,32px)] uppercase leading-[0.95]">
        {title}
      </span>
    </a>
  );
};

/**
 * Skiper 29 Parallax_001 — React + framer motion + lenis
 * Inspired by and adapted from https://www.siena.film/films/my-project-x
 * Attribution to Skiper UI. Author: @gurvinder-singh02 / https://gxuri.me
 */

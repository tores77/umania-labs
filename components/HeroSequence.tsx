"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { CALENDLY_URL } from "@/lib/constants";
import { scrollToHash } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRCS = [
  "/studio-entry.mp4",
  "/studio-design.mp4",
  "/studio-meeting.mp4",
  "/studio-tech.mp4",
];

export default function HeroSequence() {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastTime = useRef<number[]>([0, 0, 0, 0]);
  const loadedVideos = useRef(new Set<number>([0]));
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const ensureVideoLoaded = (index: number) => {
      if (loadedVideos.current.has(index)) return;

      const video = videoRefs.current[index];
      if (!video) return;

      loadedVideos.current.add(index);
      video.src = VIDEO_SRCS[index];
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.load();
    };

    const prebuffer = (videoIndex: number, time: number) => {
      const video = videoRefs.current[videoIndex];
      if (video && video.readyState >= 2) {
        video.currentTime = time;
        lastTime.current[videoIndex] = time;
      }
    };

    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.muted = true;
      firstVideo.playsInline = true;
      firstVideo.load();
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;

        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${p})`;
        }

        if (p > 0.08) ensureVideoLoaded(1);
        if (p > 0.33) ensureVideoLoaded(2);
        if (p > 0.58) ensureVideoLoaded(3);

        const segment = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;

        if (p > 0.22 && p < 0.25) prebuffer(1, 0);
        if (p > 0.47 && p < 0.5) prebuffer(2, 0);
        if (p > 0.72 && p < 0.75) prebuffer(3, 0);

        videoRefs.current.forEach((video, i) => {
          if (!video) return;
          if (i === segment) {
            video.style.opacity = "1";
          } else {
            video.style.opacity = "0";
            if (!video.paused) video.pause();
          }
        });

        const active = videoRefs.current[segment];
        if (active && active.duration && isFinite(active.duration)) {
          const segP = Math.max(0, Math.min(1, (p - segment * 0.25) / 0.25));
          const newTime = segP * active.duration;
          if (Math.abs(newTime - lastTime.current[segment]) > 0.05) {
            active.currentTime = newTime;
            lastTime.current[segment] = newTime;
          }
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const onScroll = () => {
      if (window.scrollY > 100) setShowScrollHint(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const hintTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: () => {
        if (window.scrollY > 100) setShowScrollHint(false);
      },
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      hintTrigger.kill();
    };
  }, []);

  const scrollToAgent = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash("#agent");
    window.history.pushState(null, "", "#agent");
  };

  return (
    <section ref={containerRef} id="top" style={{ height: "500vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        {VIDEO_SRCS.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={i === 0 ? src : undefined}
            muted
            playsInline
            preload={i === 0 ? "auto" : "none"}
            poster={i === 0 ? "/studio-door.png" : undefined}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === 0 ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />
        ))}

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              to bottom,
              rgba(10,10,10,0.7) 0%,
              rgba(10,10,10,0.1) 30%,
              transparent 50%,
              rgba(10,10,10,0.4) 70%,
              rgba(10,10,10,0.92) 100%
            )`,
            zIndex: 1,
          }}
        />

        <div
          ref={contentRef}
          style={{
            position: "absolute",
            bottom: "clamp(80px, 12vh, 140px)",
            left: "clamp(20px, 5vw, 64px)",
            right: "clamp(20px, 5vw, 64px)",
            zIndex: 10,
            maxWidth: 900,
          }}
        >
          <h1
            className="text-display"
            style={{
              fontSize: "clamp(36px, 7vw, 72px)",
              color: "var(--fg)",
              margin: "0 0 20px",
            }}
          >
            {t("headline")}
          </h1>
          <p
            className="text-body"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "var(--fg-muted)",
              lineHeight: 1.6,
              margin: "0 0 36px",
              maxWidth: 560,
            }}
          >
            {t("subline")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <a
              href="#agent"
              onClick={scrollToAgent}
              className="cta-btn"
              data-cursor="GO"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn-outline"
              data-cursor="BOOK"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "var(--line)",
            zIndex: 10,
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: "100%",
              background: "var(--accent)",
              transformOrigin: "left center",
              transform: "scaleX(0)",
            }}
          />
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: showScrollHint ? 0.5 : 0,
            pointerEvents: "none",
            transition: "opacity 0.4s ease",
          }}
        >
          <span
            className="text-label"
            style={{
              fontSize: 10,
              color: "var(--accent)",
              letterSpacing: "0.3em",
            }}
          >
            {t("scrollHint")}
          </span>
          <span
            style={{
              display: "block",
              width: 1,
              height: 24,
              background: "var(--accent)",
              animation: showScrollHint ? "scroll-hint-bounce 1.8s ease-in-out infinite" : "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}

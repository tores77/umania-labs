"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { CALENDLY_URL } from "@/lib/constants";

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
  const [allReady, setAllReady] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (videos.length === 0) return;

    let readyCount = 0;
    const total = videos.length;
    let trigger: ScrollTrigger | null = null;

    const prebuffer = (videoIndex: number, time: number) => {
      const v = videoRefs.current[videoIndex];
      if (v && v.readyState >= 2) {
        v.currentTime = time;
        lastTime.current[videoIndex] = time;
      }
    };

    const initScrollTrigger = () => {
      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${p})`;
          }

          const segment = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;

          if (p > 0.22 && p < 0.25) prebuffer(1, 0);
          if (p > 0.47 && p < 0.5) prebuffer(2, 0);
          if (p > 0.72 && p < 0.75) prebuffer(3, 0);

          videoRefs.current.forEach((v, i) => {
            if (!v) return;
            if (i === segment) {
              v.style.opacity = "1";
            } else {
              v.style.opacity = "0";
              if (!v.paused) v.pause();
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
      setAllReady(true);
    };

    videos.forEach((v) => {
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";

      const onReady = () => {
        readyCount++;
        if (readyCount === total) initScrollTrigger();
      };

      if (v.readyState >= 3) {
        onReady();
      } else {
        v.addEventListener("canplay", onReady, { once: true });
        v.load();
      }
    });

    return () => {
      trigger?.kill();
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

  const scrollToServices = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
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
            src={src}
            muted
            playsInline
            preload="auto"
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
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
              data-cursor="BOOK"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href="#services"
              onClick={scrollToServices}
              className="cta-btn-outline"
              data-cursor="VIEW"
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

        {!allReady && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "#0a0a0a",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 120,
                height: 1,
                background: "var(--line)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--accent)",
                  animation: "loading 1.2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

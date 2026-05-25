"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

export default function Exterior() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!containerRef.current) return;

    const triggers: ScrollTrigger[] = [];
    const video = videoRef.current;
    let scrubTrigger: ScrollTrigger | null = null;

    const setupScrubTrigger = () => {
      if (!containerRef.current || !video) return;
      // Pause autoplay; the scroll drives playback.
      try {
        video.pause();
      } catch {}
      scrubTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          if (video && video.duration && Number.isFinite(video.duration)) {
            video.currentTime = self.progress * video.duration;
          }
        },
      });
      triggers.push(scrubTrigger);
    };

    if (video) {
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        setupScrubTrigger();
      } else {
        const onMeta = () => {
          setupScrubTrigger();
          video.removeEventListener("loadedmetadata", onMeta);
        };
        video.addEventListener("loadedmetadata", onMeta);
      }
    }

    const ctx = gsap.context(() => {
      // Hero copy fade-in
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top+=40%",
              end: "top top+=60%",
              scrub: 1,
            },
          }
        );
      }

      // Indicator fades out at 80%
      if (indicatorRef.current) {
        gsap.fromTo(
          indicatorRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top+=70%",
              end: "top top+=85%",
              scrub: 1,
            },
          }
        );
      }

      // Door "opens" — closing flash overlay at the very end
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          scale: 3,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "bottom bottom+=10%",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="top"
      className="section"
      style={{ height: "200vh", background: "var(--bg)" }}
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Scroll-scrubbed dolly-in video */}
        <video
          ref={videoRef}
          src="/studio-door.mp4"
          poster="/studio-door.png"
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
            pointerEvents: "none",
          }}
        />

        {/* Vignette */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Top-row meta */}
        <div
          style={{
            position: "absolute",
            top: 92,
            left: 36,
            right: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "var(--fg-muted)",
            }}
          >
            39°34&apos;N · 02°39&apos;E
          </span>
          <span
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "var(--fg-muted)",
            }}
          >
            EST. MMXXVI
          </span>
        </div>

        {/* Hero copy */}
        <div
          ref={heroRef}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "18%",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "min(900px, 90vw)",
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "var(--accent)",
              marginBottom: 22,
            }}
          >
            AWARD-WINNING WEB STUDIO · MALLORCA
          </div>
          <h1
            className="text-display"
            style={{
              fontSize: "clamp(40px, 7.2vw, 96px)",
              color: "var(--fg)",
              margin: 0,
              textShadow: "0 2px 30px rgba(0,0,0,0.5)",
            }}
          >
            Entramos donde
            <br />
            otros no llegan.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: 14,
              color: "var(--fg-muted)",
              letterSpacing: "0.02em",
              marginTop: 26,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Estudio de diseño web nivel Awwwards.
            <br />
            IA, GSAP, WebGL · Mallorca, Spain.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          ref={indicatorRef}
          aria-hidden
          style={{
            position: "absolute",
            right: 36,
            bottom: 36,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 9,
              letterSpacing: "0.4em",
              color: "var(--fg-muted)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            SCROLL · ENTER
          </span>
          <div
            style={{
              width: 1,
              height: 56,
              background:
                "linear-gradient(180deg, transparent 0%, var(--accent) 50%, transparent 100%)",
              animation: "umaniaScrollPulse 1.8s ease-in-out infinite",
            }}
          />
        </div>

        {/* Closing flash — the door "opens" */}
        <div
          ref={overlayRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            pointerEvents: "none",
            transformOrigin: "center 70%",
            zIndex: 4,
          }}
        >
          <div
            style={{
              width: "32%",
              height: "50%",
              marginBottom: "26%",
              background:
                "radial-gradient(ellipse at center 100%, rgba(125,196,65,0.35) 0%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes umaniaScrollPulse {
          0%, 100% { opacity: 0.25; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const duration = 1800;

    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased =
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${eased})`;
      }
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDone(true);
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.body.style.overflow = "";
    const fadeTimer = window.setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = "0";
      }
    }, 120);
    const removeTimer = window.setTimeout(() => setHidden(true), 900);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [done]);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        transition: "opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 400,
          fontSize: 18,
          letterSpacing: "0.35em",
          color: "var(--fg)",
        }}
      >
        UMANIA LABS
      </div>
      <div
        style={{
          width: 220,
          height: 1,
          background: "var(--line)",
          overflow: "hidden",
        }}
      >
        <div
          ref={barRef}
          style={{
            width: "100%",
            height: "100%",
            background: "var(--accent)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            willChange: "transform",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "var(--fg-muted)",
        }}
      >
        MALLORCA · MMXXVI
      </div>
    </div>
  );
}

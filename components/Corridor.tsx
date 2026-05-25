"use client";

import { useEffect, useRef, type ReactElement } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

type Line = { text: string; highlight?: string[] };

const MISSION_BLOCKS: { id: string; lines: Line[]; at: number }[] = [
  {
    id: "block-1",
    at: 0.06,
    lines: [
      { text: "> IDENTIFICANDO OBJETIVO..." },
      { text: "> STUDIO: UMANIA LABS / MALLORCA", highlight: ["UMANIA LABS"] },
      { text: "> AÑO: 2026 · ESTADO: OPERACIONAL", highlight: ["OPERACIONAL"] },
    ],
  },
  {
    id: "block-2",
    at: 0.3,
    lines: [
      { text: "> MISIÓN /" },
      { text: "> Convertir tu negocio en la web" },
      { text: "> más memorable de tu sector." },
      {
        text: "> HERRAMIENTAS: IA · GSAP · WebGL",
        highlight: ["IA · GSAP · WebGL"],
      },
    ],
  },
  {
    id: "block-3",
    at: 0.55,
    lines: [
      { text: "> DIFERENCIAL /" },
      { text: "> No somos una agencia." },
      { text: "> Somos un estudio de dos personas" },
      { text: "> que entrega en semanas, no en meses.", highlight: ["semanas"] },
    ],
  },
  {
    id: "block-4",
    at: 0.78,
    lines: [
      { text: "> ACCESO CONCEDIDO.", highlight: ["ACCESO CONCEDIDO."] },
      { text: "> BIENVENIDO AL ESTUDIO." },
    ],
  },
];

function MissionBlock({
  block,
}: {
  block: (typeof MISSION_BLOCKS)[number];
}) {
  return (
    <div
      data-block={block.id}
      className="mission-block"
      style={{
        opacity: 0,
        transform: "translateY(8px)",
        willChange: "opacity, transform",
        fontFamily: "var(--font-space-mono)",
        fontSize: "clamp(13px, 1.3vw, 16px)",
        lineHeight: 1.85,
        color: "var(--fg-muted)",
        maxWidth: 560,
      }}
    >
      {block.lines.map((line, idx) => (
        <div
          key={idx}
          className="mission-line"
          style={{
            position: "relative",
            whiteSpace: "pre",
            overflow: "hidden",
          }}
        >
          <span className="mission-line-text">
            {renderLine(line)}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderLine(line: Line) {
  if (!line.highlight || line.highlight.length === 0) return line.text;
  let result: (string | ReactElement)[] = [line.text];
  line.highlight.forEach((needle, hi) => {
    const next: (string | ReactElement)[] = [];
    result.forEach((part, pi) => {
      if (typeof part !== "string") {
        next.push(part);
        return;
      }
      const idx = part.indexOf(needle);
      if (idx === -1) {
        next.push(part);
        return;
      }
      const before = part.slice(0, idx);
      const after = part.slice(idx + needle.length);
      if (before) next.push(before);
      next.push(
        <span
          key={`hl-${hi}-${pi}`}
          style={{ color: "var(--accent)" }}
        >
          {needle}
        </span>
      );
      if (after) next.push(after);
    });
    result = next;
  });
  return result;
}

export default function Corridor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const wallLeftRef = useRef<HTMLDivElement>(null);
  const wallRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Push perspective: animate translateZ on inner scene to feel like walking forward
      if (innerRef.current) {
        gsap.fromTo(
          innerRef.current,
          { z: 0 },
          {
            z: 600,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }

      // Walls subtle parallax of light
      [wallLeftRef.current, wallRightRef.current].forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { backgroundPositionY: "0%" },
          {
            backgroundPositionY: "60%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      });

      // Mission blocks appearance with typewriter-style line reveal
      const blocks = containerRef.current?.querySelectorAll<HTMLElement>(
        ".mission-block"
      );
      blocks?.forEach((blockEl, blockIdx) => {
        const def = MISSION_BLOCKS[blockIdx];
        if (!def) return;
        const lines = blockEl.querySelectorAll<HTMLElement>(".mission-line");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top top+=${def.at * 100}%`,
            end: `top top+=${def.at * 100 + 12}%`,
            scrub: false,
            toggleActions: "play none none reverse",
          },
        });

        tl.to(blockEl, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });

        lines.forEach((line) => {
          const textEl = line.querySelector<HTMLElement>(".mission-line-text");
          if (!textEl) return;
          const w = textEl.scrollWidth;
          // Use a clipping mask via clip-path width
          gsap.set(textEl, {
            clipPath: "inset(0 100% 0 0)",
          });
          tl.to(
            textEl,
            {
              clipPath: "inset(0 0% 0 0)",
              duration: Math.min(0.9, Math.max(0.3, w / 360)),
              ease: "steps(40)",
            },
            "+=0.05"
          );
        });

        // Fade out at next block to keep the corridor feeling
        if (blockIdx < MISSION_BLOCKS.length - 1) {
          const nextAt = MISSION_BLOCKS[blockIdx + 1].at;
          gsap.to(blockEl, {
            opacity: 0,
            y: -10,
            ease: "power2.in",
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top top+=${nextAt * 100 - 4}%`,
              end: `top top+=${nextAt * 100 + 2}%`,
              scrub: true,
            },
          });
        }
      });

      // Floating dust particles
      const particles = containerRef.current?.querySelectorAll<HTMLElement>(
        ".dust-particle"
      );
      particles?.forEach((p, i) => {
        gsap.to(p, {
          y: () => -40 - Math.random() * 80,
          x: () => -10 + Math.random() * 20,
          opacity: 0,
          duration: 6 + Math.random() * 4,
          delay: i * 0.4,
          repeat: -1,
          ease: "sine.inOut",
          repeatRefresh: true,
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="corridor"
      className="section"
      style={{
        height: "200vh",
        position: "relative",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div className="corridor-bg" />

        {/* Vanishing perspective: convergent lines */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: 0.55,
          }}
        >
          <line
            x1="0" y1="0" x2="50" y2="50"
            stroke="rgba(125,196,65,0.25)"
            strokeWidth="0.05"
          />
          <line
            x1="100" y1="0" x2="50" y2="50"
            stroke="rgba(125,196,65,0.25)"
            strokeWidth="0.05"
          />
          <line
            x1="0" y1="100" x2="50" y2="50"
            stroke="rgba(125,196,65,0.25)"
            strokeWidth="0.05"
          />
          <line
            x1="100" y1="100" x2="50" y2="50"
            stroke="rgba(125,196,65,0.25)"
            strokeWidth="0.05"
          />
        </svg>

        {/* 2.5D scene wrapper */}
        <div className="scene-3d" style={{ position: "absolute", inset: 0 }}>
          <div
            ref={innerRef}
            className="scene-3d-inner"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Left wall texture (faux concrete with green slit) */}
            <div
              ref={wallLeftRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "18%",
                background:
                  "linear-gradient(90deg, rgba(125,196,65,0.06) 0%, transparent 90%), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 2px, transparent 2px, transparent 60px), #0B0F12",
                backgroundSize: "auto, auto 220%",
                transform: "translateZ(-60px)",
              }}
            />
            <div
              ref={wallRightRef}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "18%",
                background:
                  "linear-gradient(-90deg, rgba(125,196,65,0.06) 0%, transparent 90%), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 2px, transparent 2px, transparent 60px), #0B0F12",
                backgroundSize: "auto, auto 220%",
                transform: "translateZ(-60px)",
              }}
            />
          </div>
        </div>

        {/* Floating dust */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="dust-particle"
              style={{
                position: "absolute",
                left: `${(i * 71) % 100}%`,
                top: `${(i * 113) % 100}%`,
                width: 2,
                height: 2,
                borderRadius: "50%",
                background: "rgba(240,240,236,0.35)",
                opacity: 0.3,
                filter: "blur(0.5px)",
              }}
            />
          ))}
        </div>

        {/* Mission blocks (centered) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: "0 8vw",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(720px, 92vw)",
              minHeight: 200,
            }}
          >
            {/* Section meta */}
            <div
              style={{
                position: "absolute",
                top: -64,
                left: 0,
                fontFamily: "var(--font-space-mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "var(--accent)",
              }}
            >
              SALA · BRIEFING
            </div>

            {MISSION_BLOCKS.map((b) => (
              <div
                key={b.id}
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              >
                <MissionBlock block={b} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

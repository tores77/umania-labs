"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!hasFinePointer) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let labelX = mouseX;
    let labelY = mouseY;

    let raf = 0;
    const render = () => {
      dotX += (mouseX - dotX) * 0.22;
      dotY += (mouseY - dotY) * 0.22;
      labelX += (mouseX - labelX) * 0.18;
      labelY += (mouseY - labelY) * 0.18;

      dot.style.transform = `translate3d(${dotX - dot.clientWidth / 2}px, ${
        dotY - dot.clientHeight / 2
      }px, 0)`;
      label.style.transform = `translate3d(${labelX - label.clientWidth / 2}px, ${
        labelY - label.clientHeight / 2 + 1
      }px, 0)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "[data-cursor]"
      ) as HTMLElement | null;
      if (target) {
        const cursorAttr = target.getAttribute("data-cursor");
        dot.setAttribute("data-state", "hover");
        label.setAttribute("data-visible", "true");
        label.textContent = (cursorAttr || "OPEN").toUpperCase();
      } else {
        dot.setAttribute("data-state", "default");
        label.setAttribute("data-visible", "false");
      }
    };
    document.addEventListener("mouseover", onOver, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver, true);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div ref={dotRef} className="cursor" aria-hidden />
      <div
        ref={labelRef}
        className="cursor-label"
        aria-hidden
        data-visible="false"
      >
        OPEN
      </div>
    </>,
    document.body
  );
}

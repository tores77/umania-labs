"use client";

import { gsap, ScrollTrigger, registerGsap } from "./gsap";

let refreshBound = false;

export function setupScrollTriggerRefresh() {
  if (typeof window === "undefined" || refreshBound) return;
  refreshBound = true;
  registerGsap();

  const refresh = () => {
    ScrollTrigger.refresh();
  };

  if (document.readyState === "complete") {
    refresh();
  } else {
    window.addEventListener("load", refresh, { once: true });
  }

  document.fonts?.ready.then(refresh).catch(() => {});

  window.addEventListener("resize", refresh);
}

export function isMobileViewport(breakpoint = 768) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
}

/**
 * If elements are in the viewport but still hidden after delay,
 * force them visible (ScrollTrigger misfire fallback).
 */
export function animationVisibleFallback(
  container: HTMLElement,
  selector: string,
  delayMs = 500
) {
  const timer = window.setTimeout(() => {
    const elements = container.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (!inView) return;

      const opacity = parseFloat(getComputedStyle(el).opacity);
      if (Number.isNaN(opacity) || opacity >= 0.99) return;

      gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
    });
  }, delayMs);

  return () => window.clearTimeout(timer);
}

export { ScrollTrigger };

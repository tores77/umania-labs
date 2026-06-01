"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";
import { setupScrollTriggerRefresh } from "./scrollTriggerUtils";

type LenisBundle = {
  lenis: Lenis;
  destroy: () => void;
};

let lenisBundle: LenisBundle | null = null;
let lenisWaiters: Array<(lenis: Lenis) => void> = [];

function notifyLenisReady(lenis: Lenis) {
  lenisWaiters.forEach((cb) => cb(lenis));
  lenisWaiters = [];
}

export function getLenis() {
  return lenisBundle?.lenis ?? null;
}

export function onLenisReady(callback: (lenis: Lenis) => void) {
  const existing = getLenis();
  if (existing) {
    callback(existing);
    return () => {};
  }
  lenisWaiters.push(callback);
  return () => {
    lenisWaiters = lenisWaiters.filter((cb) => cb !== callback);
  };
}

export function subscribeLenisScroll(onScroll: (scrollY: number) => void) {
  const handler = ({ scroll }: { scroll: number }) => onScroll(scroll);
  let unsub: (() => void) | undefined;

  const attach = (lenis: Lenis) => {
    lenis.on("scroll", handler);
    unsub = () => lenis.off("scroll", handler);
  };

  const existing = getLenis();
  if (existing) {
    attach(existing);
    return () => unsub?.();
  }

  const cancelWait = onLenisReady(attach);
  return () => {
    cancelWait();
    unsub?.();
  };
}

export function initLenis() {
  if (typeof window === "undefined") return null;
  if (lenisBundle) return lenisBundle;

  registerGsap();
  setupScrollTriggerRefresh();

  document.documentElement.classList.add("lenis", "lenis-smooth");

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    syncTouch: true,
    orientation: "vertical",
    gestureOrientation: "vertical",
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  lenisBundle = {
    lenis,
    destroy: () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenisBundle = null;
    },
  };

  notifyLenisReady(lenis);

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return lenisBundle;
}

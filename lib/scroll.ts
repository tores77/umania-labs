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

/** Live Lenis instance — null until initLenis() runs on desktop. */
export let lenis: Lenis | null = null;

function notifyLenisReady(instance: Lenis) {
  lenisWaiters.forEach((cb) => cb(instance));
  lenisWaiters = [];
}

export function getLenis() {
  return lenis;
}

export function onLenisReady(callback: (instance: Lenis) => void) {
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

export function waitForLenis(): Promise<Lenis> {
  const existing = getLenis();
  if (existing) return Promise.resolve(existing);

  initLenis();
  const initialized = getLenis();
  if (initialized) return Promise.resolve(initialized);

  return new Promise((resolve) => {
    onLenisReady(resolve);
  });
}

export function subscribeLenisScroll(onScroll: (scrollY: number) => void) {
  const handler = ({ scroll }: { scroll: number }) => onScroll(scroll);
  let unsub: (() => void) | undefined;

  const attach = (instance: Lenis) => {
    instance.on("scroll", handler);
    unsub = () => instance.off("scroll", handler);
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

  const instance = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    syncTouch: true,
    orientation: "vertical",
    gestureOrientation: "vertical",
  });

  lenis = instance;

  if (typeof window !== "undefined") {
    (window as unknown as { lenis: Lenis }).lenis = instance;
  }

  instance.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    instance.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  lenisBundle = {
    lenis: instance,
    destroy: () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      if (typeof window !== "undefined") {
        delete (window as unknown as { lenis?: Lenis }).lenis;
      }
      lenis = null;
      lenisBundle = null;
    },
  };

  notifyLenisReady(instance);

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return lenisBundle;
}

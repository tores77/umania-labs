"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

export function initLenis() {
  if (typeof window === "undefined") return null;
  registerGsap();

  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: "vertical",
    gestureOrientation: "vertical",
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy: () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}

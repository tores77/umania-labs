"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

type FadeUpOptions = {
  y?: number;
  stagger?: number;
  start?: string;
  delay?: number;
};

export function useFadeUp<T extends HTMLElement>(
  options: FadeUpOptions = {}
) {
  const ref = useRef<T>(null);
  const { y = 40, stagger = 0.12, start = "top 85%", delay = 0 } = options;

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll("[data-fade]");

    const ctx = gsap.context(() => {
      if (targets.length > 0) {
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 1,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start,
          },
        });
      } else {
        gsap.from(el, {
          opacity: 0,
          y,
          duration: 1,
          ease: "power3.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [y, stagger, start, delay]);

  return ref;
}

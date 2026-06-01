"use client";

import { useEffect, useRef } from "react";
import { initLenis } from "@/lib/scroll";
import { setupScrollTriggerRefresh } from "@/lib/scrollTriggerUtils";
import { useIsMobile, useReducedMotion } from "@/hooks/useIsMobile";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const initialized = useRef(false);

  useEffect(() => {
    setupScrollTriggerRefresh();

    if (isMobile || reduced) return;

    if (initialized.current) return;

    const frame = requestAnimationFrame(() => {
      initLenis();
      initialized.current = true;
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isMobile, reduced]);

  return <>{children}</>;
}

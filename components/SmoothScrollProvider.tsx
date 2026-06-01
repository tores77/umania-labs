"use client";

import { useEffect } from "react";
import { initLenis, getLenis } from "@/lib/scroll";
import { setupScrollTriggerRefresh } from "@/lib/scrollTriggerUtils";
import { useIsMobile, useReducedMotion } from "@/hooks/useIsMobile";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    setupScrollTriggerRefresh();

    if (isMobile || reduced) return;

    initLenis();

    return () => {
      getLenis()?.resize();
    };
  }, [isMobile, reduced]);

  return <>{children}</>;
}

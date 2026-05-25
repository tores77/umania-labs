"use client";

import { useEffect } from "react";
import { initLenis } from "@/lib/scroll";
import { useIsMobile, useReducedMotion } from "@/hooks/useIsMobile";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (isMobile || reduced) return;
    const instance = initLenis();
    return () => {
      instance?.destroy();
    };
  }, [isMobile, reduced]);

  return <>{children}</>;
}

"use client";

import { useEffect, useRef, useState } from "react";

type ServiceHeroVideoProps = {
  src: string;
  poster: string;
};

export default function ServiceHeroVideo({ src, poster }: ServiceHeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[1]">
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className="h-full w-full object-cover"
      />
    </div>
  );
}

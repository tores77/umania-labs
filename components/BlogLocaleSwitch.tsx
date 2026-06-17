"use client";

import { useLayoutEffect } from "react";
import { useLocaleSwitch } from "@/components/LocaleSwitchProvider";

type BlogLocaleSwitchProps = {
  alternateSlug: string | null;
};

export default function BlogLocaleSwitch({ alternateSlug }: BlogLocaleSwitchProps) {
  const { setBlogAlternateSlug } = useLocaleSwitch();

  useLayoutEffect(() => {
    setBlogAlternateSlug(alternateSlug);
    return () => setBlogAlternateSlug(undefined);
  }, [alternateSlug, setBlogAlternateSlug]);

  return null;
}

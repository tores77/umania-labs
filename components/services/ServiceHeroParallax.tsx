"use client";

import { useTranslations } from "next-intl";
import { Skiper29 } from "@/components/v1/skiper29";
import { VILLA_HERO_IMAGE } from "@/lib/constants";
import { scrollToHash } from "@/lib/scroll";
import type { ServiceDefinition } from "@/lib/services/registry";

type ServiceHeroParallaxProps = {
  service: ServiceDefinition;
  whatsappHref: string;
};

export default function ServiceHeroParallax({
  service,
  whatsappHref,
}: ServiceHeroParallaxProps) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const tc = useTranslations("common");

  const scrollToAgent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToHash("#agent");
    window.history.pushState(null, "", "#agent");
  };

  return (
    <Skiper29
      label={t("hero.label")}
      eyebrow={t("hero.eyebrow")}
      headline={t("hero.headline")}
      subline={t("hero.subline")}
      parallaxImage={VILLA_HERO_IMAGE}
      priorityImage
      primaryCta={{
        href: "#agent",
        label: tc("talkToAgent"),
        onClick: scrollToAgent,
      }}
      secondaryCta={{
        label: t("hero.ctaWhatsapp"),
        href: whatsappHref,
        external: true,
      }}
    />
  );
}

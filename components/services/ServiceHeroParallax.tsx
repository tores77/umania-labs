import { getTranslations } from "next-intl/server";
import { Skiper29 } from "@/components/v1/skiper29";
import { Skiper29HeroImage } from "@/components/v1/skiper29-hero-image";
import type { ServiceDefinition } from "@/lib/services/registry";

type ServiceHeroParallaxProps = {
  service: ServiceDefinition;
  whatsappHref: string;
};

export default async function ServiceHeroParallax({
  service,
  whatsappHref,
}: ServiceHeroParallaxProps) {
  const t = await getTranslations(`servicePages.${service.messageKey}`);
  const tc = await getTranslations("common");

  return (
    <Skiper29
      label={t("hero.label")}
      eyebrow={t("hero.eyebrow")}
      headline={t("hero.headline")}
      subline={t("hero.subline")}
      heroImage={<Skiper29HeroImage />}
      primaryCta={{
        href: "#agent",
        label: tc("talkToAgent"),
      }}
      secondaryCta={{
        label: t("hero.ctaWhatsapp"),
        href: whatsappHref,
        external: true,
      }}
    />
  );
}

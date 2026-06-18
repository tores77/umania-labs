"use client";

import { useTranslations } from "next-intl";
import { CALENDLY_URL } from "@/lib/constants";
import { scrollToHash } from "@/lib/scroll";
import type { ServiceDefinition } from "@/lib/services/registry";
import AIAgent from "@/components/AIAgent";

type ServiceCTAProps = {
  service: ServiceDefinition;
  whatsappHref: string;
};

export default function ServiceCTA({ service, whatsappHref }: ServiceCTAProps) {
  const t = useTranslations(`servicePages.${service.messageKey}`);
  const tc = useTranslations("common");

  const scrollToAgent = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash("#agent");
    window.history.pushState(null, "", "#agent");
  };

  return (
    <>
      <section className="section section-padding" style={{ textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            {t("cta.title")}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--fg-muted)",
              lineHeight: 1.7,
              margin: "0 0 40px",
            }}
          >
            {t("cta.subtitle")}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <a href="#agent" onClick={scrollToAgent} className="cta-btn">
              {tc("talkToAgent")}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn-outline"
            >
              {t("cta.whatsapp")}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn-outline"
            >
              {tc("bookCall")}
            </a>
          </div>
        </div>
      </section>
      <AIAgent />
    </>
  );
}

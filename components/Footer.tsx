"use client";

import { useTranslations } from "next-intl";
import LangToggle from "@/components/LangToggle";
import { Link } from "@/i18n/navigation";
import { whatsappDirect, BRIEFING_LANDING_URL } from "@/lib/constants";

import { SERVICES } from "@/lib/services/registry";

const SECTION_LINKS = [
  { href: "#services", key: "services" as const },
  { href: "#packages", key: "packages" as const },
  { href: "#portfolio", key: "work" as const },
  { href: "#process", key: "process" as const },
  { href: "#agent", key: "agent" as const },
  { href: "#contact", key: "contact" as const },
];

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  return (
    <footer
      className="section"
      style={{
        borderTop: "1px solid var(--line)",
        padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 64px)",
        paddingBottom: "max(48px, calc(24px + env(safe-area-inset-bottom, 0px)))",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 48,
          marginBottom: 64,
        }}
      >
        <div>
          <a
            href="#top"
            className="text-label"
            style={{
              color: "var(--fg)",
              textDecoration: "none",
              fontSize: 12,
              letterSpacing: "0.3em",
              display: "block",
              marginBottom: 12,
            }}
          >
            UMANIA LABS
          </a>
          <p style={{ fontSize: 14, color: "var(--fg-muted)", margin: 0 }}>
            {t("tagline")}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {SECTION_LINKS.map((link) => (
              <li key={link.key} style={{ marginBottom: 10 }}>
                <a
                  href={link.href}
                  style={{
                    fontSize: 13,
                    color: "var(--fg-muted)",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")
                  }
                >
                  {tn(link.key)}
                </a>
              </li>
            ))}
            <li style={{ marginBottom: 10 }}>
              <Link
                href="/briefing"
                style={{
                  fontSize: 13,
                  color: "var(--fg-muted)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {t("briefingPage")}
              </Link>
            </li>
            {SERVICES.map((service) => (
              <li key={service.id} style={{ marginBottom: 10 }}>
                <Link
                  href={service.pathname}
                  style={{
                    fontSize: 13,
                    color: "var(--fg-muted)",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")
                  }
                >
                  {t(`serviceLinks.${service.messageKey}`)}
                </Link>
              </li>
            ))}
            <li style={{ marginBottom: 10 }}>
              <a
                href={BRIEFING_LANDING_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "var(--fg-muted)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")
                }
              >
                {t("briefingLabel")}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p
            className="text-label"
            style={{ color: "var(--fg-muted)", marginBottom: 12, fontSize: 9 }}
          >
            {t("stackLabel")}
          </p>
          <p style={{ fontSize: 13, color: "var(--fg-muted)", margin: 0, lineHeight: 1.8 }}>
            {t("stack")}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <LangToggle />
          <a
            href={whatsappDirect()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-label"
            style={{
              color: "var(--fg-muted)",
              textDecoration: "none",
              fontSize: 10,
            }}
          >
            {t("whatsapp")} →
          </a>
        </div>
      </div>

      <div className="divider" style={{ marginBottom: 24 }} />

      <p
        style={{
          fontSize: 12,
          color: "var(--fg-muted)",
          margin: 0,
          textAlign: "center",
        }}
      >
        {t("copyright")}
      </p>
    </footer>
  );
}

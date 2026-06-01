"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type LangToggleProps = {
  variant?: "light" | "dark";
};

export default function LangToggle({ variant = "dark" }: LangToggleProps) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const next = locale === "es" ? "en" : "es";
    router.replace(pathname, { locale: next });
  };

  const isDark = variant === "dark";

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={t("langAria")}
      title={t("langAria")}
      data-cursor="SWITCH"
      className="text-label"
      style={{
        fontSize: 10,
        color: isDark ? "var(--fg-muted)" : "var(--fg-muted)",
        background: "transparent",
        border: "1px solid var(--line)",
        borderRadius: 2,
        padding: "6px 10px",
        cursor: "pointer",
        transition: "color 0.3s, border-color 0.3s",
        pointerEvents: "auto",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--fg)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--fg-muted)";
        e.currentTarget.style.borderColor = "var(--line)";
      }}
    >
      {t("langSwitch")}
      <span className="sr-only">
        {" "}
        ({locale === "es" ? "English" : "Español"})
      </span>
    </button>
  );
}

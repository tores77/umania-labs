"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useLocaleSwitch } from "@/components/LocaleSwitchProvider";

type LangToggleProps = {
  variant?: "light" | "dark";
};

export default function LangToggle({ variant = "dark" }: LangToggleProps) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : undefined;
  const { blogAlternateSlug } = useLocaleSwitch();

  const switchLocale = () => {
    const next = locale === "es" ? "en" : "es";

    if (slug && pathname === "/blog/[slug]") {
      if (blogAlternateSlug) {
        router.replace(
          { pathname: "/blog/[slug]", params: { slug: blogAlternateSlug } } as never,
          { locale: next },
        );
        return;
      }

      router.replace("/blog" as never, { locale: next });
      return;
    }

    router.replace(pathname as never, { locale: next });
  };

  const isDark = variant === "dark";

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={t("langAria")}
      title={t("langAria")}
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

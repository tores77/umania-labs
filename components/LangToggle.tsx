"use client";

import { useLanguage } from "@/components/LanguageProvider";

type LangToggleProps = {
  variant?: "light" | "dark";
};

export default function LangToggle({ variant = "light" }: LangToggleProps) {
  const { locale, t, toggleLocale } = useLanguage();

  const isDark = variant === "dark";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.lang.ariaLabel}
      title={t.lang.ariaLabel}
      data-cursor="SWITCH"
      style={{
        fontFamily: "var(--font-space-mono)",
        fontSize: 10,
        fontWeight: 400,
        letterSpacing: "0.2em",
        color: isDark ? "rgba(250,250,248,0.55)" : "var(--fg-muted)",
        background: "transparent",
        border: `0.5px solid ${isDark ? "rgba(250,250,248,0.2)" : "var(--line)"}`,
        borderRadius: 2,
        padding: "6px 10px",
        cursor: "pointer",
        transition: "color 0.3s ease-out, border-color 0.3s ease-out, background 0.3s ease-out",
        pointerEvents: "auto",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.color = isDark ? "#FAFAF8" : "var(--fg)";
        el.style.borderColor = isDark
          ? "rgba(250,250,248,0.45)"
          : "var(--fg-subtle)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.color = isDark ? "rgba(250,250,248,0.55)" : "var(--fg-muted)";
        el.style.borderColor = isDark
          ? "rgba(250,250,248,0.2)"
          : "var(--line)";
      }}
    >
      {t.lang.switchTo}
      <span className="sr-only">
        {" "}
        ({locale === "es" ? "English" : "Español"})
      </span>
    </button>
  );
}

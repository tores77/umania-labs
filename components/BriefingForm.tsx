"use client";

import { useState, type FormEvent, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  BRIEFING_SUBSCRIBE_URL,
  BRIEFING_TEAL,
} from "@/lib/constants";

type FormStatus = "idle" | "success" | "already" | "error";

type SubscribeResponse = {
  success?: boolean;
  ok?: boolean;
  alreadySubscribed?: boolean;
  error?: string;
  codigo?: string;
  mensaje?: string;
  message?: string;
};

const inputStyle: CSSProperties = {
  background: "#111110",
  border: "1px solid rgba(245, 242, 237, 0.08)",
  color: "#f5f2ed",
  padding: "12px 16px",
  fontSize: 14,
  fontFamily: "var(--font-outfit)",
  outline: "none",
  width: "100%",
};

type BriefingFormProps = {
  layout?: "inline" | "stacked";
};

export default function BriefingForm({ layout = "inline" }: BriefingFormProps) {
  const t = useTranslations("briefing");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);

  const isInline = layout === "inline";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldError("");
    setErrorMessage("");
    setStatus("idle");

    if (!email.trim()) {
      setFieldError(t("emailRequired"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError(t("emailInvalid"));
      return;
    }

    if (!consent) {
      setFieldError(t("consentRequired"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(BRIEFING_SUBSCRIBE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          nombre: nombre.trim() || undefined,
          consentimiento: true,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as SubscribeResponse;
      const apiMessage = data.mensaje || data.message || "";

      const isAlready =
        res.status === 409 ||
        data.alreadySubscribed === true ||
        data.codigo === "already_subscribed" ||
        data.error === "already_subscribed";

      if (isAlready) {
        setStatus("already");
        return;
      }

      if (res.ok || data.success === true || data.ok === true) {
        setStatus("success");
        setEmail("");
        setNombre("");
        setConsent(false);
        return;
      }

      if (
        data.error === "missing_email" ||
        data.codigo === "missing_email" ||
        res.status === 400
      ) {
        setStatus("error");
        setErrorMessage(apiMessage || t("emailRequired"));
        return;
      }

      if (
        data.error === "invalid_email" ||
        data.codigo === "invalid_email"
      ) {
        setStatus("error");
        setErrorMessage(apiMessage || t("emailInvalid"));
        return;
      }

      setStatus("error");
      setErrorMessage(apiMessage || t("errorGeneric"));
    } catch {
      setStatus("error");
      setErrorMessage(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <p
        style={{
          color: BRIEFING_TEAL,
          fontSize: 15,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {t("success")}
      </p>
    );
  }

  if (status === "already") {
    return (
      <p
        style={{
          color: BRIEFING_TEAL,
          fontSize: 15,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {t("alreadySubscribed")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className="briefing-form-row"
        style={{
          display: "flex",
          flexDirection: isInline ? "row" : "column",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          required
          disabled={loading}
          aria-label={t("emailPlaceholder")}
          style={{
            ...inputStyle,
            flex: isInline ? "1 1 200px" : undefined,
            minWidth: isInline ? 200 : undefined,
          }}
        />
        <input
          type="text"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t("namePlaceholder")}
          disabled={loading}
          aria-label={t("namePlaceholder")}
          style={{
            ...inputStyle,
            flex: isInline ? "1 1 160px" : undefined,
            minWidth: isInline ? 160 : undefined,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: BRIEFING_TEAL,
            color: "#0a0a0a",
            border: "none",
            padding: "12px 28px",
            fontFamily: "var(--font-dm-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.3s",
            flexShrink: 0,
          }}
        >
          {loading ? "..." : t("submit")}
        </button>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          fontSize: 13,
          color: "#6b6560",
          lineHeight: 1.5,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          disabled={loading}
          style={{
            marginTop: 3,
            accentColor: BRIEFING_TEAL,
            flexShrink: 0,
          }}
        />
        <span>
          {t("consentPrefix")}{" "}
          <Link
            href="/privacy"
            style={{ color: BRIEFING_TEAL, textDecoration: "underline" }}
          >
            {t("privacyLink")}
          </Link>
        </span>
      </label>

      {(fieldError || (status === "error" && errorMessage)) && (
        <p style={{ color: "#e07070", fontSize: 13, margin: "12px 0 0" }}>
          {fieldError || errorMessage}
        </p>
      )}
    </form>
  );
}

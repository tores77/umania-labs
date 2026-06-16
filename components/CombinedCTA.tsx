"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations, useLocale } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";
import { CALENDLY_URL, whatsappLink } from "@/lib/constants";
import { scrollToHash } from "@/lib/scroll";

export default function CombinedCTA() {
  const t = useTranslations("cta");
  const tc = useTranslations("common");
  const locale = useLocale() as "es" | "en";
  const sectionRef = useRef<HTMLElement>(null);

  const [form, setForm] = useState({ name: "", email: "", message: "", sector: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const sectorOptions = t.raw("sectorOptions") as string[];

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = t("validation.name");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = t("validation.email");
    }
    if (!form.message.trim()) errors.message = t("validation.message");
    if (!form.sector) errors.sector = t("validation.sector");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "", sector: "" });
    } catch {
      setStatus("error");
    }
  };

  const scrollToAgent = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash("#agent");
    window.history.pushState(null, "", "#agent");
  };

  return (
    <section ref={sectionRef} id="contact" className="section section-padding">
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h2 data-fade className="section-title" style={{ marginBottom: 16 }}>
          {t("title")}
        </h2>
        <p
          data-fade
          style={{
            fontSize: 16,
            color: "var(--fg-muted)",
            margin: "0 0 48px",
            lineHeight: 1.6,
          }}
        >
          {t("subtitle")}
        </p>

        <div
          data-fade
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            marginBottom: 64,
          }}
        >
          <a
            href="#agent"
            onClick={scrollToAgent}
            className="cta-btn"
          >
            {tc("talkToAgent")}
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn-outline"
          >
            {tc("bookCall")}
          </a>
          <a
            href={whatsappLink(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn-outline"
          >
            {t("whatsapp")}
          </a>
        </div>

        <div data-fade style={{ textAlign: "left" }}>
          <h3
            className="text-label"
            style={{ color: "var(--fg-muted)", marginBottom: 24, textAlign: "center" }}
          >
            {t("formTitle")}
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
            noValidate
          >
            <div>
              <label htmlFor="contact-name" className="text-label" style={{ display: "block", marginBottom: 8, fontSize: 9 }}>
                {t("name")}
              </label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              {fieldErrors.name && <ErrorMsg msg={fieldErrors.name} />}
            </div>

            <div>
              <label htmlFor="contact-email" className="text-label" style={{ display: "block", marginBottom: 8, fontSize: 9 }}>
                {t("email")}
              </label>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
              {fieldErrors.email && <ErrorMsg msg={fieldErrors.email} />}
            </div>

            <div>
              <label htmlFor="contact-sector" className="text-label" style={{ display: "block", marginBottom: 8, fontSize: 9 }}>
                {t("sector")}
              </label>
              <select
                id="contact-sector"
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                style={{ ...inputStyle, appearance: "none" }}
              >
                <option value="">—</option>
                {sectorOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {fieldErrors.sector && <ErrorMsg msg={fieldErrors.sector} />}
            </div>

            <div>
              <label htmlFor="contact-message" className="text-label" style={{ display: "block", marginBottom: 8, fontSize: 9 }}>
                {t("message")}
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              {fieldErrors.message && <ErrorMsg msg={fieldErrors.message} />}
            </div>

            <button
              type="submit"
              className="cta-btn"
              disabled={status === "loading"}
              style={{ alignSelf: "center", marginTop: 8 }}
            >
              {status === "loading" ? "..." : t("submit")}
            </button>

            {status === "success" && (
              <p style={{ color: "var(--accent)", fontSize: 14, textAlign: "center" }}>
                {t("success")}
              </p>
            )}
            {status === "error" && (
              <p style={{ color: "#e07070", fontSize: 14, textAlign: "center" }}>
                {t("error")}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  color: "var(--fg)",
  padding: "12px 16px",
  fontSize: 14,
  fontFamily: "var(--font-outfit)",
  outline: "none",
};

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p style={{ color: "#e07070", fontSize: 12, margin: "4px 0 0" }}>
      {msg}
    </p>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { gsap, registerGsap } from "@/lib/gsap";

type Message = { role: "user" | "assistant"; content: string };

export default function AIAgent() {
  const t = useTranslations("agent");
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const welcome = t("welcome");
  const starterPrompts = t.raw("starterPrompts") as string[];
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const showPrompts = userMessageCount === 0 && !loading;

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector(".agent-chat"), {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submitText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setInput("");
      setError("");
      const userMsg: Message = { role: "user", content: trimmed };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setLoading(true);

      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updated.map((m) => ({ role: m.role, content: m.content })),
            locale,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error === "no_api_key" ? t("errorNoKey") : t("error"));
          return;
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } catch {
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    },
    [loading, locale, messages, t]
  );

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitText(input);
  };

  return (
    <section ref={sectionRef} id="agent" className="section section-padding">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 className="section-title" style={{ marginBottom: 16, textAlign: "center" }}>
          {t("title")}
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--fg-muted)",
            textAlign: "center",
            margin: "0 0 48px",
            lineHeight: 1.6,
          }}
        >
          {t("subtitle")}
        </p>

        <div
          className="agent-chat"
          style={{
            border: "1px solid var(--line)",
            background: "var(--surface)",
            display: "flex",
            flexDirection: "column",
            height: 480,
          }}
          data-lenis-prevent
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    background:
                      msg.role === "user" ? "var(--accent-dim)" : "var(--bg)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(200,169,110,0.3)"
                        : "1px solid var(--line)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--fg)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {showPrompts && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignSelf: "flex-start",
                  maxWidth: "100%",
                }}
              >
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="agent-prompt-chip"
                    onClick={() => submitText(prompt)}
                    disabled={loading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div style={{ alignSelf: "flex-start" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--bg)",
                    border: "1px solid var(--line)",
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                  <span
                    className="text-label"
                    style={{ marginLeft: 8, color: "var(--fg-muted)", fontSize: 9 }}
                  >
                    {t("typing")}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p style={{ color: "#e07070", fontSize: 13, textAlign: "center" }}>
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              borderTop: "1px solid var(--line)",
              padding: 16,
              gap: 12,
            }}
          >
            <label htmlFor="agent-input" className="sr-only">
              {t("inputLabel")}
            </label>
            <input
              id="agent-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              disabled={loading}
              style={{
                flex: 1,
                background: "var(--bg)",
                border: "1px solid var(--line)",
                color: "var(--fg)",
                padding: "12px 16px",
                fontSize: 14,
                fontFamily: "var(--font-outfit)",
                outline: "none",
              }}
            />
            <button type="submit" className="cta-btn" disabled={loading || !input.trim()}>
              {t("send")}
            </button>
          </form>
        </div>

        <p
          className="text-label"
          style={{
            textAlign: "center",
            marginTop: 16,
            color: "var(--fg-muted)",
            fontSize: 9,
          }}
        >
          {t("poweredBy")}
        </p>
      </div>
    </section>
  );
}

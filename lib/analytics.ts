declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export function trackOaiLead(valueEurCents = 150000) {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;
  window.oaiq("measure", "lead_created", {
    type: "customer_action",
    amount: valueEurCents,
    currency: "EUR",
  });
}

export function trackOaiCustom(name: string) {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;
  window.oaiq("measure", "custom", { type: "custom" }, { custom_event_name: name });
}

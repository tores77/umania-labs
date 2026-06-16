type MessagePart =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
const PLAIN_URL_REGEX = /(https?:\/\/[^\s)]+)/g;

function parsePlainUrls(text: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PLAIN_URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "link", label: match[1], href: match[1] });
    lastIndex = match.index + match[1].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

export function parseAgentMessage(content: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MARKDOWN_LINK_REGEX.lastIndex = 0;

  while ((match = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...parsePlainUrls(content.slice(lastIndex, match.index)));
    }
    parts.push({ type: "link", label: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(...parsePlainUrls(content.slice(lastIndex)));
  }

  return parts.length > 0 ? parts : [{ type: "text", value: content }];
}

function isWhatsAppLink(href: string): boolean {
  return href.includes("wa.me/") || href.includes("api.whatsapp.com");
}

export function AgentMessageContent({ content }: { content: string }) {
  const parts = parseAgentMessage(content);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.value}</span>;
        }

        const whatsapp = isWhatsAppLink(part.href);

        if (whatsapp) {
          return (
            <a
              key={index}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              className="agent-whatsapp-cta"
            >
              {part.label}
            </a>
          );
        }

        return (
          <a
            key={index}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            {part.label}
          </a>
        );
      })}
    </span>
  );
}

export function hasWhatsAppLink(content: string): boolean {
  return parseAgentMessage(content).some(
    (part) => part.type === "link" && isWhatsAppLink(part.href),
  );
}

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "code",
  "pre",
  "img",
  "figure",
  "figcaption",
  "span",
  "div",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
]);

const GLOBAL_ATTRS = new Set(["class", "id"]);
const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height"]),
  th: new Set(["colspan", "rowspan", "scope"]),
  td: new Set(["colspan", "rowspan"]),
};

function isSafeUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized.startsWith("javascript:")) return false;
  if (normalized.startsWith("data:text/html")) return false;
  if (normalized.startsWith("vbscript:")) return false;
  return (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("/") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("#")
  );
}

function sanitizeAttribute(tag: string, name: string, value: string): string | null {
  const attr = name.toLowerCase();
  const allowed =
    GLOBAL_ATTRS.has(attr) || TAG_ATTRS[tag]?.has(attr) === true;

  if (!allowed) return null;
  if (attr === "href" || attr === "src") {
    if (!isSafeUrl(value)) return null;
  }
  if (attr.startsWith("on")) return null;

  return `${attr}="${value.replace(/"/g, "&quot;")}"`;
}

function sanitizeOpeningTag(tag: string, raw: string): string {
  const attrRegex = /([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>/]+))/g;
  const attrs: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(raw)) !== null) {
    const name = match[1];
    const value = match[3] ?? match[4] ?? match[5] ?? "";
    const sanitized = sanitizeAttribute(tag, name, value);
    if (sanitized) attrs.push(sanitized);
  }

  const selfClosing = /\/\s*>$/.test(raw);
  if (attrs.length === 0) {
    return selfClosing ? `<${tag} />` : `<${tag}>`;
  }
  return selfClosing
    ? `<${tag} ${attrs.join(" ")} />`
    : `<${tag} ${attrs.join(" ")}>`;
}

export function sanitizeHtml(html: string): string {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const withoutDangerousBlocks = withoutComments
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<form\b[\s\S]*?<\/form>/gi, "");

  return withoutDangerousBlocks
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName: string) => {
      const tag = tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";

      if (match.startsWith("</")) {
        return `</${tag}>`;
      }

      return sanitizeOpeningTag(tag, match);
    })
    .trim();
}

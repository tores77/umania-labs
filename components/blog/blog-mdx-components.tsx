import type { ComponentPropsWithoutRef } from "react";

const articleStyles = {
  h2: {
    fontFamily: "var(--font-cormorant), Georgia, serif",
    fontSize: "clamp(28px, 4vw, 36px)",
    fontWeight: 400,
    color: "var(--fg)",
    margin: "48px 0 20px",
    paddingLeft: 20,
    borderLeft: "3px solid var(--accent)",
    lineHeight: 1.15,
  },
  h3: {
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    fontSize: 20,
    fontWeight: 500,
    color: "var(--fg)",
    margin: "32px 0 12px",
    lineHeight: 1.3,
  },
  p: {
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    fontSize: 16,
    lineHeight: 1.8,
    color: "var(--fg-muted)",
    margin: "0 0 20px",
    maxWidth: 680,
  },
  ul: {
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    fontSize: 16,
    lineHeight: 1.8,
    color: "var(--fg-muted)",
    margin: "0 0 24px",
    paddingLeft: 24,
    maxWidth: 680,
  },
  ol: {
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    fontSize: 16,
    lineHeight: 1.8,
    color: "var(--fg-muted)",
    margin: "0 0 24px",
    paddingLeft: 24,
    maxWidth: 680,
  },
  li: {
    marginBottom: 8,
  },
  blockquote: {
    fontFamily: "var(--font-cormorant), Georgia, serif",
    fontSize: 22,
    fontStyle: "italic",
    color: "var(--fg)",
    margin: "32px 0",
    padding: "16px 0 16px 24px",
    borderLeft: "3px solid var(--accent)",
    maxWidth: 680,
  },
  code: {
    fontFamily: "var(--font-dm-mono), ui-monospace, monospace",
    fontSize: 13,
    background: "var(--surface)",
    color: "var(--accent)",
    padding: "2px 6px",
  },
  pre: {
    fontFamily: "var(--font-dm-mono), ui-monospace, monospace",
    fontSize: 13,
    background: "var(--surface)",
    border: "1px solid var(--line)",
    padding: "20px 24px",
    overflowX: "auto" as const,
    margin: "24px 0",
    maxWidth: 680,
  },
  a: {
    color: "var(--accent)",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  strong: {
    color: "var(--fg)",
    fontWeight: 500,
  },
};

function H2(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 {...props} style={articleStyles.h2} />;
}

function H3(props: ComponentPropsWithoutRef<"h3">) {
  return <h3 {...props} style={articleStyles.h3} />;
}

function P(props: ComponentPropsWithoutRef<"p">) {
  return <p {...props} style={articleStyles.p} />;
}

function Ul(props: ComponentPropsWithoutRef<"ul">) {
  return <ul {...props} style={articleStyles.ul} />;
}

function Ol(props: ComponentPropsWithoutRef<"ol">) {
  return <ol {...props} style={articleStyles.ol} />;
}

function Li(props: ComponentPropsWithoutRef<"li">) {
  return <li {...props} style={articleStyles.li} />;
}

function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return <blockquote {...props} style={articleStyles.blockquote} />;
}

function Code(props: ComponentPropsWithoutRef<"code">) {
  const isBlock = props.className?.includes("language-");
  if (isBlock) {
    return <code {...props} style={{ ...articleStyles.code, background: "transparent", padding: 0 }} />;
  }
  return <code {...props} style={articleStyles.code} />;
}

function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return <pre {...props} style={articleStyles.pre} />;
}

function A(props: ComponentPropsWithoutRef<"a">) {
  return <a {...props} style={articleStyles.a} />;
}

function Strong(props: ComponentPropsWithoutRef<"strong">) {
  return <strong {...props} style={articleStyles.strong} />;
}

export const blogMdxComponents = {
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  a: A,
  strong: Strong,
};

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();

function escapeSqlString(value) {
  return value.replace(/'/g, "''");
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("<script")) {
      const scriptLines = [line];
      i += 1;
      while (i < lines.length && !lines[i].includes("</script>")) {
        scriptLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) {
        scriptLines.push(lines[i]);
      }
      html.push(scriptLines.join("\n"));
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      html.push(`<h2>${inlineMarkdown(line.slice(3).trim())}</h2>`);
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      html.push(`<h3>${inlineMarkdown(line.slice(4).trim())}</h3>`);
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      html.push(`<blockquote><p>${inlineMarkdown(line.slice(2).trim())}</p></blockquote>`);
      i += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${inlineMarkdown(lines[i].slice(2).trim())}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(lines[i].replace(/^\d+\.\s/, "").trim())}</li>`);
        i += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      html.push(`<p><em>${inlineMarkdown(line.slice(1, -1).trim())}</em></p>`);
      i += 1;
      continue;
    }

    html.push(`<p>${inlineMarkdown(line.trim())}</p>`);
    i += 1;
  }

  return html.join("\n");
}

function faqScriptToHtml(faqSchema) {
  if (!Array.isArray(faqSchema) || faqSchema.length === 0) return "";

  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSchema.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function buildInsert(meta, contentHtml) {
  const articleId = `${meta.slug}-seed-2026-06-01`;
  const tagsSql = `{${meta.tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(",")}}`;

  return `-- ${meta.locale.toUpperCase()}: ${meta.title}
INSERT INTO articles (
  article_id,
  title,
  content,
  seo_title,
  seo_description,
  slug,
  tags,
  status,
  locale,
  created_at
) VALUES (
  '${escapeSqlString(articleId)}',
  '${escapeSqlString(meta.title)}',
  '${escapeSqlString(contentHtml)}',
  '${escapeSqlString(meta.title)}',
  '${escapeSqlString(meta.description)}',
  '${escapeSqlString(meta.slug)}',
  '${tagsSql}',
  'published',
  '${escapeSqlString(meta.locale)}',
  '${meta.date}T12:00:00.000Z'
);
`;
}

const files = [
  {
    locale: "es",
    file: "content/blog/es/por-que-tu-web-no-aparece-en-chatgpt.mdx",
  },
  {
    locale: "en",
    file: "content/blog/en/why-your-website-doesnt-appear-in-chatgpt.mdx",
  },
];

const inserts = files.map(({ locale, file }) => {
  const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
  const { data, content } = matter(raw);
  const body = content.trim();
  const scriptIndex = body.indexOf("<script");
  const markdownBody = scriptIndex >= 0 ? body.slice(0, scriptIndex).trim() : body;
  const htmlBody = mdToHtml(markdownBody);
  const faqHtml = faqScriptToHtml(data.faqSchema);
  const contentHtml = faqHtml ? `${htmlBody}\n${faqHtml}` : htmlBody;

  return buildInsert(
    {
      locale,
      title: data.title,
      description: data.description,
      slug: data.slug,
      tags: data.tags,
      date: data.date,
    },
    contentHtml,
  );
});

const output = `-- Seed hardcoded blog articles migrated from MDX to Supabase
-- Run manually in Supabase SQL Editor after confirming the articles table exists.

${inserts.join("\n")}
`;

const outPath = path.join(ROOT, "supabase/migrations/seed_blog_hardcoded.sql");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output, "utf8");
console.log(`Wrote ${outPath}`);

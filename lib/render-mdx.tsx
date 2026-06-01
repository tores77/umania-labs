import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";
import { blogMdxComponents } from "@/components/blog/blog-mdx-components";

export async function renderBlogMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: process.env.NODE_ENV === "development",
  });

  const { default: MDXContent } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return function BlogMDXContent() {
    return <MDXContent components={blogMdxComponents as MDXComponents} />;
  };
}

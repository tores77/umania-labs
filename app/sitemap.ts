import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { getArticles } from "@/lib/supabase/server";
import { getBlogLanguageSlugs } from "@/lib/blog-slugs";

type StaticRoute = {
  pathname: "/" | "/briefing" | "/blog" | "/privacy";
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { pathname: "/", changeFrequency: "weekly", priority: 1.0 },
  { pathname: "/briefing", changeFrequency: "monthly", priority: 0.8 },
  { pathname: "/blog", changeFrequency: "monthly", priority: 0.8 },
  { pathname: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

function localizedPath(pathname: StaticRoute["pathname"], locale: string): string {
  if (pathname === "/privacy") {
    return locale === "es" ? "/privacidad" : "/privacy";
  }
  return pathname === "/" ? "" : pathname;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries = routing.locales.flatMap((locale) =>
    STATIC_ROUTES.map((route) => {
      const path = localizedPath(route.pathname, locale);
      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((l) => [
                l,
                `${SITE_URL}/${l}${localizedPath(route.pathname, l)}`,
              ])
            ),
            "x-default": `${SITE_URL}/es${localizedPath(route.pathname, "es")}`,
          },
        },
      };
    })
  );

  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const postsByLocale = await Promise.all(
      routing.locales.map(async (locale) => ({
        locale,
        posts: await getArticles(locale),
      }))
    );

    blogEntries = postsByLocale.flatMap(({ locale, posts }) =>
      posts.map((post) => {
        const { es, en } = getBlogLanguageSlugs(post.slug, locale);
        return {
          url: `${SITE_URL}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.7,
          alternates: {
            languages: {
              es: `${SITE_URL}/es/blog/${es}`,
              en: `${SITE_URL}/en/blog/${en}`,
              "x-default": `${SITE_URL}/es/blog/${es}`,
            },
          },
        };
      })
    );
  } catch (error) {
    console.error("[sitemap] Failed to load blog articles:", error);
  }

  return [...staticEntries, ...blogEntries];
}

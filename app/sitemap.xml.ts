import { getAllContent } from "@/lib/content-manager";
import { locales } from "@/lib/i18n/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = "https://talha-yuce.vercel.app";
    
    let urls: string[] = [];

    // Blog yazıları
    for (const locale of locales) {
      try {
        const blogPosts = await getAllContent("blog", locale);
        urls.push(
          ...blogPosts.map(
            (post) =>
              `<url><loc>${baseUrl}/${locale}/blog/${post.slug}</loc><lastmod>${new Date(
                post.date
              ).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
          )
        );
      } catch (error) {
        console.error(`Error getting blog posts for locale ${locale}:`, error);
      }
    }

    // Projeler
    for (const locale of locales) {
      try {
        const projects = await getAllContent("projects", locale);
        urls.push(
          ...projects.map(
            (project) =>
              `<url><loc>${baseUrl}/${locale}/projects/${project.slug}</loc><lastmod>${new Date(
                project.date
              ).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
          )
        );
      } catch (error) {
        console.error(`Error getting projects for locale ${locale}:`, error);
      }
    }

    // Statik sayfalar
    const staticPages = locales.flatMap(
      (locale) => `
        <url><loc>${baseUrl}/${locale}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>1</priority></url>
        <url><loc>${baseUrl}/${locale}/about</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
        <url><loc>${baseUrl}/${locale}/blog</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
        <url><loc>${baseUrl}/${locale}/projects</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
      `
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticPages}
        ${urls.join("\n")}
      </urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("<error>Failed to generate sitemap</error>", {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}

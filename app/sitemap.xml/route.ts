import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://fujiviewtech.com";
  const pages = [
    "",
    "categorias/reviews",
    "categorias/produtos",
    "categorias/noticias",
    "categorias/novidades",
    "sobre",
  ];
  const urls = pages
    .map((p) => {
      const url = `${baseUrl}/${p}`.replace(/\/$/, "");
      return `<url><loc>${url}</loc></url>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

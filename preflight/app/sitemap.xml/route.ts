import { marketingNav, dashboardNav } from '@/lib/routes';

function urlEntry(loc: string, priority = '0.7') {
  return `  <url><loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}${loc}</loc><priority>${priority}</priority></url>`;
}

export async function GET() {
  const urls = new Set<string>();
  urls.add('/');
  marketingNav.forEach((m) => urls.add(m.href));
  dashboardNav.forEach((d) => urls.add(d.href));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Array.from(urls)
    .map((u) => urlEntry(u, u === '/' ? '1.0' : '0.7'))
    .join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

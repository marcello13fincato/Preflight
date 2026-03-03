import React from 'react';
import Head from 'next/head';

export default function SEO({ title, description }: { title?: string; description?: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Preflight';
  return (
    <Head>
      <title>{title ? `${title} — ${site}` : site}</title>
      {description ? <meta name="description" content={description} /> : null}
    </Head>
  );
}

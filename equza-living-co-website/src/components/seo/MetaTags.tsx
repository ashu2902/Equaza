import Head from 'next/head';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
  author?: string;
  viewport?: string;
}

const DEFAULT_SEO = {
  title: 'Equza Living Co. | Handcrafted Rugs for Modern Spaces',
  description: 'Discover premium handcrafted rugs that bring crafted calm to modern spaces. Heritage weaving traditions reimagined for contemporary living.',
  keywords: ['handcrafted rugs', 'premium rugs', 'modern rugs', 'heritage weaving', 'custom rugs', 'interior design'],
  robots: 'index, follow',
  author: 'Equza Living Co.',
  viewport: 'width=device-width, initial-scale=1.0'
};

export function MetaTags({
  title,
  description,
  keywords = [],
  canonical,
  robots = DEFAULT_SEO.robots,
  author = DEFAULT_SEO.author,
  viewport = DEFAULT_SEO.viewport
}: MetaTagsProps) {
  const metaTitle = title ? `${title} | Equza Living Co.` : DEFAULT_SEO.title;
  const metaDescription = description || DEFAULT_SEO.description;
  const metaKeywords = keywords.length > 0 ? keywords : DEFAULT_SEO.keywords;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="viewport" content={viewport} />
      <meta name="robots" content={robots} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Language and Character Set */}
      <meta charSet="UTF-8" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#98342d" />
      <meta name="msapplication-TileColor" content="#98342d" />

      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />

      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
} 
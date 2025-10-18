import Head from 'next/head';

interface OpenGraphProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  // Product specific
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'in stock' | 'out of stock' | 'preorder';
  // Article specific
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_OG = {
  siteName: 'Equza Living Co.',
  type: 'website' as const,
  locale: 'en_US',
  title: 'Equza Living Co. | Handcrafted Rugs for Modern Spaces',
  description:
    'Discover premium handcrafted rugs that bring crafted calm to modern spaces. Heritage weaving traditions reimagined for contemporary living.',
  image: 'https://equzalivingco.com/og-image.jpg',
  url: 'https://equzalivingco.com',
};

export function OpenGraph({
  title,
  description,
  image,
  url,
  type = DEFAULT_OG.type,
  siteName = DEFAULT_OG.siteName,
  locale = DEFAULT_OG.locale,
  price,
  availability,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: OpenGraphProps) {
  const ogTitle = title || DEFAULT_OG.title;
  const ogDescription = description || DEFAULT_OG.description;
  const ogImage = image || DEFAULT_OG.image;
  const ogUrl = url || DEFAULT_OG.url;

  return (
    <Head>
      {/* Basic Open Graph Tags */}
      <meta property='og:title' content={ogTitle} />
      <meta property='og:description' content={ogDescription} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:url' content={ogUrl} />
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:locale' content={locale} />

      {/* Image Meta */}
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:type' content='image/jpeg' />
      <meta property='og:image:alt' content={ogTitle} />

      {/* Twitter Card Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={ogTitle} />
      <meta name='twitter:description' content={ogDescription} />
      <meta name='twitter:image' content={ogImage} />
      <meta name='twitter:image:alt' content={ogTitle} />

      {/* Add Twitter site handle if available */}
      <meta name='twitter:site' content='@equzalivingco' />
      <meta name='twitter:creator' content='@equzalivingco' />

      {/* Product Specific Tags */}
      {type === 'product' && price && (
        <>
          <meta
            property='product:price:amount'
            content={price.amount.toString()}
          />
          <meta property='product:price:currency' content={price.currency} />
        </>
      )}

      {type === 'product' && availability && (
        <meta property='product:availability' content={availability} />
      )}

      {/* Article Specific Tags */}
      {type === 'article' && author && (
        <meta property='article:author' content={author} />
      )}

      {type === 'article' && publishedTime && (
        <meta property='article:published_time' content={publishedTime} />
      )}

      {type === 'article' && modifiedTime && (
        <meta property='article:modified_time' content={modifiedTime} />
      )}

      {type === 'article' && section && (
        <meta property='article:section' content={section} />
      )}

      {type === 'article' &&
        tags.length > 0 &&
        tags.map((tag, index) => (
          <meta key={index} property='article:tag' content={tag} />
        ))}

      {/* Facebook App ID (if available) */}
      <meta property='fb:app_id' content='your_facebook_app_id' />

      {/* Additional Twitter Tags */}
      <meta name='twitter:domain' content='equzalivingco.com' />

      {/* Pinterest Rich Pins */}
      <meta name='pinterest-rich-pin' content='true' />
    </Head>
  );
}

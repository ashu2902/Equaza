import Head from 'next/head';

import type { Product, Collection } from '@/types';

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    email: string;
  };
  address: {
    '@type': string;
    addressCountry: string;
  };
  sameAs: string[];
}

interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': string;
    name: string;
  };
  category: string;
  material: string;
  offers?: {
    '@type': string;
    availability: string;
    priceCurrency: string;
    price?: number;
  };
}

interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

interface StructuredDataProps {
  type: 'organization' | 'product' | 'website' | 'breadcrumb';
  data?: Product | Collection | any;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function StructuredData({
  type,
  data,
  breadcrumbs,
}: StructuredDataProps) {
  const generateOrganizationSchema = (): OrganizationSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Equza Living Co.',
    description:
      'Premium handcrafted rugs for modern spaces. Heritage weaving traditions reimagined for contemporary living.',
    url: 'https://equzalivingco.com',
    logo: 'https://equzalivingco.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'info@equzalivingco.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    sameAs: [
      'https://instagram.com/equzalivingco',
      'https://pinterest.com/equzalivingco',
      'https://facebook.com/equzalivingco',
    ],
  });

  const generateProductSchema = (product: Product): ProductSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Equza Living Co.',
    },
    category: product.collections.join(', '),
    material: product.specifications.materials.join(', '),
    ...(product.price.isVisible &&
      product.price.startingFrom && {
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: product.price.currency,
          price: product.price.startingFrom,
        },
      }),
  });

  const generateWebsiteSchema = (): WebsiteSchema => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Equza Living Co.',
    description: 'Premium handcrafted rugs for modern spaces',
    url: 'https://equzalivingco.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://equzalivingco.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  });

  const generateBreadcrumbSchema = (
    items: Array<{ name: string; url: string }>
  ): BreadcrumbSchema => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });

  let schema: any = null;

  switch (type) {
    case 'organization':
      schema = generateOrganizationSchema();
      break;
    case 'product':
      if (data) {
        schema = generateProductSchema(data as Product);
      }
      break;
    case 'website':
      schema = generateWebsiteSchema();
      break;
    case 'breadcrumb':
      if (breadcrumbs) {
        schema = generateBreadcrumbSchema(breadcrumbs);
      }
      break;
    default:
      return null;
  }

  if (!schema) return null;

  return (
    <Head>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections | Equza Living Co. - Handcrafted Rugs by Style & Space',
  description: 'Explore our curated rug collections organized by style and space. From contemporary to traditional designs, find the perfect handcrafted rug for your home.',
  openGraph: {
    title: 'Collections | Equza Living Co.',
    description: 'Curated handcrafted rug collections by style and space',
    images: ['/images/og-collections.jpg'],
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
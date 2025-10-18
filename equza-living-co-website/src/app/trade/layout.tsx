import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trade Partnership | Equza Living Co. - Wholesale & Retail Partners',
  description:
    'Join our trade partnership program and bring authentic handcrafted rugs to your customers. Competitive wholesale pricing, marketing support, and dedicated account management.',
  openGraph: {
    title: 'Trade Partnership | Equza Living Co.',
    description: 'Partner with us to offer authentic handcrafted rugs',
    images: ['/images/og-trade.jpg'],
  },
};

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

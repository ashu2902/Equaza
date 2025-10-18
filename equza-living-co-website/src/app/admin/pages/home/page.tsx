/**
 * Admin Home Page Editor (Scaffold)
 * Minimal placeholder to begin Phase 1 implementation
 */

import { Metadata } from 'next';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Edit Homepage | Admin | Equza Living Co.',
  description: 'Edit homepage content',
  robots: 'noindex,nofollow',
};

import { getHomePageData } from '@/lib/firebase/pages';
import { HeroEditor } from '@/components/admin/HeroEditor';

export default async function AdminHomeEditorPage() {
  const data = await getHomePageData();
  const slides = Array.isArray(data?.hero) ? (data!.hero as any) : [];
  return (
    <AdminPageTemplate title='Homepage Editor'>
      <div className='space-y-6'>
        <HeroEditor initialSlides={slides as any} />
      </div>
    </AdminPageTemplate>
  );
}

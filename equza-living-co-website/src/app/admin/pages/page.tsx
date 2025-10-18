import { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Admin | Pages',
  description: 'Manage site pages',
  robots: 'noindex,nofollow',
};

export default function AdminPagesIndex() {
  return (
    <AdminPageTemplate title='Pages' showHeader={false}>
      <div className='space-y-6'>
        <Card className='shadow-sm border-warm-200 bg-cream-50'>
          <CardHeader className='border-b border-warm-200 pb-4'>
            <CardTitle className='text-[#98342d]'>
              Choose a page to edit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <Link
                href='/admin/pages/home'
                className='group block rounded-md border border-warm-200 p-5 bg-white hover:border-[#98342d] hover:shadow transition'
              >
                <Typography
                  variant='h4'
                  className='text-warm-900 group-hover:text-[#98342d]'
                >
                  Homepage
                </Typography>
                <Typography variant='body' className='text-warm-700'>
                  Edit hero slides and key sections
                </Typography>
              </Link>
              <Link
                href='/admin/pages/our-story'
                className='group block rounded-md border border-warm-200 p-5 bg-white hover:border-[#98342d] hover:shadow transition'
              >
                <Typography
                  variant='h4'
                  className='text-warm-900 group-hover:text-[#98342d]'
                >
                  Our Story
                </Typography>
                <Typography variant='body' className='text-warm-700'>
                  Edit content (coming soon)
                </Typography>
              </Link>
              <Link
                href='/admin/pages/craftsmanship'
                className='group block rounded-md border border-warm-200 p-5 bg-white hover:border-[#98342d] hover:shadow transition'
              >
                <Typography
                  variant='h4'
                  className='text-warm-900 group-hover:text-[#98342d]'
                >
                  Craftsmanship
                </Typography>
                <Typography variant='body' className='text-warm-700'>
                  Edit content (coming soon)
                </Typography>
              </Link>
              <Link
                href='/admin/pages/trade'
                className='group block rounded-md border border-warm-200 p-5 bg-white hover:border-[#98342d] hover:shadow transition'
              >
                <Typography
                  variant='h4'
                  className='text-warm-900 group-hover:text-[#98342d]'
                >
                  Trade
                </Typography>
                <Typography variant='body' className='text-warm-700'>
                  Edit content (coming soon)
                </Typography>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageTemplate>
  );
}

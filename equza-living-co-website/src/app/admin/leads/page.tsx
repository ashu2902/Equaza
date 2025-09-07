/**
 * Admin Leads Management Page
 * 
 * Dashboard for managing customer inquiries and leads
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Eye,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowUpRight,
  Download,
  RefreshCw
} from 'lucide-react';

// Components
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

// Firebase
import { getSafeLeads } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

export const metadata: Metadata = {
  title: 'Leads Management | Admin | Equza Living Co.',
  description: 'Manage customer inquiries and leads for Equza Living Co.',
  robots: 'noindex,nofollow',
};

/**
 * Get Leads Data
 */
async function getLeadsData() {
  try {
    const leads = await getSafeLeads();
    
    return {
      leads: isDataResult(leads) ? leads.data : [],
      error: leads.error
    };
  } catch (error) {
    console.error('Leads data fetch error:', error);
    return {
      leads: [],
      error: 'Failed to load leads'
    };
  }
}

/**
 * Lead Status Badge
 */
function LeadStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    'new': { color: 'bg-blue-100 text-blue-800', label: 'New' },
    'contacted': { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted' },
    'qualified': { color: 'bg-green-100 text-green-800', label: 'Qualified' },
    'proposal': { color: 'bg-purple-100 text-purple-800', label: 'Proposal Sent' },
    'closed-won': { color: 'bg-green-100 text-green-800', label: 'Closed Won' },
    'closed-lost': { color: 'bg-red-100 text-red-800', label: 'Closed Lost' },
    'on-hold': { color: 'bg-gray-100 text-gray-800', label: 'On Hold' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['new'];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

/**
 * Lead Type Badge
 */
function LeadTypeBadge({ type }: { type: string }) {
  const typeConfig = {
    'contact': { color: 'bg-blue-100 text-blue-800', label: 'Contact', icon: MessageSquare },
    'customize': { color: 'bg-purple-100 text-purple-800', label: 'Custom Rug', icon: Tag },
    'enquiry': { color: 'bg-green-100 text-green-800', label: 'Product Enquiry', icon: Eye },
    'trade': { color: 'bg-orange-100 text-orange-800', label: 'Trade Partnership', icon: ArrowUpRight }
  };

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig['contact'];
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <IconComponent className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  );
}

/**
 * Lead Card Component
 */
function LeadCard({ lead }: { lead: any }) {
  const timeAgo = lead.createdAt ? 
    new Date(lead.createdAt).toLocaleDateString() : 
    'Unknown date';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {lead.name || 'Unknown Contact'}
              </h3>
              <LeadStatusBadge status={lead.status || 'new'} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <LeadTypeBadge type={lead.type || 'contact'} />
              {lead.priority && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  High Priority
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/leads/${lead.id}`}>
                <Eye className="h-3 w-3" />
              </Link>
            </Button>
            {lead.email && (
              <Button size="sm" variant="outline" asChild>
                <a href={`mailto:${lead.email}`}>
                  <Mail className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {lead.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
              <span>{lead.phone}</span>
            </div>
          )}
          {lead.company && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate">{lead.company}</span>
            </div>
          )}
        </div>

        {/* Message Preview */}
        {lead.message && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {lead.message}
          </p>
        )}

        {/* Product/Collection Reference */}
        {lead.productRef && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Related to:</p>
            <p className="text-sm font-medium text-gray-900">{lead.productRef}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {timeAgo}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {lead.responseTime || 'No response yet'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Leads List Component
 */
function LeadsList({ leads }: { leads: any[] }) {
  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Typography variant="h4" className="text-gray-600 mb-2">
            No Leads Yet
          </Typography>
          <p className="text-gray-500 mb-6">
            Customer inquiries and leads will appear here
          </p>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid cols={3} gap="lg">
      {leads.map((lead, index) => (
        <SlideUp key={lead.id} delay={index * 0.05}>
          <LeadCard lead={lead} />
        </SlideUp>
      ))}
    </Grid>
  );
}

/**
 * Admin Leads Page
 */
export default async function AdminLeadsPage() {
  const { leads, error } = await getLeadsData();

  // Calculate stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length
  };

  return (
    <AdminPageTemplate title="Leads Management">
      <div className="space-y-8">
        {/* Header Actions */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Typography variant="h3" className="text-gray-900 mb-2">
                Customer Leads
              </Typography>
              <p className="text-gray-600">
                Manage customer inquiries and track lead progress
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline">
                <a href="/api/admin/leads/export" download>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </a>
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button asChild>
                <Link href="/admin/leads/import">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Import Leads
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Stats Overview */}
        <FadeIn delay={0.1}>
          <Grid cols={4} gap="sm">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Leads</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                <p className="text-sm text-gray-600">New</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
                <p className="text-sm text-gray-600">Contacted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.qualified}</p>
                <p className="text-sm text-gray-600">Qualified</p>
              </CardContent>
            </Card>
          </Grid>
        </FadeIn>

        {/* Search and Filters */}
        <FadeIn delay={0.2}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search leads by name, email, or company..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                  <Button variant="outline" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Type
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center text-red-700">
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads Grid */}
        <div>
          <Suspense fallback={<div>Loading leads...</div>}>
            <LeadsList leads={leads} />
          </Suspense>
        </div>
      </div>
    </AdminPageTemplate>
  );
}
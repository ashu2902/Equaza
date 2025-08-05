/**
 * Admin Dashboard - Main Admin Home
 * 
 * Overview dashboard with key metrics and quick actions
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Grid3X3, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Eye,
  Plus,
  ArrowUpRight,
  FileText
} from 'lucide-react';

// Components
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

// Firebase
import { getSafeAdminStats } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Equza Living Co.',
  description: 'Admin dashboard for managing Equza Living Co. website content',
  robots: 'noindex,nofollow', // Prevent search engines from indexing admin pages
};

/**
 * Get Admin Dashboard Data
 */
async function getDashboardData() {
  try {
    const stats = await getSafeAdminStats();
    return {
      stats: isDataResult(stats) ? stats.data : null,
      error: stats.error
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return {
      stats: null,
      error: 'Failed to load dashboard data'
    };
  }
}

/**
 * Quick Action Cards
 */
const quickActions = [
  {
    title: 'Add Product',
    description: 'Add a new product to the catalog',
    href: '/admin/products/new',
    icon: Package,
    color: 'bg-[#98342d]'
  },
  {
    title: 'Create Collection',
    description: 'Create a new product collection',
    href: '/admin/collections/new',
    icon: Grid3X3,
    color: 'bg-[#98342d]/80'
  },
  {
    title: 'View Leads',
    description: 'Manage customer inquiries',
    href: '/admin/leads',
    icon: MessageSquare,
    color: 'bg-[#98342d]/60'
  },
  {
    title: 'Manage Users',
    description: 'Admin user management',
    href: '/admin/users',
    icon: Users,
    color: 'bg-[#98342d]/40'
  }
];

/**
 * Dashboard Stats Component
 */
function DashboardStats({ stats, error }: { stats: any; error?: string | null }) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>Unable to load statistics</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default stats if none available
  const defaultStats = {
    totalProducts: 0,
    totalCollections: 0,
    pendingLeads: 0,
    totalUsers: 1,
    recentActivity: []
  };

  const data = stats || defaultStats;

  const statCards = [
    {
      title: 'Total Products',
      value: data.totalProducts,
      icon: Package,
      trend: '+12%',
      color: 'text-[#98342d]',
      bgColor: 'bg-[#98342d]/10'
    },
    {
      title: 'Collections',
      value: data.totalCollections,
      icon: Grid3X3,
      trend: '+5%',
      color: 'text-[#98342d]',
      bgColor: 'bg-[#98342d]/15'
    },
    {
      title: 'Pending Leads',
      value: data.pendingLeads,
      icon: MessageSquare,
      trend: '+23%',
      color: 'text-[#98342d]',
      bgColor: 'bg-[#98342d]/20'
    },
    {
      title: 'Admin Users',
      value: data.totalUsers,
      icon: Users,
      trend: '0%',
      color: 'text-[#98342d]',
      bgColor: 'bg-[#98342d]/25'
    }
  ];

  return (
    <Grid cols={4} gap="lg">
      {statCards.map((stat, index) => (
        <SlideUp key={stat.title} delay={index * 0.1}>
          <Card className="bg-white border-[#98342d]/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#98342d]/70 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-[#98342d]">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                <span className="text-sm text-[#98342d]/50 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      ))}
    </Grid>
  );
}

/**
 * Recent Activity Component
 */
function RecentActivity() {
  const activities = [
    {
      action: 'New lead submitted',
      details: 'Custom rug inquiry from Sarah Johnson',
      time: '2 hours ago',
      type: 'lead'
    },
    {
      action: 'Product updated',
      details: 'Persian Traditional Rug - Updated pricing',
      time: '4 hours ago',
      type: 'product'
    },
    {
      action: 'Collection created',
      details: 'Modern Minimalist Collection published',
      time: '1 day ago',
      type: 'collection'
    },
    {
      action: 'New lead submitted',
      details: 'Trade partnership inquiry from Interior Design Co.',
      time: '2 days ago',
      type: 'lead'
    }
  ];

  return (
    <Card className="bg-white border-[#98342d]/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#98342d]">
          Recent Activity
          <Button variant="outline" size="sm" asChild className="border-[#98342d]/30 text-[#98342d] hover:bg-[#98342d]/10">
            <Link href="/admin/activity">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#98342d]/5 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-[#98342d] rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#98342d]">
                  {activity.action}
                </p>
                <p className="text-sm text-[#98342d]/60 truncate">
                  {activity.details}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <Clock className="h-4 w-4 text-[#98342d]/40" />
                <span className="text-xs text-[#98342d]/50 ml-1">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Admin Dashboard Page
 */
export default async function AdminDashboardPage() {
  const { stats, error } = await getDashboardData();

  return (
    <AdminPageTemplate title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <FadeIn>
          <div className="bg-white rounded-lg border border-[#98342d]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="text-[#98342d] mb-2">
                  Welcome to Admin Dashboard
                </Typography>
                <p className="text-[#98342d]/70">
                  Manage your Equza Living Co. website content and monitor key metrics
                </p>
              </div>
              <div className="hidden sm:block">
                <Button asChild className="bg-[#98342d] hover:bg-[#98342d]/90 text-white">
                  <Link href="/">
                    <Eye className="h-4 w-4 mr-2" />
                    View Site
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Statistics Overview */}
        <div>
          <Typography variant="h4" className="text-[#98342d] mb-6">
            Overview
          </Typography>
          <Suspense fallback={<div>Loading statistics...</div>}>
            <DashboardStats stats={stats} error={error} />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div>
          <Typography variant="h4" className="text-[#98342d] mb-6">
            Quick Actions
          </Typography>
          <Grid cols={4} gap="lg">
            {quickActions.map((action, index) => (
              <SlideUp key={action.title} delay={index * 0.1}>
                <Card className="bg-white border-[#98342d]/20 hover:shadow-lg hover:border-[#98342d]/30 transition-all">
                  <CardContent className="p-6">
                    <Link 
                      href={action.href}
                      className="block group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <Plus className="h-4 w-4 text-[#98342d]/40 group-hover:text-[#98342d] transition-colors" />
                      </div>
                      <h3 className="font-semibold text-[#98342d] mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-[#98342d]/70">
                        {action.description}
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </Grid>
        </div>

        {/* Recent Activity */}
        <div>
          <Typography variant="h4" className="text-[#98342d] mb-6">
            Recent Activity
          </Typography>
          <SlideUp delay={0.2}>
            <RecentActivity />
          </SlideUp>
        </div>
      </div>
    </AdminPageTemplate>
  );
}
'use client';

import { useState } from 'react';

import {
  LayoutDashboard,
  Package,
  Grid3X3,
  Users,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/lib/hooks/useAuth';

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navigationItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
  },
  {
    href: '/admin/collections',
    label: 'Collections',
    icon: Grid3X3,
  },
  {
    href: '/admin/weave-types',
    label: 'Weave Types',
    icon: FileText,
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: MessageSquare,
  },
  {
    href: '/admin/pages',
    label: 'Pages',
    icon: FileText,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function AdminSidebar({
  isCollapsed = false,
  onCollapse,
  isMobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed);

  const handleCollapse = () => {
    const newCollapsed = !internalCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const collapsed = onCollapse ? isCollapsed : internalCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#f1eee9] border-r border-[#98342d]/20 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className='h-16 flex items-center justify-between px-4 border-b border-[#98342d]/20'>
          {!collapsed && (
            <Link href='/' className='flex items-center'>
              <div className='w-8 h-8 bg-[#98342d] rounded-full flex items-center justify-center mr-3'>
                <span className='text-white font-bold text-sm'>E</span>
              </div>
              <span className='font-serif text-lg text-[#98342d] tracking-wide'>
                Equza Admin
              </span>
            </Link>
          )}

          {collapsed && (
            <div className='w-8 h-8 bg-[#98342d] rounded-full flex items-center justify-center mx-auto'>
              <span className='text-white font-bold text-sm'>E</span>
            </div>
          )}

          {/* Collapse toggle - desktop only */}
          <button
            onClick={handleCollapse}
            className='hidden lg:flex p-1.5 rounded-md text-[#98342d]/60 hover:text-[#98342d] hover:bg-[#98342d]/10 transition-colors'
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className='w-4 h-4' />
            ) : (
              <ChevronLeft className='w-4 h-4' />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto py-4 px-3 space-y-1'>
          {/* Back to site link */}
          <Link
            href='/'
            className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#98342d]/70 rounded-md hover:text-[#98342d] hover:bg-[#98342d]/10 transition-colors'
          >
            <Home className='w-5 h-5 flex-shrink-0' />
            {!collapsed && <span>Back to Site</span>}
          </Link>

          <div className='border-t border-[#98342d]/20 pt-4 mt-4'>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      isActive
                        ? 'bg-[#98342d]/15 text-[#98342d] border border-[#98342d]/25'
                        : 'text-[#98342d]/70 hover:text-[#98342d] hover:bg-[#98342d]/10'
                    }
                  `}
                  onClick={handleNavClick}
                >
                  <IconComponent
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive
                        ? 'text-[#98342d]'
                        : 'text-[#98342d]/50 group-hover:text-[#98342d]/70'
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className='p-4 border-t border-[#98342d]/20'>
            <div className='text-xs text-[#98342d]/60 text-center'>
              <div className='font-medium'>Equza Admin Panel</div>
              <div className='mt-1'>v1.0.0</div>
            </div>
          </div>
        )}
      </aside>

      {/* Spacer for desktop layout */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          collapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      />
    </>
  );
}

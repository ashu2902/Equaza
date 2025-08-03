'use client';

import { useState } from 'react';

import { AdminAuthGuard, AdminHeader, AdminSidebar } from '@/components/admin';

interface AdminPageTemplateProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function AdminPageTemplate({ 
  children, 
  title = 'Admin Dashboard',
  className = ''
}: AdminPageTemplateProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f1eee9]">
        {/* Admin Sidebar */}
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onCollapse={handleSidebarCollapse}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={handleMobileSidebarClose}
        />

        {/* Main Content Area */}
        <div 
          className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
        >
          {/* Admin Header */}
          <AdminHeader
            onMenuToggle={handleSidebarToggle}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* Page Content */}
          <main className={`flex-1 p-4 lg:p-6 ${className}`}>
            {/* Page Title */}
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#98342d]">
                  {title}
                </h1>
              </div>
            )}

            {/* Page Content */}
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
} 
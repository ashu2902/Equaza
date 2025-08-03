'use client';

import { useState } from 'react';

import { LogOut, Settings, User, Menu, Bell } from 'lucide-react';
import Link from 'next/link';

import { signOutUser } from '@/lib/firebase/auth';
import { useAuth } from '@/lib/hooks/useAuth';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

export function AdminHeader({ onMenuToggle, isSidebarCollapsed }: AdminHeaderProps) {
  const { user, adminRole } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOutUser();
      // Redirect will be handled by auth state change
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-[#98342d]/20 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left side - Menu toggle and breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-[#98342d]/60 hover:text-[#98342d] hover:bg-[#98342d]/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm">
          <Link
            href="/admin"
            className="text-[#98342d]/60 hover:text-[#98342d] transition-colors"
          >
            Admin
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Dashboard</span>
        </nav>
      </div>

      {/* Right side - Notifications and user menu */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {user?.displayName || 'Admin User'}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {adminRole || 'Administrator'}
              </div>
            </div>
          </button>

          {/* User dropdown menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-900">
                  {user?.displayName || 'Admin User'}
                </div>
                <div className="text-sm text-gray-500">{user?.email}</div>
                <div className="text-xs text-gray-400 mt-1 capitalize">
                  Role: {adminRole || 'Administrator'}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Admin Settings
                </button>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
} 
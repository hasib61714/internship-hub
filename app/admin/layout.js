'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Clock, Users, ShieldCheck, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/admin/pending-jobs',  label: 'Pending Jobs',    icon: Clock },
  { href: '/admin/users',         label: 'All Users',       icon: Users },
  { href: '/admin/verifications', label: 'Verifications',   icon: ShieldCheck },
  { href: '/admin/analytics',     label: 'Analytics',       icon: BarChart3 },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-6 gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Admin Panel</p>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            )}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </div>
          </Link>
        ))}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-around py-2">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn(
            'flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium rounded-lg',
            pathname === href ? 'text-red-600' : 'text-gray-400'
          )}>
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}

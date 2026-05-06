'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Briefcase, ChevronDown, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from '@/components/NotificationBell';
import { cn } from '@/lib/utils';

const STUDENT_LINKS = [
  { href: '/student/dashboard',    label: 'Dashboard' },
  { href: '/student/applications', label: 'Applications' },
  { href: '/student/saved-jobs',   label: 'Saved Jobs' },
  { href: '/student/profile',      label: 'My Profile' },
];

const COMPANY_LINKS = [
  { href: '/company/dashboard',  label: 'Dashboard' },
  { href: '/company/post-job',   label: 'Post Job' },
  { href: '/company/my-jobs',    label: 'My Jobs' },
  { href: '/company/templates',  label: 'Templates' },
  { href: '/company/profile',    label: 'Company Profile' },
];

const ADMIN_LINKS = [
  { href: '/admin/dashboard',     label: 'Dashboard' },
  { href: '/admin/pending-jobs',  label: 'Pending Jobs' },
  { href: '/admin/users',         label: 'Users' },
  { href: '/admin/verifications', label: 'Verifications' },
  { href: '/admin/analytics',     label: 'Analytics' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const pathname = usePathname();

  const roleLinks = profile?.role === 'student' ? STUDENT_LINKS
    : profile?.role === 'company' ? COMPANY_LINKS
    : profile?.role === 'admin'   ? ADMIN_LINKS
    : [];

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Briefcase className="h-6 w-6" />
            InternHub
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/jobs" className={cn('text-sm font-medium px-3 py-1.5 rounded-lg transition-colors', pathname === '/jobs' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white')}>
              Browse Jobs
            </Link>

            <ThemeToggle />

            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            ) : (
              <>
                <NotificationBell />
                <Link href="/messages" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </Link>

                <div className="relative ml-1">
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 py-1.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center text-sm">
                        {profile?.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                    )}
                    <span className="max-w-[120px] truncate">{profile?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20">
                        {roleLinks.map(link => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setDropdownOpen(false)}
                            className={cn('flex items-center gap-2 px-4 py-2 text-sm transition-colors', pathname === link.href ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700')}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            {link.label}
                          </Link>
                        ))}
                        <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                        <button
                          onClick={() => { setDropdownOpen(false); logout(); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            {user && <NotificationBell />}
            <button onClick={() => setMobileOpen(v => !v)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
          <Link href="/jobs" className="block py-2 text-sm text-gray-700 dark:text-gray-200 font-medium" onClick={() => setMobileOpen(false)}>Browse Jobs</Link>
          {user && (
            <Link href="/messages" className="block py-2 text-sm text-gray-700 dark:text-gray-200" onClick={() => setMobileOpen(false)}>Messages</Link>
          )}
          {roleLinks.map(link => (
            <Link key={link.href} href={link.href} className="block py-2 text-sm text-gray-700 dark:text-gray-200" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {!user ? (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Log in</Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full">Sign up</Button>
              </Link>
            </div>
          ) : (
            <button onClick={() => { setMobileOpen(false); logout(); }} className="flex items-center gap-2 w-full py-2 text-sm text-red-600">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

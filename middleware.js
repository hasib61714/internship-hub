import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const PROTECTED = [
  { prefix: '/student', roles: ['student'] },
  { prefix: '/company', roles: ['company'] },
  { prefix: '/admin',   roles: ['admin'] },
  { prefix: '/messages',      roles: ['student', 'company', 'admin'] },
  { prefix: '/notifications', roles: ['student', 'company', 'admin'] },
];

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Logged-in users should not visit auth pages
  if (user && AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check protected routes
  for (const { prefix, roles } of PROTECTED) {
    if (pathname.startsWith(prefix)) {
      if (!user) {
        const url = new URL('/login', request.url);
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
      }

      // Fetch role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !roles.includes(profile.role)) {
        // Wrong role — redirect to their own dashboard
        const roleRedirect = {
          student: '/student/dashboard',
          company: '/company/dashboard',
          admin:   '/admin/dashboard',
        };
        const dest = roleRedirect[profile?.role] ?? '/';
        return NextResponse.redirect(new URL(dest, request.url));
      }

      break;
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://internhub.vercel.app';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'InternHub — Find Your Dream Internship in Bangladesh',
    template: '%s | InternHub',
  },
  description:
    'InternHub connects students with top companies for internships and jobs in Bangladesh. Browse 500+ opportunities in tech, design, business and more.',
  keywords: ['internship', 'jobs', 'Bangladesh', 'students', 'career', 'InternHub'],
  authors: [{ name: 'InternHub' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'InternHub',
    title: 'InternHub — Find Your Dream Internship in Bangladesh',
    description:
      'Connect with top companies. 500+ internship & job opportunities for students in Bangladesh.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'InternHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InternHub — Find Your Dream Internship',
    description: '500+ internship & job opportunities for students in Bangladesh.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900 min-h-screen`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

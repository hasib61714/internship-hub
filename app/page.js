import Link from 'next/link';
import { ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JobCard from '@/components/JobCard';
import HeroSearch from '@/app/_components/HeroSearch';

export const metadata = {
  title: 'InternHub — Find Your Dream Internship in Bangladesh',
  description:
    'Connect with top companies in Bangladesh. 500+ internship and job opportunities in tech, business, design and more.',
};

async function getData() {
  const supabase = await createClient();

  const [{ data: featuredJobs }, { data: categories }] = await Promise.all([
    supabase
      .from('jobs')
      .select('*, company_profiles(company_name, logo_url, is_verified), categories(name)')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('categories').select('id, name, slug').order('name').limit(10),
  ]);

  return { featuredJobs: featuredJobs ?? [], categories: categories ?? [] };
}

export default async function Home() {
  const { featuredJobs, categories } = await getData();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Launch Your Career<br />
            <span className="text-blue-200">Find Your Dream Internship</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Connect with top companies in Bangladesh. Thousands of opportunities in tech, business, design and more.
          </p>
          {/* Only this tiny component is client-side */}
          <HeroSearch />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { label: 'Active Jobs',      value: '500+' },
            { label: 'Companies',        value: '200+' },
            { label: 'Students Hired',   value: '1,500+' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-blue-600">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/jobs?category=${cat.id}`}>
                <Card className="p-4 text-center hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{cat.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Opportunities</h2>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Browse all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} showTime={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="text-gray-500 text-lg">
            Join InternHub and connect students with opportunities, companies with talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                <GraduationCap className="h-5 w-5" /> I&apos;m a Student
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Building2 className="h-5 w-5" /> I&apos;m a Company
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

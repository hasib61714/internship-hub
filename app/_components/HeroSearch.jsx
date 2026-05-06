'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HeroSearch() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) router.push(`/jobs?search=${encodeURIComponent(search.trim())}`);
    else router.push('/jobs');
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Job title, skill, or company..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-base focus:outline-none shadow-lg"
        />
      </div>
      <Button type="submit" size="lg" variant="secondary" className="px-8 text-blue-700 font-semibold">
        Search Jobs
      </Button>
    </form>
  );
}

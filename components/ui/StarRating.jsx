'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarDisplay({ rating, max = 5, size = 'sm' }) {
  const sz = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(sz, i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200')}
        />
      ))}
    </div>
  );
}

export function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              'h-8 w-8 transition-colors',
              n <= (hovered || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-yellow-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}

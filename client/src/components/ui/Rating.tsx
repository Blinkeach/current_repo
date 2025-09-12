import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  count?: number;
  showCount?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'green';
  variant?: 'flat' | 'chip';
  className?: string;
}

export function Rating({
  value,
  count,
  showCount = false,
  showValue = false,
  size = 'md',
  color = 'amber',
  variant = 'flat',
  className
}: RatingProps) {
  // Round to nearest half for more accurate visual representation
  const rounded = Math.round((value ?? 0) * 2) / 2;
  const rating = Math.max(0, Math.min(5, rounded));
  const fullStars = Math.floor(rating);
  const hasHalfStar = (rating - fullStars) === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Size configurations
  const sizeConfig = {
    sm: {
      star: 'h-3.5 w-3.5',
      text: 'text-xs',
      gap: 'gap-0.5'
    },
    md: {
      star: 'h-4 w-4',
      text: 'text-sm',
      gap: 'gap-0.5'
    },
    lg: {
      star: 'h-5 w-5',
      text: 'text-base',
      gap: 'gap-1'
    }
  };

  // Color configurations with proper fill and stroke for green stars
  const colorConfig = {
    amber: {
      filled: 'text-amber-500 fill-amber-500',
      empty: 'text-amber-400/50 fill-transparent',
      text: 'text-amber-600'
    },
    green: {
      filled: 'text-green-500 fill-green-500',
      empty: 'text-green-500 fill-transparent',
      text: 'text-green-600'
    }
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];

  const stars = [];

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className={cn(currentSize.star, currentColor.filled)}
        aria-hidden="true"
        focusable="false"
      />
    );
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <StarHalf
        key="half"
        className={cn(currentSize.star, currentColor.filled)}
        aria-hidden="true"
        focusable="false"
      />
    );
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        className={cn(currentSize.star, currentColor.empty)}
        aria-hidden="true"
        focusable="false"
      />
    );
  }

  const content = (
    <div className={cn(
      'flex items-center',
      currentSize.gap,
      variant === 'chip' && color === 'amber' && 'bg-amber-50 ring-1 ring-amber-100 rounded-full px-2 py-0.5',
      variant === 'chip' && color === 'green' && 'bg-emerald-50 ring-1 ring-emerald-100 rounded-full px-2 py-0.5',
      className
    )}>
      <div className={cn('flex', currentSize.gap)} role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {stars}
      </div>
      
      {showValue && (
        <span className={cn(
          'ml-1 font-medium',
          currentSize.text,
          currentColor.text
        )}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {showCount && count !== undefined && (
        <span className={cn(
          'ml-1 text-neutral-500',
          currentSize.text
        )}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );

  return content;
}
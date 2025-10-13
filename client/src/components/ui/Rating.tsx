import React from 'react';
import { cn } from '@/lib/utils';

// Custom Star SVG component with proper border support
const StarIcon = ({ fill, stroke, strokeWidth, className }: { fill: string; stroke: string; strokeWidth: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ paintOrder: 'stroke fill' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Custom Half Star SVG component with proper border support
const StarHalfIcon = ({ fill, stroke, strokeWidth, className }: { fill: string; stroke: string; strokeWidth: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ paintOrder: 'stroke fill' }}
  >
    <defs>
      <linearGradient id="half-fill">
        <stop offset="50%" stopColor={fill} />
        <stop offset="50%" stopColor="none" />
      </linearGradient>
    </defs>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half-fill)" />
  </svg>
);

interface RatingProps {
  value: number;
  count?: number;
  showCount?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'green' | 'accent';
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

  // Color configurations with proper fill and stroke for stars with borders
  // All stars (filled, half, empty) use the SAME border color for consistency
  const colorConfig = {
    amber: {
      fillColor: '#ff6b35', // Orange fill (matching your image)
      strokeColor: '#ff6b35', // Same orange border for ALL stars
      text: 'text-orange-600'
    },
    green: {
      fillColor: '#4ade80', // green-400
      strokeColor: '#4ade80', // Same green border for ALL stars
      text: 'text-green-600'
    },
    accent: {
      fillColor: '#c084fc', // purple-400
      strokeColor: '#c084fc', // Same purple border for ALL stars
      text: 'text-purple-600'
    }
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];

  const stars = [];

  // Full stars - filled with visible borders
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon
        key={`full-${i}`}
        fill={currentColor.fillColor}
        stroke={currentColor.strokeColor}
        strokeWidth={2.5}
        className={currentSize.star}
      />
    );
  }

  // Half star - filled with visible borders
  if (hasHalfStar) {
    stars.push(
      <StarHalfIcon
        key="half"
        fill={currentColor.fillColor}
        stroke={currentColor.strokeColor}
        strokeWidth={2.5}
        className={currentSize.star}
      />
    );
  }

  // Empty stars - outline only with SAME border color as filled stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarIcon
        key={`empty-${i}`}
        fill="none"
        stroke={currentColor.strokeColor}
        strokeWidth={2.5}
        className={currentSize.star}
      />
    );
  }

  const content = (
    <div className={cn(
      'flex items-center',
      currentSize.gap,
      variant === 'chip' && color === 'amber' && 'bg-amber-50 ring-1 ring-amber-100 rounded-full px-2 py-0.5',
      variant === 'chip' && color === 'green' && 'bg-emerald-50 ring-1 ring-emerald-100 rounded-full px-2 py-0.5',
      variant === 'chip' && color === 'accent' && 'bg-accent/10 ring-1 ring-accent/20 rounded-full px-2 py-0.5',
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
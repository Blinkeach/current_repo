import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import type { CarouselImage } from '@shared/schema';

const PromotionalBanners: React.FC = () => {
  const { t } = useTranslation();

  // Fetch promotional banners from carousel API
  const { data: banners = [], isLoading } = useQuery<CarouselImage[]>({
    queryKey: ['/api/carousel-images', { type: 'promotional' }],
    queryFn: async () => {
      const response = await fetch('/api/carousel-images?type=promotional', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch promotional banners');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Filter active promotional banners and sort by display order
  const activeBanners = banners
    .filter(banner => banner.isActive && banner.bannerType === 'promotional')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeBanners.map((banner, index) => {
          // Dynamic gradient colors based on index
          const gradients = [
            'from-secondary to-secondary-light',
            'from-accent to-accent-light',
            'from-primary to-primary-light',
            'from-purple-500 to-purple-600'
          ];
          const textColors = [
            'text-secondary',
            'text-accent', 
            'text-primary',
            'text-purple-600'
          ];
          
          const colorClass = gradients[index % gradients.length];
          const textClass = textColors[index % textColors.length];
          
          return (
            <div 
              key={banner.id} 
              className={`bg-gradient-to-r ${colorClass} rounded-lg overflow-hidden shadow-sm`}
            >
              <div className="flex flex-col md:flex-row items-center p-4 md:p-6">
                <div className="md:w-1/2 text-white mb-4 md:mb-0">
                  <h3 className="font-bold text-xl md:text-2xl mb-2">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-white/90 mb-3">{banner.description}</p>
                  )}
                  {banner.buttonLink && (
                    <Link href={banner.buttonLink}>
                      <Button 
                        className={`bg-white ${textClass} font-medium py-1.5 px-4 rounded hover:bg-neutral-100 transition-colors`}
                      >
                        {banner.buttonText || t('promotions.shop_now')}
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    className="w-full h-36 object-cover rounded"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PromotionalBanners;

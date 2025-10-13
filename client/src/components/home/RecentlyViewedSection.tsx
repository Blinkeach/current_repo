import React, { useRef, useEffect } from 'react';
import { Link } from 'wouter';
import ProductCard from '@/components/shop/ProductCard';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { X, ChevronRight } from 'lucide-react';

const RecentlyViewedSection: React.FC = () => {
  const { recentlyViewedProducts, clearRecentlyViewed, isLoading } = useRecentlyViewed();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll animation
  useEffect(() => {
    if (!scrollContainerRef.current || recentlyViewedProducts.length <= 4) return;
    
    const scrollContainer = scrollContainerRef.current;
    let animationFrameId: number;
    let scrollAmount = 0.5; // pixels to scroll per frame
    let isPaused = false;
    
    const autoScroll = () => {
      if (!isPaused) {
        scrollContainer.scrollLeft += scrollAmount;
        
        // Reset to beginning when reaching the end
        if (scrollContainer.scrollLeft >= 
            scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    
    // Start auto-scrolling
    animationFrameId = requestAnimationFrame(autoScroll);
    
    // Pause scrolling when mouse is over the container
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [recentlyViewedProducts.length]);

  // Don't render the section if there are no recently viewed products and not loading
  if (recentlyViewedProducts.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="relative">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Recently Viewed</h2>
          <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-1/2 h-0.5 sm:h-1 bg-secondary rounded-full"></div>
        </div>
        
        <div className="flex items-center gap-2">
          {recentlyViewedProducts.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs sm:text-sm text-gray-500 hover:text-red-500 flex items-center transition-colors duration-300" 
              onClick={clearRecentlyViewed}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
              <span className="hidden xs:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex overflow-x-auto gap-2 sm:gap-3 md:gap-4 pb-4 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="flex-shrink-0 w-36 xs:w-40 sm:w-48 md:w-56 lg:w-60 bg-white rounded-md shadow-sm p-2 sm:p-3">
              <Skeleton className="w-full aspect-square mb-2 sm:mb-3" />
              <Skeleton className="w-3/4 h-3 sm:h-4 mb-1.5 sm:mb-2" />
              <Skeleton className="w-1/2 h-3 sm:h-4 mb-1.5 sm:mb-2" />
              <Skeleton className="w-1/3 h-3 sm:h-4 mb-1.5 sm:mb-2" />
            </div>
          ))}
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2 sm:gap-3 md:gap-4 pb-4 no-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {recentlyViewedProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-36 xs:w-40 sm:w-48 md:w-56 lg:w-60">
              <Link to={`/product/${product.id}`}>
                <div className="bg-white rounded-md shadow-sm hover:shadow-lg transition-all duration-300 p-2 sm:p-3 h-full transform hover:-translate-y-1">
                  {/* Product Image */}
                  <div className="mb-2 sm:mb-3 aspect-square overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                    <img 
                      src={product.images?.[0] || '/placeholder-product.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="text-xs sm:text-sm font-medium line-clamp-2 mb-1 leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                    <span className="font-bold text-primary text-sm sm:text-base">
                      ₹{Math.round(product.price / 100)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        ₹{Math.round(product.originalPrice / 100)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentlyViewedSection;
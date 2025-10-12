import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
  stock: number;
}

interface RecommendationCarouselProps {
  title: string;
  userId?: number;
  currentProductId?: number;
  category?: string;
  maxItems?: number;
  autoPlay?: boolean;
  showAddToCart?: boolean;
}

const ProductRecommendations: React.FC<RecommendationCarouselProps> = ({
  title,
  userId,
  currentProductId,
  category,
  maxItems = 8,
  autoPlay = true,
  showAddToCart = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [visibleItems, setVisibleItems] = useState(4);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  // Responsive design - adjust visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(1);
      else if (width < 768) setVisibleItems(2);
      else if (width < 1024) setVisibleItems(3);
      else setVisibleItems(4);
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  // Page Visibility API - Pause autoplay when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Fetch personalized recommendations
  const { data: recommendations = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/recommendations', userId, currentProductId, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      if (currentProductId) params.append('currentProductId', currentProductId.toString());
      if (category) params.append('category', category);
      params.append('limit', maxItems.toString());

      const response = await fetch(`/api/recommendations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
  });

  // Reset currentIndex when recommendations change or visibleItems change
  useEffect(() => {
    setCurrentIndex(0);
    setIsAutoPlaying(autoPlay); // Re-enable autoplay when data changes
  }, [recommendations.length, visibleItems, autoPlay]);

  // Resume autoplay after user interaction stops
  useEffect(() => {
    if (!isUserInteracting || !autoPlay) return;

    const resumeTimer = setTimeout(() => {
      setIsAutoPlaying(true);
      setIsUserInteracting(false);
    }, 5000); // Resume autoplay 5 seconds after last interaction

    return () => clearTimeout(resumeTimer);
  }, [isUserInteracting, autoPlay]);

  // Auto-play functionality - Enhanced for all devices
  useEffect(() => {
    // Don't autoplay if:
    // - autoPlay is disabled
    // - user is interacting
    // - page is not visible
    // - not enough items to scroll
    if (!isAutoPlaying || isUserInteracting || !isPageVisible || recommendations.length <= visibleItems) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, recommendations.length - visibleItems);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 3500); // Smooth 3.5 second intervals

    return () => clearInterval(interval);
  }, [isAutoPlaying, isUserInteracting, isPageVisible, recommendations.length, visibleItems]);

  const handlePrevious = () => {
    setIsUserInteracting(true);
    setIsAutoPlaying(false);
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, recommendations.length - visibleItems);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const handleNext = () => {
    setIsUserInteracting(true);
    setIsAutoPlaying(false);
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, recommendations.length - visibleItems);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) {
      toast({
        title: t('notifications.out_of_stock', 'Out of Stock'),
        description: t('notifications.out_of_stock_desc', 'This product is currently unavailable'),
        variant: 'destructive',
      });
      return;
    }

    // Redirect to product details page with alert message
    toast({
      title: "Please select options",
      description: "Select color and size on the product details page",
      duration: 3000,
    });
    
    navigate(`/product/${product.id}`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Touch swipe handlers for mobile - Enhanced
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsUserInteracting(true);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse interaction handlers for desktop
  const handleMouseEnter = () => {
    setIsUserInteracting(true);
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsUserInteracting(false);
      setIsAutoPlaying(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: visibleItems }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {recommendations.length > visibleItems && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="h-8 w-8 p-0"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="h-8 w-8 p-0"
              aria-label="Next products"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div 
        className="relative overflow-hidden w-full touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'grab' }}
        onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
        onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
      >
        <div 
          className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-in-out will-change-transform"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            width: `${(recommendations.length / visibleItems) * 100}%`,
          }}
        >
          {recommendations.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 px-1"
              style={{ width: `${100 / recommendations.length}%` }}
            >
                <Card
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full"
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <span className="text-white font-medium">
                            {t('product.out_of_stock', 'Out of Stock')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-green-500 text-green-500'
                                  : 'text-green-500'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900">
                          ₹{(product.price / 100).toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice !== product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {showAddToCart && (
                        <Button
                          size="sm"
                          className="w-full mt-3"
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock
                            ? t('product.add_to_cart', 'Add to Cart')
                            : t('product.out_of_stock', 'Out of Stock')
                          }
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>
      </div>

      {/* Dots indicator for mobile */}
      {recommendations.length > visibleItems && (
        <div className="flex justify-center gap-2 md:hidden">
          {Array.from({ 
            length: Math.ceil(recommendations.length / visibleItems) 
          }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / visibleItems) === index
                  ? 'bg-primary'
                  : 'bg-gray-300'
              }`}
              onClick={() => {
                setIsUserInteracting(true);
                setIsAutoPlaying(false);
                setCurrentIndex(index * visibleItems);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;
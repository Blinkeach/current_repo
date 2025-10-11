import React, { useState, memo } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WishlistButton } from '@/components/ui/wishlist-button';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import ShareModal from './ShareModal';
import { Rating } from '@/components/ui/Rating';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  adminReviewCount?: number;
  discount?: number; // If manually provided, will use this instead of calculating
  badge?: {
    text: string;
    color: string;
  };
  stock?: number; // Added stock property
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  adminReviewCount = 0,
  discount: providedDiscount,
  badge,
  stock = 0
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Calculate discount percentage if original price is provided and no discount was explicitly given
  const calculateDiscount = (): number | undefined => {
    if (!originalPrice || originalPrice <= price) return undefined;
    
    // Calculate discount percentage: (originalPrice - price) / originalPrice * 100
    const discountPercentage = Math.round((originalPrice - price) / originalPrice * 100);
    return discountPercentage > 0 ? discountPercentage : undefined;
  };
  
  // Use provided discount or calculate it
  const discount = providedDiscount || calculateDiscount();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Redirect to product details page with alert message
    toast({
      title: "Please select options",
      description: "Select color and size on the product details page",
      duration: 3000,
    });
    
    setLocation(`/product/${id}`);
  };


  return (
    <Link href={`/product/${id}`}>
      <div className="block cursor-pointer h-full gpu-accelerated">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-3 sm:p-4 group h-full flex flex-col hover-lift border border-gray-100">
          <div className="relative mb-3">
            {(discount || badge) && (
              <span 
                className={`absolute top-0 left-0 ${badge?.color || 'bg-primary'} text-white text-xs sm:text-sm px-2 py-1 rounded-br-lg font-semibold z-10 shadow-md animate-fade-in`}
              >
                {badge?.text || `-${discount}%`}
              </span>
            )}
            <div className="w-full h-36 sm:h-40 md:h-44 lg:h-48 relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Just hide the broken image and let CSS handle the fallback
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {/* Fallback div that shows when image fails to load */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-sm absolute inset-0 -z-10">
                Product Image
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
              <WishlistButton productId={id} size="sm" />
            </div>
          </div>
          
          {/* Content section with flex-grow to push buttons to bottom */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2 min-h-[2.5rem] sm:min-h-[3rem] leading-tight text-gray-800 group-hover:text-primary transition-colors">{name}</h3>
            
            <div className="flex items-center mb-2 text-xs sm:text-sm flex-wrap gap-1">
              <Rating 
                value={rating} 
                showCount={false}
                size="sm"
                color="accent"
              />
              <span className="text-neutral-500 ml-1 truncate">
                ({reviewCount + adminReviewCount})
                {reviewCount === 0 && adminReviewCount > 0 && <span className="hidden lg:inline text-xs"> (Admin rating)</span>}
              </span>
              <span className="mx-1 text-neutral-300 hidden xs:inline">|</span>
              {stock === 0 ? (
                <span className="text-primary whitespace-nowrap font-semibold">Out of Stock</span>
              ) : stock <= 5 ? (
                <span className="text-accent whitespace-nowrap font-bold animate-pulse">
                  🔥 Only {stock} left
                </span>
              ) : stock <= 10 ? (
                <span className="text-accent whitespace-nowrap font-semibold">
                  ⚡ Almost Gone!
                </span>
              ) : (
                <span className="text-green-600 whitespace-nowrap font-medium">In Stock</span>
              )}
            </div>
            
            {/* Price section with flex-grow to push buttons to bottom */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="mb-3">
                <div className="flex items-end flex-wrap gap-1 sm:gap-2">
                  <span className="font-bold text-lg sm:text-xl text-primary">₹{(price/100).toLocaleString('en-IN')}</span>
                  {originalPrice && originalPrice > price && (
                    <>
                      <span className="line-through text-neutral-400 text-sm sm:text-base">
                        ₹{(originalPrice/100).toLocaleString('en-IN')}
                      </span>
                      {discount && discount > 0 && (
                        <span className="text-accent text-xs sm:text-sm font-bold bg-accent/10 px-2 py-0.5 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Buttons always at the bottom */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 h-9 sm:h-10 btn-glow shadow-md hover:shadow-lg active:scale-95"
                  disabled={stock === 0}
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Add to Cart</span>
                  <span className="xs:hidden">Add</span>
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShareModalOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="px-2 sm:px-3 h-9 sm:h-10 flex-shrink-0 border-2 border-secondary hover:bg-secondary hover:text-white transition-all duration-300 active:scale-95"
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        productName={name}
        productUrl={`${window.location.origin}/product/${id}`}
        productImage={image}
        productPrice={price}
        productId={id}
      />
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

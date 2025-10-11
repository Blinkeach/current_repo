import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';

const WishlistPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();

  // Redirect if not authenticated
  useEffect(() => {
    if (user === null) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your wishlist",
        variant: "destructive",
      });
      setLocation('/auth?redirect=/wishlist');
    }
  }, [user, toast, setLocation]);

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (productId: number, productName: string, productPrice: number, productImage: string) => {
    addToCart(productId, 1, productName, productPrice, productImage);
    
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart`,
    });
  };

  // Don't render content until authentication check is complete
  if (user === undefined) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading...</div>;
  }

  // If not authenticated, we'll redirect (handled in the useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <Helmet>
        <title>My Wishlist - Blinkeach</title>
        <meta name="description" content="View and manage your Blinkeach wishlist" />
      </Helmet>

      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-1 text-xs sm:text-sm">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">My Wishlist</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <p>Loading your wishlist...</p>
          </div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="bg-muted inline-flex p-6 rounded-full mb-2">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Save items you're interested in by clicking the heart icon on product pages
          </p>
          <Button className="mt-4" asChild>
            <Link to="/">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                {item.product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% OFF
                  </div>
                )}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      ₹{(item.product.price / 100).toLocaleString('en-IN')}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{(item.product.originalPrice / 100).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {item.product.stock === 0 ? (
                    <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                  ) : item.product.stock <= 5 ? (
                    <span className="text-orange-600 text-sm font-bold animate-pulse">
                      🔥 Hurry! Only {item.product.stock} left
                    </span>
                  ) : item.product.stock <= 10 ? (
                    <span className="text-orange-500 text-sm font-semibold">
                      ⚡ Almost Gone!
                    </span>
                  ) : (
                    <span className="text-green-600 text-sm">In Stock</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(item.productId, item.product.name, item.product.price, item.product.images[0])}
                  disabled={item.product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
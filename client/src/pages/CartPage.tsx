import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/lib/cart';

const CartPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();

  return (
    <>
      <Helmet>
        <title>Your Shopping Cart - Blinkeach</title>
        <meta name="description" content="Review the items in your shopping cart and proceed to checkout." />
      </Helmet>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800">Your Shopping Cart</h1>
          <Link href="/shop">
            <a className="text-secondary hover:underline flex items-center text-xs sm:text-sm mt-2">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Continue Shopping
            </a>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Link href="/shop">
                  <Button className="bg-secondary hover:bg-secondary-dark text-white text-sm sm:text-base">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center border-b pb-3 sm:pb-4 gap-2">
                  <h2 className="text-sm sm:text-base font-semibold">
                    Cart Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 text-xs sm:text-sm"
                  >
                    Clear Cart
                  </Button>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Responsive */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-80 lg:flex-shrink-0">
              <CartSummary />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;

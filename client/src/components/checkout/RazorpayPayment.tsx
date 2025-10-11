import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart';
import { createRazorpayOrder, initiateRazorpayPayment, verifyPayment } from '@/lib/razorpay';
import { useLocation } from 'wouter';

interface RazorpayPaymentProps {
  orderDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    specialInstructions?: string;
  };
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ orderDetails }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check if this is a Buy Now order
  const savedBuyNowItem = sessionStorage.getItem('buyNowItem');
  const isBuyNow = !!savedBuyNowItem;
  const buyNowItem = savedBuyNowItem ? JSON.parse(savedBuyNowItem) : null;

  // Calculate amounts correctly (no GST)
  let subtotal = 0;
  let effectiveCartItems = cartItems;

  if (isBuyNow && buyNowItem) {
    // For Buy Now: use the single item from sessionStorage
    const itemPrice = buyNowItem.product?.price || buyNowItem.price || 0;
    subtotal = (itemPrice * buyNowItem.quantity) / 100; // Convert from paisa to rupees
    effectiveCartItems = [{
      id: buyNowItem.id,
      productId: buyNowItem.productId,
      quantity: buyNowItem.quantity,
      product: buyNowItem.product
    }];
  } else {
    // For regular cart: use cart total
    subtotal = totalPrice / 100; // Convert from paisa to rupees
  }

  const deliveryCharge = 40;
  const universalDiscount = 40; // Universal ₹40 discount
  const total = subtotal + deliveryCharge - universalDiscount;
  const totalInPaisa = Math.round(total * 100); // Convert back to paisa for Razorpay
  
  console.log('Payment calculation:', {
    isBuyNow,
    buyNowItem,
    totalPrice,
    subtotal,
    deliveryCharge,
    universalDiscount,
    total,
    totalInPaisa
  });

  useEffect(() => {
    const initializePayment = async () => {
      try {
        console.log('Starting payment initialization...');
        
        // Razorpay minimum amount validation (₹1.00 = 100 paisa)
        const RAZORPAY_MIN_AMOUNT = 100; // 100 paisa = ₹1.00
        if (totalInPaisa < RAZORPAY_MIN_AMOUNT) {
          toast({
            title: "Order Amount Too Low",
            description: `Minimum order amount for online payment is ₹${(RAZORPAY_MIN_AMOUNT / 100).toFixed(2)}. Your current total is ₹${(totalInPaisa / 100).toFixed(2)}. Please add more items or use Cash on Delivery.`,
            variant: "destructive",
          });
          setLocation('/checkout');
          return;
        }
        
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          throw new Error('Razorpay script not loaded. Please refresh the page.');
        }

        // Prepare address string
        const fullAddress = `${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`;

        console.log('Creating order with backend...');
        // Create order in backend with correct amount in paisa
        const orderData = await createRazorpayOrder({
          amount: totalInPaisa,
          currency: 'INR',
          userEmail: orderDetails.email,
          userPhone: orderDetails.phone,
          userName: orderDetails.name,
          userId: 1, // Use actual logged-in user ID
          totalAmount: totalInPaisa,
          shippingAddress: fullAddress,
          paymentMethod: 'razorpay',
          specialInstructions: orderDetails.specialInstructions || '',
          items: effectiveCartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.discountedPrice || item.product.price,
            quantity: item.quantity
          }))
        });

        // Initialize Razorpay with live credentials from backend response
        initiateRazorpayPayment({
          key: orderData.key || 'rzp_live_R6geaHp283s445', // Live key from backend or fallback
          amount: orderData.amount || totalInPaisa, // Amount in paisa from backend
          currency: orderData.currency || 'INR',
          name: 'Blinkeach',
          description: `Order payment for ${effectiveCartItems.length} items`,
          order_id: orderData.id,
          prefill: {
            name: orderDetails.name,
            email: orderDetails.email,
            contact: orderDetails.phone
          },
          notes: {
            address: fullAddress
          },
          theme: {
            color: '#1F51A9'
          },
          handler: async function(response: any) {
            try {
              // Verify payment with backend
              const verification = await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId
              });

              if (verification.success) {
                toast({
                  title: "Payment Successful",
                  description: "Your order has been placed successfully!",
                  duration: 5000
                });
                
                // Clear cart and redirect to order confirmation
                clearCart();
                setLocation('/order-confirmation?orderId=' + response.razorpay_order_id + '&paymentMethod=razorpay');
              } else {
                toast({
                  title: "Payment Verification Failed",
                  description: verification.message || "There was an issue verifying your payment.",
                  variant: "destructive"
                });
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: "Payment Error",
                description: "There was an error processing your payment. Please try again.",
                variant: "destructive"
              });
            }
          }
        });
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        toast({
          title: "Payment Error", 
          description: `Failed to initialize payment: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          variant: "destructive"
        });
      }
    };

    initializePayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-sm min-h-[400px]">
      {/* Live Mode Notice */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center text-green-800">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          <span className="text-xs sm:text-sm font-medium">Live Payment Mode</span>
        </div>
        <p className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1 leading-tight">
          Real payment gateway - secure checkout with live transaction processing
        </p>
      </div>

      {/* Razorpay Discount Notice */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-3 sm:mb-4 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center text-blue-800">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
          </svg>
          <span className="text-xs sm:text-sm font-medium">Razorpay Payment Discount</span>
        </div>
        <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5 sm:mt-1 leading-tight">
          Get 1% discount on orders below ₹1,000 and 5% discount on orders ₹1,000 and above
        </p>
      </div>
      
      {/* Loading Animation */}
      <div className="animate-pulse flex flex-col items-center mb-4 sm:mb-6 py-2 sm:py-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-secondary rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-center px-2">Initializing Payment...</h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2 text-center px-3 sm:px-4 max-w-xs sm:max-w-sm leading-tight">
          Please wait while we redirect you to the payment gateway.
          Do not refresh or close this page.
        </p>
      </div>
      
      {/* Payment Summary */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-3 sm:p-4 border border-neutral-200 rounded-md bg-neutral-50">
        <p className="text-[10px] sm:text-xs font-medium text-neutral-600 mb-2 sm:mb-3">Payment Summary:</p>
        
        {/* Subtotal */}
        <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5 sm:mb-2">
          <span className="text-neutral-700">Subtotal:</span>
          <span className="font-medium text-neutral-900">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Charge */}
        <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5 sm:mb-2">
          <span className="text-neutral-700">Delivery Charge:</span>
          <span className="font-medium text-neutral-900">₹{deliveryCharge.toFixed(2)}</span>
        </div>
        
        {/* Universal Discount */}
        <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5 sm:mb-2 text-green-600">
          <span className="flex items-center">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
            </svg>
            Universal Discount:
          </span>
          <span className="font-medium">-₹{universalDiscount.toFixed(2)}</span>
        </div>
        
        {/* Razorpay Discount */}
        <div className="flex justify-between items-center text-xs sm:text-sm mb-2 sm:mb-3 text-blue-600">
          <span className="flex items-center">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <span className="truncate">Razorpay ({total >= 1000 ? '5%' : '1%'}):</span>
          </span>
          <span className="font-medium whitespace-nowrap ml-2">-₹{total >= 1000 ? (total * 0.05).toFixed(2) : (total * 0.01).toFixed(2)}</span>
        </div>
        
        {/* Divider */}
        <div className="border-t border-neutral-300 my-2 sm:my-3"></div>
        
        {/* Total Before Discount */}
        <div className="flex justify-between items-center text-xs sm:text-sm mb-2 sm:mb-3">
          <span className="font-semibold text-neutral-700">Total:</span>
          <span className="font-semibold text-neutral-900">₹{total.toFixed(2)}</span>
        </div>
        
        {/* Divider */}
        <div className="border-t-2 border-green-200 my-2 sm:my-3"></div>
        
        {/* Final Amount to Pay */}
        <div className="flex justify-between items-center text-sm sm:text-base md:text-lg bg-green-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 sm:py-3 rounded-b-md">
          <span className="font-bold text-green-700 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-xs sm:text-sm md:text-base">You Pay:</span>
          </span>
          <span className="font-bold text-green-700 text-base sm:text-lg md:text-xl">
            ₹{total >= 1000 ? (total * 0.95).toFixed(2) : (total * 0.99).toFixed(2)}
          </span>
        </div>
        
        {/* Savings Badge */}
        <div className="mt-2 sm:mt-3 text-center">
          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
            </svg>
            You save ₹{(total >= 1000 ? (total * 0.05) : (total * 0.01) + universalDiscount).toFixed(2)} on this order!
          </span>
        </div>
      </div>
      
      {/* Security Notice */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-3 sm:mt-4 p-2 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex items-start sm:items-center text-gray-600">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
          </svg>
          <p className="text-[10px] sm:text-xs leading-tight">
            <span className="font-medium">Secure Payment:</span> Your transaction is protected by 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;

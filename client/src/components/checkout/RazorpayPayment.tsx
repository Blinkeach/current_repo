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
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
      {/* Live Mode Notice */}
      <div className="w-full max-w-md mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center text-green-800">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          <span className="text-sm font-medium">Live Payment Mode</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Real payment gateway - secure checkout with live transaction processing
        </p>
      </div>

      {/* Razorpay Discount Notice */}
      <div className="w-full max-w-md mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center text-blue-800">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
          </svg>
          <span className="text-sm font-medium">Razorpay Payment Discount</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Get 1% discount on orders below ₹1,000 and 5% discount on orders ₹1,000 and above
        </p>
      </div>
      
      <div className="animate-pulse flex flex-col items-center mb-4">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">Initializing Payment...</h2>
        <p className="text-sm text-neutral-500 mt-2 text-center">
          Please wait while we redirect you to the payment gateway.
          Do not refresh or close this page.
        </p>
      </div>
      
      <div className="w-full max-w-md p-4 border border-neutral-200 rounded-md bg-neutral-50">
        <p className="text-xs text-neutral-600 mb-2">Payment Summary:</p>
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span>Delivery Charge:</span>
          <span>₹{deliveryCharge.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm mb-1 text-green-600">
          <span>Universal Discount:</span>
          <span>-₹{universalDiscount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm mb-1 text-blue-600">
          <span>Razorpay Discount ({total >= 1000 ? '5%' : '1%'}):</span>
          <span>-₹{total >= 1000 ? (total * 0.05).toFixed(2) : (total * 0.01).toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-semibold text-sm border-t pt-1 mt-1">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2 text-green-600">
          <span>You Pay (After Razorpay Discount):</span>
          <span>₹{total >= 1000 ? (total * 0.95).toFixed(2) : (total * 0.99).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;

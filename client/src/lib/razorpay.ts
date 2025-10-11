import { apiRequest } from './queryClient';

export interface OrderDetails {
  amount: number;
  currency: string;
  userEmail: string;
  userPhone: string;
  userName: string;
  userId: number;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  specialInstructions?: string;
  items: Array<{
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export async function createRazorpayOrder(orderDetails: OrderDetails): Promise<{ 
  id: string; 
  amount: number; 
  currency: string; 
  key: string; 
  orderId: number; 
}> {
  console.log('\n💳 [CLIENT] ========== CREATING RAZORPAY ORDER ==========');
  console.log('⏰ [CLIENT] Timestamp:', new Date().toISOString());
  console.log('📦 [CLIENT] Order Details:');
  console.log('   - User ID:', orderDetails.userId);
  console.log('   - User Name:', orderDetails.userName);
  console.log('   - Total Amount (paisa):', orderDetails.totalAmount);
  console.log('   - Currency:', orderDetails.currency);
  console.log('   - Items Count:', orderDetails.items.length);
  
  try {
    console.log('🌐 [CLIENT] Sending request to server...');
    const response = await apiRequest('POST', '/api/payment/create-order', orderDetails);
    const data = await response.json();
    
    console.log('✅ [CLIENT] Order created successfully!');
    console.log('   - Razorpay Order ID:', data.id);
    console.log('   - Internal Order ID:', data.orderId);
    console.log('   - Amount:', data.amount);
    console.log('   - Currency:', data.currency);
    console.log('   - Key ID:', data.key?.substring(0, 15) + '...');
    console.log('💳 [CLIENT] ========================================\n');
    
    return data;
  } catch (error) {
    console.error('\n❌ [CLIENT] Error creating Razorpay order:', error);
    console.error('❌ [CLIENT] ========================================\n');
    throw new Error('Failed to create payment order');
  }
}

export async function verifyPayment(paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  orderId: string | number;
}): Promise<{ success: boolean; message: string }> {
  console.log('\n🔐 [CLIENT] ========== VERIFYING PAYMENT ==========');
  console.log('⏰ [CLIENT] Timestamp:', new Date().toISOString());
  console.log('📥 [CLIENT] Payment Data:');
  console.log('   - Payment ID:', paymentData.razorpay_payment_id);
  console.log('   - Order ID:', paymentData.razorpay_order_id);
  console.log('   - Signature:', paymentData.razorpay_signature?.substring(0, 20) + '...');
  console.log('   - Internal Order ID:', paymentData.orderId);
  
  try {
    console.log('🌐 [CLIENT] Sending verification request to server...');
    const response = await apiRequest('POST', '/api/payment/verify', paymentData);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ [CLIENT] Payment verified successfully!');
      console.log('   - Message:', data.message);
    } else {
      console.error('❌ [CLIENT] Payment verification failed!');
      console.error('   - Message:', data.message);
    }
    console.log('🔐 [CLIENT] ========================================\n');
    
    return data;
  } catch (error) {
    console.error('\n❌ [CLIENT] Error verifying payment:', error);
    console.error('❌ [CLIENT] ========================================\n');
    throw new Error('Failed to verify payment');
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function initiateRazorpayPayment(options: RazorpayOptions): void {
  console.log('\n🚀 [CLIENT] ========== INITIATING RAZORPAY PAYMENT ==========');
  console.log('⏰ [CLIENT] Timestamp:', new Date().toISOString());
  console.log('📋 [CLIENT] Payment Options:');
  console.log('   - Key:', options.key?.substring(0, 15) + '...');
  console.log('   - Amount:', options.amount);
  console.log('   - Currency:', options.currency);
  console.log('   - Order ID:', options.order_id);
  console.log('   - Name:', options.name);
  console.log('   - Description:', options.description);
  console.log('   - Prefill Name:', options.prefill.name);
  console.log('   - Prefill Email:', options.prefill.email);
  console.log('   - Prefill Contact:', options.prefill.contact);
  
  if (!window.Razorpay) {
    console.error('❌ [CLIENT] Razorpay script not loaded!');
    console.error('Make sure Razorpay SDK is included in your HTML');
    throw new Error('Razorpay script not loaded');
  }
  
  console.log('✅ [CLIENT] Razorpay SDK loaded successfully');
  
  try {
    console.log('🔧 [CLIENT] Creating Razorpay instance...');
    const razorpay = new window.Razorpay({
      ...options,
      modal: {
        ondismiss: function() {
          console.log('⚠️ [CLIENT] Razorpay payment modal dismissed by user');
        }
      }
    });
    
    console.log('✅ [CLIENT] Razorpay instance created successfully');
    console.log('🎯 [CLIENT] Opening Razorpay payment modal...');
    razorpay.open();
    console.log('✅ [CLIENT] Payment modal opened successfully');
    console.log('🚀 [CLIENT] ========================================\n');
  } catch (error) {
    console.error('\n❌ [CLIENT] Error initializing Razorpay:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ [CLIENT] ========================================\n');
    throw error;
  }
}

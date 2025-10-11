// Test Razorpay Authentication
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔐 Testing Razorpay Authentication...\n');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

console.log('📋 Credentials Loaded:');
console.log('   - Key ID:', RAZORPAY_KEY_ID);
console.log('   - Key Secret:', RAZORPAY_KEY_SECRET ? '***' + RAZORPAY_KEY_SECRET.slice(-4) : 'NOT SET');
console.log('   - Key ID Length:', RAZORPAY_KEY_ID?.length);
console.log('   - Key Secret Length:', RAZORPAY_KEY_SECRET?.length);
console.log('   - Mode:', RAZORPAY_KEY_ID?.startsWith('rzp_live') ? 'LIVE' : 'TEST');
console.log('');

// Check for whitespace
if (RAZORPAY_KEY_ID !== RAZORPAY_KEY_ID?.trim()) {
  console.log('⚠️  WARNING: Key ID has leading/trailing whitespace!');
}
if (RAZORPAY_KEY_SECRET !== RAZORPAY_KEY_SECRET?.trim()) {
  console.log('⚠️  WARNING: Key Secret has leading/trailing whitespace!');
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID?.trim(),
  key_secret: RAZORPAY_KEY_SECRET?.trim(),
});

console.log('🌐 Testing Razorpay API Connection...\n');

// Try to create a test order
async function testRazorpayAuth() {
  try {
    console.log('📦 Creating test order...');
    const order = await razorpay.orders.create({
      amount: 100, // ₹1 in paisa
      currency: 'INR',
      receipt: 'test_receipt_' + Date.now(),
      notes: {
        test: 'authentication_test'
      }
    });

    console.log('✅ SUCCESS! Razorpay authentication is working!');
    console.log('   - Order ID:', order.id);
    console.log('   - Amount:', order.amount);
    console.log('   - Currency:', order.currency);
    console.log('   - Status:', order.status);
    console.log('\n🎉 Your Razorpay credentials are valid and working!\n');
    
  } catch (error) {
    console.log('❌ FAILED! Razorpay authentication error:');
    console.log('   - Status Code:', error.statusCode);
    console.log('   - Error:', JSON.stringify(error.error, null, 2));
    console.log('\n🔍 Possible Issues:');
    console.log('   1. Invalid Key ID or Key Secret');
    console.log('   2. Razorpay account not activated for live mode');
    console.log('   3. API keys might be revoked or expired');
    console.log('   4. Account might have restrictions');
    console.log('\n💡 Solutions:');
    console.log('   1. Verify credentials in Razorpay Dashboard');
    console.log('   2. Check if live mode is activated');
    console.log('   3. Generate new API keys if needed');
    console.log('   4. Contact Razorpay support if issue persists\n');
  }
}

testRazorpayAuth();
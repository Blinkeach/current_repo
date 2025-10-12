const API_BASE = 'http://localhost:5000';
const TRACKING_ID = '39423010000033';

async function testTrackingAPI() {
  console.log('🧪 Testing Order Tracking API\n');
  
  try {
    console.log(`📡 Fetching order with tracking ID: ${TRACKING_ID}`);
    const response = await fetch(`${API_BASE}/api/orders/${TRACKING_ID}`);
    
    console.log(`📊 Response status: ${response.status}\n`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Order found successfully!\n');
      console.log('Order Details:');
      console.log('─────────────────────────────────────');
      console.log(`Order ID: ${data.id}`);
      console.log(`Status: ${data.status}`);
      console.log(`Tracking ID: ${data.trackingId}`);
      console.log(`Total Amount: ₹${(data.totalAmount / 100).toFixed(2)}`);
      console.log(`Payment Method: ${data.paymentMethod}`);
      console.log(`Created: ${new Date(data.createdAt).toLocaleString()}`);
      console.log('─────────────────────────────────────\n');
      
      if (data.items && data.items.length > 0) {
        console.log('📦 Order Items:');
        data.items.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name} - Qty: ${item.quantity} - ₹${(item.price / 100).toFixed(2)}`);
        });
      }
      
      console.log('\n✅ Test PASSED! Order tracking is working correctly.');
    } else {
      const error = await response.json();
      console.log('❌ Test FAILED!');
      console.log(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('❌ Test FAILED with exception:');
    console.error(error.message);
  }
}

// Wait a bit for server to start
console.log('⏳ Waiting for server to start...\n');
setTimeout(testTrackingAPI, 3000);
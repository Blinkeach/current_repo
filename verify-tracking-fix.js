/**
 * Quick verification script for order tracking fix
 * Run this after restarting the server
 */

const http = require('http');

const testTrackingId = '39423010000033';
const testOrderId = '5';

console.log('🔍 Verifying Order Tracking Fix\n');
console.log('=' .repeat(50));

function testEndpoint(id, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/orders/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log(`\n📡 Testing: ${description}`);
    console.log(`   URL: http://localhost:5000/api/orders/${id}`);

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const order = JSON.parse(data);
            console.log(`   ✅ SUCCESS!`);
            console.log(`   Order ID: ${order.id}`);
            console.log(`   Tracking ID: ${order.trackingId}`);
            console.log(`   Status: ${order.status}`);
            console.log(`   Total: ₹${order.totalAmount}`);
            resolve({ success: true, order });
          } catch (e) {
            console.log(`   ❌ FAILED: Invalid JSON response`);
            resolve({ success: false, error: 'Invalid JSON' });
          }
        } else if (res.statusCode === 401) {
          console.log(`   ❌ FAILED: Still requires authentication!`);
          console.log(`   → Server needs to be restarted`);
          resolve({ success: false, error: 'Authentication required' });
        } else if (res.statusCode === 404) {
          console.log(`   ❌ FAILED: Order not found`);
          resolve({ success: false, error: 'Not found' });
        } else {
          console.log(`   ❌ FAILED: Unexpected status code`);
          console.log(`   Response: ${data}`);
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ FAILED: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   → Server is not running. Start it with: npm run dev`);
      }
      resolve({ success: false, error: error.message });
    });

    req.end();
  });
}

async function runTests() {
  // Wait a moment for server to be ready
  console.log('\n⏳ Checking if server is running...\n');
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 1: Track by Order ID
  const test1 = await testEndpoint(testOrderId, 'Track by Order ID');
  
  // Test 2: Track by Tracking ID
  const test2 = await testEndpoint(testTrackingId, 'Track by Tracking ID (Delhivery)');

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 TEST SUMMARY\n');
  
  const allPassed = test1.success && test2.success;
  
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('\n🎉 Order tracking is working correctly!');
    console.log('   - Customers can track orders without logging in');
    console.log('   - Both Order ID and Tracking ID work');
    console.log('\n💡 Next steps:');
    console.log('   1. Test in your browser: http://localhost:5173/tracking');
    console.log('   2. Enter tracking ID: 39423010000033');
    console.log('   3. Verify order details are displayed');
  } else {
    console.log('❌ SOME TESTS FAILED\n');
    
    if (!test1.success && test1.error === 'Authentication required') {
      console.log('⚠️  The server needs to be restarted to apply the route changes!');
      console.log('\n📝 Steps to fix:');
      console.log('   1. Stop the server (Ctrl+C in the terminal running npm run dev)');
      console.log('   2. Restart: npm run dev');
      console.log('   3. Run this script again: node verify-tracking-fix.js');
    } else if (!test1.success && test1.error.includes('ECONNREFUSED')) {
      console.log('⚠️  The server is not running!');
      console.log('\n📝 Steps to fix:');
      console.log('   1. Start the server: npm run dev');
      console.log('   2. Run this script again: node verify-tracking-fix.js');
    } else {
      console.log('⚠️  Unexpected error occurred');
      console.log('   Check the server logs for more details');
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
}

runTests();
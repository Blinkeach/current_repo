/**
 * Delhivery API Test Script
 * 
 * This script tests the Delhivery API connection and helps identify issues.
 * Run with: node test-delhivery-api.js
 */

import dotenv from 'dotenv';
dotenv.config();

const DELHIVERY_API_KEY = process.env.DELHIVERY_API_KEY;
const DELHIVERY_BASE_URL = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com/api';
const DELHIVERY_CLIENT_NAME = process.env.DELHIVERY_CLIENT_NAME || 'BLINK EACH';
const DELHIVERY_PICKUP_LOCATION = process.env.DELHIVERY_PICKUP_LOCATION || 'Blink Each';
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || 'WARD NO. 07, KB LANE, NEAR CHAURAHA MASJID, PANCHAYATI AKHARA, GAYA (BIHAR) 823001';

console.log('\n🧪 ========== DELHIVERY API TEST ==========');
console.log('⏰ Timestamp:', new Date().toISOString());
console.log('\n📋 Configuration:');
console.log('   - API Key:', DELHIVERY_API_KEY ? '***' + DELHIVERY_API_KEY.substring(DELHIVERY_API_KEY.length - 8) : 'NOT SET');
console.log('   - Base URL:', DELHIVERY_BASE_URL);
console.log('   - Client Name:', DELHIVERY_CLIENT_NAME);
console.log('   - Pickup Location:', DELHIVERY_PICKUP_LOCATION);
console.log('   - Seller Address:', COMPANY_ADDRESS);

if (!DELHIVERY_API_KEY) {
  console.error('\n❌ ERROR: DELHIVERY_API_KEY is not set in .env file');
  process.exit(1);
}

// Test shipment data (following official Delhivery API format)
const testShipmentData = {
  pickup_location: {
    name: DELHIVERY_PICKUP_LOCATION
  },
  shipments: [{
    name: 'Test User',
    add: 'Test Address, Begumpet',
    pin: '500016',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    phone: '8709144545',
    order: 'TEST-' + Date.now(),
    products_desc: 'Test Product x 1',
    payment_mode: 'COD',
    cod_amount: '100.00',
    order_date: new Date().toISOString().split('T')[0],
    total_amount: '100.00',
    seller_add: COMPANY_ADDRESS,
    seller_name: DELHIVERY_CLIENT_NAME,
    seller_inv: 'INV-TEST-' + Date.now(),
    quantity: '1',
    waybill: '',
    shipment_width: '10',
    shipment_height: '10',
    shipment_length: '10',
    weight: '1',
    seller_gst_tin: '',
    shipping_mode: 'Surface',
    address_type: 'home'
  }]
};

console.log('\n📦 Test Shipment Data:');
console.log(JSON.stringify(testShipmentData, null, 2));

// Create form data
const formData = new URLSearchParams();
formData.append('format', 'json');
formData.append('data', JSON.stringify(testShipmentData));

console.log('\n🌐 Sending request to Delhivery API...');
console.log('   - URL:', DELHIVERY_BASE_URL + '/cmu/create.json');
console.log('   - Method: POST');
console.log('   - Content-Type: application/x-www-form-urlencoded');

// Make the API request
fetch(DELHIVERY_BASE_URL + '/cmu/create.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Token ${DELHIVERY_API_KEY}`,
    'Accept': 'application/json'
  },
  body: formData.toString()
})
  .then(response => {
    console.log('\n📡 Response Received:');
    console.log('   - Status Code:', response.status);
    console.log('   - Status Text:', response.statusText);
    return response.json();
  })
  .then(data => {
    console.log('\n📦 Response Data:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ ========== TEST SUCCESSFUL ==========');
      console.log('   - Waybill:', data.packages?.[0]?.waybill || data.upload_wbn);
      console.log('   - Status:', data.packages?.[0]?.status || 'Success');
      console.log('\n🎉 Your Delhivery API is working correctly!');
      console.log('📮 =======================================\n');
    } else {
      console.error('\n❌ ========== TEST FAILED ==========');
      console.error('   - Success:', data.success);
      console.error('   - Error:', data.error);
      console.error('   - Message:', data.message || data.rmk || 'Unknown error');
      console.error('   - Package Count:', data.package_count);

      if (data.rmk && data.rmk.includes('no data')) {
        console.error('\n⚠️ DIAGNOSIS: "shipment list contains no data"');
        console.error('\n🔍 Most Common Causes:');
        console.error('   1. Pickup location name mismatch');
        console.error('      Current: "' + DELHIVERY_PICKUP_LOCATION + '"');
        console.error('      → Check Delhivery dashboard for exact name (case-sensitive)');
        console.error('');
        console.error('   2. Client name mismatch');
        console.error('      Current: "' + DELHIVERY_CLIENT_NAME + '"');
        console.error('      → Verify in Delhivery dashboard');
        console.error('');
        console.error('   3. API key permissions');
        console.error('      → Check if API key has "Create Shipment" permission');
        console.error('');
        console.error('   4. Account not activated for API');
        console.error('      → Contact Delhivery support to activate API access');
        console.error('');
        console.error('💡 SOLUTIONS:');
        console.error('   A. Log in to Delhivery dashboard');
        console.error('   B. Go to Settings → Warehouses');
        console.error('   C. Copy the EXACT warehouse name');
        console.error('   D. Update DELHIVERY_PICKUP_LOCATION in .env file');
        console.error('   E. Run this test again');
        console.error('');
        console.error('   OR');
        console.error('');
        console.error('   Contact Delhivery Support:');
        console.error('   - Email: support@delhivery.com');
        console.error('   - Phone: +91-11-46155555');
        console.error('   - Provide them with:');
        console.error('     * Client Name: ' + DELHIVERY_CLIENT_NAME);
        console.error('     * API Key (last 8 digits): ' + DELHIVERY_API_KEY.substring(DELHIVERY_API_KEY.length - 8));
        console.error('     * This error message');
      }

      console.error('\n📮 ====================================\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ ========== REQUEST FAILED ==========');
    console.error('Error:', error.message);
    console.error('\n🔍 Possible Causes:');
    console.error('   1. Network connection issue');
    console.error('   2. Invalid API URL');
    console.error('   3. Firewall blocking the request');
    console.error('\n📮 =======================================\n');
    process.exit(1);
  });
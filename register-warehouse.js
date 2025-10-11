/**
 * Delhivery Warehouse Registration Script
 * 
 * This script directly registers your warehouse with Delhivery API
 * Run this script to register your pickup location before creating shipments
 * 
 * Usage: node register-warehouse.js
 */

import 'dotenv/config';
import fetch from 'node-fetch';

// Warehouse details from your .env file
const warehouseData = {
  name: 'BLINK EACH GAYA',
  address: 'WARD NO. 07, KB LANE, NEAR CHAURAHA MASJID, PANCHAYATI AKHARA',
  city: 'GAYA',
  state: 'BIHAR',
  pincode: '823001',
  contactPerson: 'Blinkeach Admin', // Change this to your name
  contactPhone: process.env.COMPANY_PHONE || '8709144545',
  contactEmail: process.env.COMPANY_EMAIL || 'info@blinkeach.com'
};

// Delhivery API configuration
const DELHIVERY_API_KEY = process.env.DELHIVERY_API_KEY;
const DELHIVERY_BASE_URL = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com/api';

console.log('\n🏭 ========== DELHIVERY WAREHOUSE REGISTRATION ==========');
console.log('⏰ Timestamp:', new Date().toISOString());
console.log('\n📋 Warehouse Details:');
console.log('   - Name:', warehouseData.name);
console.log('   - Address:', warehouseData.address);
console.log('   - City:', warehouseData.city);
console.log('   - State:', warehouseData.state);
console.log('   - Pincode:', warehouseData.pincode);
console.log('   - Contact:', warehouseData.contactPerson);
console.log('   - Phone:', warehouseData.contactPhone);
console.log('   - Email:', warehouseData.contactEmail);

// Validate API key
if (!DELHIVERY_API_KEY) {
  console.error('\n❌ ERROR: DELHIVERY_API_KEY is not set in .env file');
  console.error('Please add your Delhivery API key to the .env file');
  process.exit(1);
}

// Prepare registration data
const registrationData = {
  name: warehouseData.name,
  address: warehouseData.address,
  city: warehouseData.city,
  state: warehouseData.state,
  pin: warehouseData.pincode,
  country: 'India',
  phone: warehouseData.contactPhone,
  email: warehouseData.contactEmail,
  registered_name: warehouseData.contactPerson,
  return_address: warehouseData.address,
  return_city: warehouseData.city,
  return_state: warehouseData.state,
  return_pin: warehouseData.pincode,
  return_country: 'India'
};

console.log('\n📦 Registration Payload:', JSON.stringify(registrationData, null, 2));

// Delhivery warehouse creation API endpoint
const warehouseUrl = `${DELHIVERY_BASE_URL}/backend/clientwarehouse/create/`;

console.log('\n🌐 Sending request to Delhivery API...');
console.log('   - URL:', warehouseUrl);
console.log('   - API Key: ***' + DELHIVERY_API_KEY.substring(DELHIVERY_API_KEY.length - 8));

// Register warehouse
async function registerWarehouse() {
  try {
    const response = await fetch(warehouseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${DELHIVERY_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });

    console.log('\n📡 Delhivery API Response:');
    console.log('   - Status Code:', response.status);
    console.log('   - Status Text:', response.statusText);

    const responseData = await response.json();
    console.log('📦 Response Data:', JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.success !== false) {
      console.log('\n✅ ========== WAREHOUSE REGISTERED SUCCESSFULLY ==========');
      console.log('   - Warehouse Name:', warehouseData.name);
      console.log('   - Status: Pending Verification');
      console.log('   - Timeline: 24-48 hours for Delhivery verification');
      console.log('\n📋 NEXT STEPS:');
      console.log('   1. Wait for Delhivery to verify the warehouse (24-48 hours)');
      console.log('   2. Update your .env file with:');
      console.log(`      DELHIVERY_PICKUP_LOCATION=${warehouseData.name}`);
      console.log('   3. Restart your server: npm run dev');
      console.log('   4. Test Order #5 by changing status to "Shipped"');
      console.log('\n🏭 =========================================================\n');
      
      return true;
    } else {
      console.error('\n❌ ========== WAREHOUSE REGISTRATION FAILED ==========');
      console.error('   - Message:', responseData.message || 'Unknown error');
      console.error('   - Errors:', responseData.errors || ['Unknown error from Delhivery API']);
      console.error('\n💡 POSSIBLE SOLUTIONS:');
      console.error('   1. Check if your Delhivery API key is correct');
      console.error('   2. Verify pincode 823001 is serviceable by Delhivery');
      console.error('   3. Contact Delhivery support: vendordesk@delhivery.com');
      console.error('   4. Try registering via Delhivery dashboard: https://one.delhivery.com/warehouses');
      console.error('\n📧 EMAIL TEMPLATE FOR DELHIVERY SUPPORT:');
      console.error('   To: vendordesk@delhivery.com');
      console.error('   Subject: Warehouse Registration Request - BLINK EACH');
      console.error('   Body:');
      console.error('   ---');
      console.error('   Dear Delhivery Team,');
      console.error('');
      console.error('   I would like to register a new warehouse/pickup location:');
      console.error('');
      console.error(`   Warehouse Name: ${warehouseData.name}`);
      console.error(`   Address: ${warehouseData.address}`);
      console.error(`   City: ${warehouseData.city}`);
      console.error(`   State: ${warehouseData.state}`);
      console.error(`   Pincode: ${warehouseData.pincode}`);
      console.error(`   Contact: ${warehouseData.contactPerson}`);
      console.error(`   Phone: ${warehouseData.contactPhone}`);
      console.error(`   Email: ${warehouseData.contactEmail}`);
      console.error('');
      console.error(`   Client Name: ${process.env.DELHIVERY_CLIENT_NAME || 'BLINK EACH'}`);
      console.error(`   API Key: ${DELHIVERY_API_KEY}`);
      console.error('');
      console.error('   Please register this warehouse and confirm the exact name to use in API.');
      console.error('');
      console.error('   Thank you,');
      console.error(`   ${warehouseData.contactPerson}`);
      console.error('   ---');
      console.error('\n🏭 ======================================================\n');
      
      return false;
    }
  } catch (error) {
    console.error('\n❌ ========== REGISTRATION ERROR ==========');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('\n💡 TROUBLESHOOTING:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify Delhivery API is accessible');
    console.error('   3. Try again in a few minutes');
    console.error('   4. Contact Delhivery support if issue persists');
    console.error('\n🏭 ===========================================\n');
    
    return false;
  }
}

// Run the registration
registerWarehouse()
  .then(success => {
    if (success) {
      console.log('✅ Registration process completed successfully!');
      process.exit(0);
    } else {
      console.log('❌ Registration process failed. Please try alternative methods.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
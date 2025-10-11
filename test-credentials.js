/**
 * Test Script for Razorpay and Delivery API Credentials
 * 
 * This script tests the configuration of:
 * 1. Razorpay Live API Keys
 * 2. Delhivery API Key
 * 
 * Run this script with: node test-credentials.js
 */

require('dotenv').config();

console.log('\n🔍 ========== CREDENTIALS TEST SCRIPT ==========');
console.log('⏰ Timestamp:', new Date().toISOString());
console.log('================================================\n');

// Test Razorpay Configuration
console.log('💳 RAZORPAY CONFIGURATION:');
console.log('─────────────────────────────────────────────');

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const viteRazorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID;

if (razorpayKeyId) {
  console.log('✅ RAZORPAY_KEY_ID is set');
  console.log('   Value:', razorpayKeyId.substring(0, 15) + '...');
  console.log('   Mode:', razorpayKeyId.startsWith('rzp_live') ? '🟢 LIVE MODE' : '🟡 TEST MODE');
} else {
  console.log('❌ RAZORPAY_KEY_ID is NOT set');
}

if (razorpayKeySecret) {
  console.log('✅ RAZORPAY_KEY_SECRET is set');
  console.log('   Value: ***' + razorpayKeySecret.substring(razorpayKeySecret.length - 4));
} else {
  console.log('❌ RAZORPAY_KEY_SECRET is NOT set');
}

if (viteRazorpayKeyId) {
  console.log('✅ VITE_RAZORPAY_KEY_ID is set (for frontend)');
  console.log('   Value:', viteRazorpayKeyId.substring(0, 15) + '...');
} else {
  console.log('❌ VITE_RAZORPAY_KEY_ID is NOT set');
}

// Test Delhivery Configuration
console.log('\n📦 DELHIVERY CONFIGURATION:');
console.log('─────────────────────────────────────────────');

const delhiveryApiKey = process.env.DELHIVERY_API_KEY;
const delhiveryBaseUrl = process.env.DELHIVERY_BASE_URL;

if (delhiveryApiKey) {
  console.log('✅ DELHIVERY_API_KEY is set');
  console.log('   Value: ***' + delhiveryApiKey.substring(delhiveryApiKey.length - 8));
  console.log('   Length:', delhiveryApiKey.length, 'characters');
} else {
  console.log('❌ DELHIVERY_API_KEY is NOT set');
}

if (delhiveryBaseUrl) {
  console.log('✅ DELHIVERY_BASE_URL is set');
  console.log('   Value:', delhiveryBaseUrl);
} else {
  console.log('❌ DELHIVERY_BASE_URL is NOT set');
}

// Summary
console.log('\n📊 CONFIGURATION SUMMARY:');
console.log('─────────────────────────────────────────────');

const razorpayConfigured = razorpayKeyId && razorpayKeySecret && viteRazorpayKeyId;
const delhiveryConfigured = delhiveryApiKey && delhiveryBaseUrl;

console.log('Razorpay:', razorpayConfigured ? '✅ FULLY CONFIGURED' : '❌ INCOMPLETE');
console.log('Delhivery:', delhiveryConfigured ? '✅ FULLY CONFIGURED' : '❌ INCOMPLETE');

if (razorpayConfigured && delhiveryConfigured) {
  console.log('\n🎉 All credentials are properly configured!');
  console.log('   You can now test payments and delivery integration.');
} else {
  console.log('\n⚠️  Some credentials are missing or incomplete.');
  console.log('   Please check your .env file.');
}

// Additional Environment Info
console.log('\n🌍 ENVIRONMENT INFO:');
console.log('─────────────────────────────────────────────');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || '5000');

console.log('\n================================================');
console.log('🔍 ========== TEST COMPLETED ==========\n');
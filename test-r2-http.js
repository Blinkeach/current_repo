import 'dotenv/config';
import https from 'https';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);
const resolve = promisify(dns.resolve);

console.log('🔍 Testing R2 Connectivity at Network Level...\n');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const hostname = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

console.log(`📋 Testing hostname: ${hostname}\n`);

// Test 1: DNS Resolution
console.log('🧪 Test 1: DNS Resolution...');
try {
  const addresses = await resolve4(hostname);
  console.log(`✅ DNS resolved successfully!`);
  console.log(`   IP Addresses: ${addresses.join(', ')}\n`);
} catch (error) {
  console.log(`❌ DNS resolution failed: ${error.message}`);
  console.log(`   Hostname: ${hostname}\n`);
  
  // Try resolving cloudflare.com to check if DNS is working at all
  console.log('🧪 Test 1b: Testing general DNS (cloudflare.com)...');
  try {
    const cfAddresses = await resolve4('cloudflare.com');
    console.log(`✅ General DNS is working (cloudflare.com resolved)`);
    console.log(`   This means the R2 endpoint hostname is the issue.\n`);
  } catch (err) {
    console.log(`❌ General DNS also failed!`);
    console.log(`   This indicates a network/DNS configuration problem.\n`);
  }
  
  console.log('💡 Possible Solutions:');
  console.log('   1. Check if you\'re behind a corporate firewall');
  console.log('   2. Try using a different DNS server (e.g., 8.8.8.8)');
  console.log('   3. Check if VPN is interfering');
  console.log('   4. Verify the Account ID is absolutely correct\n');
  
  console.log('🔧 Alternative: Use Cloudflare Workers or Public Bucket');
  console.log(`   Your public URL (${process.env.R2_PUBLIC_URL}) suggests`);
  console.log('   you have public access enabled. We can use that instead!\n');
  
  process.exit(1);
}

// Test 2: HTTPS Connection
console.log('🧪 Test 2: HTTPS Connection...');
const url = `https://${hostname}/`;

https.get(url, (res) => {
  console.log(`✅ HTTPS connection successful!`);
  console.log(`   Status Code: ${res.statusCode}`);
  console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}\n`);
  
  console.log('🎉 Network connectivity to R2 is working!');
  console.log('   The issue might be with the S3 SDK or credentials.\n');
  
}).on('error', (error) => {
  console.log(`❌ HTTPS connection failed: ${error.message}\n`);
});
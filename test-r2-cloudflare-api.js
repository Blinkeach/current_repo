import 'dotenv/config';
import fetch from 'node-fetch';

console.log('🔍 Testing Cloudflare R2 using Cloudflare API (not S3)...\n');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Try using Cloudflare's native API endpoint
const apiEndpoint = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects/test/api-test.txt`;

console.log('📋 Configuration:');
console.log(`   Account ID: ${R2_ACCOUNT_ID}`);
console.log(`   Bucket: ${R2_BUCKET_NAME}`);
console.log(`   API Endpoint: ${apiEndpoint}\n`);

console.log('🧪 Attempting upload via Cloudflare API...\n');

const testContent = `Test upload at ${new Date().toISOString()}`;

try {
  const response = await fetch(apiEndpoint, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${R2_ACCESS_KEY_ID}`,
      'Content-Type': 'text/plain',
    },
    body: testContent,
  });

  console.log(`Response Status: ${response.status} ${response.statusText}`);
  const data = await response.text();
  console.log(`Response Body: ${data}\n`);

  if (response.ok) {
    console.log('✅ Upload successful via Cloudflare API!');
  } else {
    console.log('❌ Upload failed via Cloudflare API');
    console.log('   This suggests we need to use S3 API, but the endpoint is not resolving.\n');
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}\n`);
}

console.log('💡 Since S3 endpoint is not resolving, let me check if your credentials');
console.log('   are actually R2 API tokens or if they might be something else.\n');
console.log('🔧 Please verify:');
console.log('   1. Go to: https://dash.cloudflare.com/' + R2_ACCOUNT_ID + '/r2/api-tokens');
console.log('   2. Check if your API token exists and is active');
console.log('   3. The Access Key ID should start with a specific format');
console.log('   4. Try creating a NEW API token if needed\n');
import 'dotenv/config';
import { S3Client, ListBucketsCommand, PutObjectCommand } from '@aws-sdk/client-s3';

console.log('🔍 Testing Cloudflare R2 Connection with different endpoints...\n');

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;

console.log('📋 Current Configuration:');
console.log(`   Account ID: ${R2_ACCOUNT_ID}`);
console.log(`   Bucket Name: ${R2_BUCKET_NAME}`);
console.log(`   Public URL: ${process.env.R2_PUBLIC_URL}\n`);

// Test with the Account ID from .env
console.log('🧪 Test 1: Using Account ID from .env...');
const client1 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

try {
  const testFile = Buffer.from('Test file content');
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: 'test/connection-test.txt',
    Body: testFile,
    ContentType: 'text/plain',
  });
  
  await client1.send(command);
  console.log('✅ SUCCESS! File uploaded successfully!');
  console.log(`   Endpoint: https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
  console.log(`   File URL: ${process.env.R2_PUBLIC_URL}/test/connection-test.txt\n`);
  
  console.log('🎉 Your R2 configuration is correct!');
  console.log('   All uploads will now go to R2 storage.');
  
} catch (error) {
  console.log('❌ FAILED with current Account ID');
  console.log(`   Error: ${error.message}\n`);
  
  console.log('💡 SOLUTION:');
  console.log('   Your R2_ACCOUNT_ID appears to be incorrect.');
  console.log('   To find your correct Account ID:');
  console.log('   1. Go to https://dash.cloudflare.com');
  console.log('   2. Click on R2 in the sidebar');
  console.log('   3. Look at the URL: https://dash.cloudflare.com/{ACCOUNT_ID}/r2');
  console.log('   4. Copy the {ACCOUNT_ID} from the URL');
  console.log('   5. Update R2_ACCOUNT_ID in your .env file\n');
  
  console.log('   The Account ID is usually a 32-character hex string.');
  console.log('   It is NOT the same as the subdomain in your public URL.');
}
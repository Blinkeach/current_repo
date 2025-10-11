import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import https from 'https';

console.log('🔍 Debugging R2 Connection...\n');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

console.log('📋 Environment Variables:');
console.log(`   R2_ACCOUNT_ID: ${R2_ACCOUNT_ID ? '✓ Set' : '✗ Missing'} (${R2_ACCOUNT_ID?.substring(0, 8)}...)`);
console.log(`   R2_ACCESS_KEY_ID: ${R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing'} (${R2_ACCESS_KEY_ID?.substring(0, 8)}...)`);
console.log(`   R2_SECRET_ACCESS_KEY: ${R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing'} (${R2_SECRET_ACCESS_KEY?.substring(0, 8)}...)`);
console.log(`   R2_BUCKET_NAME: ${R2_BUCKET_NAME ? '✓ Set' : '✗ Missing'} (${R2_BUCKET_NAME})`);
console.log('');

const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
console.log(`🌐 Testing endpoint: ${endpoint}\n`);

// Test 1: Check DNS resolution
console.log('🧪 Test 1: DNS Resolution...');
const hostname = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

https.get(`https://${hostname}/`, (res) => {
  console.log(`✅ DNS resolved! Status: ${res.statusCode}`);
  testS3Connection();
}).on('error', (err) => {
  if (err.code === 'ENOTFOUND') {
    console.log('❌ DNS resolution failed!');
    console.log(`   Cannot resolve: ${hostname}`);
    console.log('\n💡 Possible issues:');
    console.log('   1. Your Account ID might be incorrect');
    console.log('   2. Network/firewall blocking the connection');
    console.log('   3. DNS server issue\n');
    console.log('🔧 Please verify your Account ID:');
    console.log('   1. Go to https://dash.cloudflare.com');
    console.log('   2. Click on R2');
    console.log('   3. The URL should be: https://dash.cloudflare.com/{ACCOUNT_ID}/r2');
    console.log('   4. Copy the ACCOUNT_ID from the URL');
    console.log(`   5. Current value: ${R2_ACCOUNT_ID}\n`);
  } else {
    console.log(`❌ Connection error: ${err.message}`);
  }
});

async function testS3Connection() {
  console.log('\n🧪 Test 2: S3 API Connection...');
  
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  try {
    const testContent = `Test at ${new Date().toISOString()}`;
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: 'test/connection-test.txt',
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });
    
    await r2Client.send(command);
    console.log('✅ S3 API connection successful!');
    console.log('✅ File uploaded to R2!');
    console.log(`   URL: ${process.env.R2_PUBLIC_URL}/test/connection-test.txt\n`);
    console.log('🎉 R2 is working correctly!');
    
  } catch (error) {
    console.log('❌ S3 API connection failed!');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code || 'N/A'}\n`);
    
    if (error.code === 'InvalidAccessKeyId') {
      console.log('💡 Your R2_ACCESS_KEY_ID is incorrect.');
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.log('💡 Your R2_SECRET_ACCESS_KEY is incorrect.');
    }
  }
}
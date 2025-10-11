// Test R2 Connection Script
// Run this with: node test-r2-connection.js

import { S3Client, ListBucketsCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

console.log('🔍 Testing Cloudflare R2 Connection...\n');

// Check if credentials are configured
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('❌ R2 credentials not configured in .env file');
  console.log('\nRequired environment variables:');
  console.log('- R2_ACCOUNT_ID');
  console.log('- R2_ACCESS_KEY_ID');
  console.log('- R2_SECRET_ACCESS_KEY');
  console.log('- R2_BUCKET_NAME');
  process.exit(1);
}

console.log('✅ R2 credentials found in .env');
console.log(`   Account ID: ${R2_ACCOUNT_ID}`);
console.log(`   Bucket Name: ${R2_BUCKET_NAME}\n`);

// Create S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function testConnection() {
  try {
    // Test 1: List buckets
    console.log('📋 Test 1: Listing buckets...');
    const listCommand = new ListBucketsCommand({});
    const listResponse = await s3Client.send(listCommand);
    console.log('✅ Successfully connected to R2!');
    console.log(`   Found ${listResponse.Buckets?.length || 0} bucket(s)\n`);

    // Test 2: Upload a test file
    console.log('📤 Test 2: Uploading test file...');
    const testContent = `R2 Connection Test - ${new Date().toISOString()}`;
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: 'test/connection-test.txt',
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });
    
    await s3Client.send(uploadCommand);
    console.log('✅ Test file uploaded successfully!');
    console.log(`   File: test/connection-test.txt\n`);

    // Success summary
    console.log('🎉 All tests passed!');
    console.log('\n📊 Summary:');
    console.log('   ✅ R2 credentials are valid');
    console.log('   ✅ Connection to R2 successful');
    console.log('   ✅ File upload working');
    console.log(`   ✅ Bucket "${R2_BUCKET_NAME}" is accessible`);
    console.log('\n🚀 Your application is ready to use R2 storage!');
    
  } catch (error) {
    console.error('❌ R2 Connection Test Failed!\n');
    console.error('Error details:', error.message);
    
    if (error.Code === 'InvalidAccessKeyId') {
      console.error('\n💡 Tip: Check your R2_ACCESS_KEY_ID in .env file');
    } else if (error.Code === 'SignatureDoesNotMatch') {
      console.error('\n💡 Tip: Check your R2_SECRET_ACCESS_KEY in .env file');
    } else if (error.Code === 'NoSuchBucket') {
      console.error(`\n💡 Tip: Bucket "${R2_BUCKET_NAME}" does not exist. Create it in Cloudflare dashboard.`);
    } else {
      console.error('\n💡 Tip: Verify all R2 credentials in .env file are correct');
    }
    
    process.exit(1);
  }
}

testConnection();
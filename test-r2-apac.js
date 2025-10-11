import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

console.log('=== Testing R2 APAC Endpoint ===\n');
console.log('Account ID:', ACCOUNT_ID);
console.log('Bucket:', BUCKET_NAME);
console.log('Endpoint:', `https://${ACCOUNT_ID}.apac.r2.cloudflarestorage.com`);
console.log('\n');

// Create S3 client with APAC endpoint
const client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.apac.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

async function testConnection() {
  try {
    console.log('📡 Testing connection to R2 APAC endpoint...\n');
    
    // Test 1: List objects
    console.log('Test 1: Listing objects in bucket...');
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      MaxKeys: 10,
    });
    
    const listResult = await client.send(listCommand);
    console.log('✅ Successfully connected to R2!');
    console.log(`   Found ${listResult.KeyCount || 0} objects in bucket`);
    
    if (listResult.Contents && listResult.Contents.length > 0) {
      console.log('   Recent files:');
      listResult.Contents.slice(0, 5).forEach(obj => {
        console.log(`   - ${obj.Key} (${obj.Size} bytes)`);
      });
    }
    console.log('');
    
    // Test 2: Upload a test file
    console.log('Test 2: Uploading test file...');
    const testContent = `Test upload at ${new Date().toISOString()}`;
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'test/connection-test.txt',
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });
    
    await client.send(uploadCommand);
    console.log('✅ Test file uploaded successfully!');
    console.log(`   URL: ${process.env.R2_PUBLIC_URL}/test/connection-test.txt`);
    console.log('');
    
    console.log('🎉 All tests passed! R2 is working correctly with APAC endpoint.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your application server');
    console.log('2. Try uploading an image through your app');
    console.log('3. Check the console logs for "✅ [R2] Image uploaded successfully"');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('');
    
    if (error.code === 'ENOTFOUND' || error.code === 'EREFUSED') {
      console.error('DNS resolution still failing. Possible causes:');
      console.error('1. Network/firewall blocking *.r2.cloudflarestorage.com');
      console.error('2. Try from a different network (mobile hotspot)');
      console.error('3. Check with your ISP or network administrator');
    } else if (error.name === 'InvalidAccessKeyId') {
      console.error('Access Key ID is invalid. Please verify your R2 API token.');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('Secret Access Key is invalid. Please verify your R2 API token.');
    } else {
      console.error('Full error:', error);
    }
  }
}

testConnection();
import 'dotenv/config';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

console.log('🔍 Testing Cloudflare R2 Direct Connection...\n');

const R2_ACCOUNT_ID = 'e0b70d52f241f7e6ece12d27961d47a5';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = 'blinkeach';
const R2_PUBLIC_URL = 'https://pub-2eb2bb70d0314a4686b5ee01cb3211c2.r2.dev';

console.log('📋 Configuration:');
console.log(`   Account ID: ${R2_ACCOUNT_ID}`);
console.log(`   Bucket: ${R2_BUCKET_NAME}`);
console.log(`   Endpoint: https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
console.log(`   Public URL: ${R2_PUBLIC_URL}\n`);

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function testConnection() {
  try {
    console.log('🧪 Test 1: Listing objects in bucket...');
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 5,
    });
    
    const listResult = await r2Client.send(listCommand);
    console.log('✅ Successfully connected to R2!');
    console.log(`   Found ${listResult.KeyCount || 0} objects in bucket\n`);
    
    if (listResult.Contents && listResult.Contents.length > 0) {
      console.log('📁 Existing files:');
      listResult.Contents.forEach(obj => {
        console.log(`   - ${obj.Key}`);
      });
      console.log('');
    }
    
    console.log('🧪 Test 2: Uploading test file...');
    const testContent = `Test upload at ${new Date().toISOString()}`;
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: 'test/connection-test.txt',
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });
    
    await r2Client.send(uploadCommand);
    console.log('✅ Test file uploaded successfully!');
    console.log(`   File URL: ${R2_PUBLIC_URL}/test/connection-test.txt\n`);
    
    console.log('🎉 ALL TESTS PASSED!');
    console.log('   Your R2 storage is working correctly.');
    console.log('   All new uploads will now go to R2.\n');
    
    return true;
    
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code || 'N/A'}\n`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 DNS Resolution Error:');
      console.log('   The endpoint hostname cannot be resolved.');
      console.log('   This might be a network/firewall issue.\n');
    } else if (error.code === 'InvalidAccessKeyId') {
      console.log('💡 Invalid Access Key:');
      console.log('   Your R2_ACCESS_KEY_ID is incorrect.');
      console.log('   Please verify it in Cloudflare dashboard.\n');
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.log('💡 Invalid Secret Key:');
      console.log('   Your R2_SECRET_ACCESS_KEY is incorrect.');
      console.log('   Please verify it in Cloudflare dashboard.\n');
    }
    
    return false;
  }
}

testConnection();
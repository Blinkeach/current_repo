import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

console.log('🔍 Testing R2 with Different Regional Endpoints...\n');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const endpoints = [
  { name: 'Auto (Default)', url: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` },
  { name: 'EU Region', url: `https://${R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com` },
  { name: 'APAC Region', url: `https://${R2_ACCOUNT_ID}.apac.r2.cloudflarestorage.com` },
];

async function testEndpoint(endpoint) {
  console.log(`🧪 Testing: ${endpoint.name}`);
  console.log(`   Endpoint: ${endpoint.url}`);
  
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: endpoint.url,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  try {
    const testContent = `Test from ${endpoint.name} at ${new Date().toISOString()}`;
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: 'test/connection-test.txt',
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });
    
    await r2Client.send(command);
    console.log(`✅ SUCCESS with ${endpoint.name}!`);
    console.log(`   File uploaded successfully!`);
    console.log(`   Public URL: ${R2_PUBLIC_URL}/test/connection-test.txt\n`);
    return endpoint;
    
  } catch (error) {
    console.log(`❌ Failed: ${error.message.substring(0, 80)}`);
    console.log('');
    return null;
  }
}

async function findWorkingEndpoint() {
  console.log('📋 Configuration:');
  console.log(`   Account ID: ${R2_ACCOUNT_ID}`);
  console.log(`   Bucket: ${R2_BUCKET_NAME}\n`);
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result) {
      console.log('🎉 FOUND WORKING ENDPOINT!');
      console.log(`   Use this endpoint: ${result.url}`);
      console.log(`\n📝 Update your .env file if needed:`);
      if (result.name !== 'Auto (Default)') {
        console.log(`   The bucket appears to be in a specific region: ${result.name}`);
        console.log(`   You may need to update the R2 storage service to use this endpoint.`);
      }
      return;
    }
  }
  
  console.log('❌ None of the endpoints worked!');
  console.log('\n💡 Possible issues:');
  console.log('   1. Account ID is incorrect');
  console.log('   2. Access credentials are invalid');
  console.log('   3. Network/firewall blocking connection');
  console.log('   4. Bucket name is incorrect\n');
  console.log('🔧 Please verify in Cloudflare Dashboard:');
  console.log('   1. Go to https://dash.cloudflare.com');
  console.log('   2. Navigate to R2');
  console.log('   3. Check your bucket settings');
  console.log('   4. Verify API tokens are correct');
}

findWorkingEndpoint();
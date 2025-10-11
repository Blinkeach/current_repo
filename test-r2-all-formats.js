import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

const resolve = promisify(dns.resolve);
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

console.log('=== Testing All R2 Endpoint Formats ===\n');

// All possible endpoint formats
const endpoints = [
  `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  `https://${ACCOUNT_ID}.apac.r2.cloudflarestorage.com`,
  `https://${ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
  `https://${ACCOUNT_ID}.us-east-1.r2.cloudflarestorage.com`,
  `https://r2.cloudflarestorage.com/${ACCOUNT_ID}`,
];

async function testDNS(hostname) {
  try {
    await resolve(hostname);
    return '✅ Resolves';
  } catch (error) {
    return `❌ ${error.code}`;
  }
}

async function testEndpoint(endpoint) {
  const url = new URL(endpoint);
  const hostname = url.hostname;
  
  console.log(`\nTesting: ${endpoint}`);
  console.log(`Hostname: ${hostname}`);
  
  // Test DNS first
  const dnsResult = await testDNS(hostname);
  console.log(`DNS: ${dnsResult}`);
  
  if (!dnsResult.startsWith('✅')) {
    return false;
  }
  
  // Test S3 connection
  try {
    const client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
    
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      MaxKeys: 1,
    });
    
    await client.send(command);
    console.log('S3 API: ✅ Working!');
    return true;
  } catch (error) {
    console.log(`S3 API: ❌ ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Account ID:', ACCOUNT_ID);
  console.log('Bucket:', BUCKET_NAME);
  console.log('');
  
  let workingEndpoint = null;
  
  for (const endpoint of endpoints) {
    const works = await testEndpoint(endpoint);
    if (works) {
      workingEndpoint = endpoint;
      break;
    }
  }
  
  console.log('\n=== Results ===');
  if (workingEndpoint) {
    console.log('✅ Found working endpoint:', workingEndpoint);
    console.log('\nUpdate your .env file with:');
    console.log(`R2_ENDPOINT=${workingEndpoint}`);
  } else {
    console.log('❌ No working endpoint found');
    console.log('\nThis indicates a network-level issue:');
    console.log('1. Your network is blocking *.r2.cloudflarestorage.com');
    console.log('2. Try from a different network (mobile hotspot, VPN)');
    console.log('3. Contact your network administrator');
    console.log('4. Check firewall/antivirus settings');
  }
}

runTests();
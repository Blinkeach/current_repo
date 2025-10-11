import 'dotenv/config';

console.log('🔍 Checking R2 Credentials Format...\n');

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

console.log('📋 Credential Analysis:');
console.log(`   Access Key ID Length: ${R2_ACCESS_KEY_ID?.length} characters`);
console.log(`   Access Key ID Format: ${R2_ACCESS_KEY_ID?.substring(0, 10)}...`);
console.log(`   Secret Key Length: ${R2_SECRET_ACCESS_KEY?.length} characters`);
console.log(`   Secret Key Format: ${R2_SECRET_ACCESS_KEY?.substring(0, 10)}...\n`);

// R2 Access Keys should be 32 characters (hex)
// R2 Secret Keys should be 64 characters (hex)
if (R2_ACCESS_KEY_ID?.length === 32 && /^[a-f0-9]+$/.test(R2_ACCESS_KEY_ID)) {
  console.log('✅ Access Key ID format looks correct (32-char hex)');
} else {
  console.log('⚠️  Access Key ID format might be incorrect');
  console.log(`   Expected: 32 hexadecimal characters`);
  console.log(`   Got: ${R2_ACCESS_KEY_ID?.length} characters\n`);
}

if (R2_SECRET_ACCESS_KEY?.length === 64 && /^[a-f0-9]+$/.test(R2_SECRET_ACCESS_KEY)) {
  console.log('✅ Secret Access Key format looks correct (64-char hex)');
} else {
  console.log('⚠️  Secret Access Key format might be incorrect');
  console.log(`   Expected: 64 hexadecimal characters`);
  console.log(`   Got: ${R2_SECRET_ACCESS_KEY?.length} characters\n`);
}

console.log('\n💡 Note: These credentials should be from:');
console.log('   Cloudflare Dashboard → R2 → Manage R2 API Tokens');
console.log('   NOT from Cloudflare API Tokens (different thing!)');
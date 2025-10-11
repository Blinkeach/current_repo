# Cloudflare R2 Connection Troubleshooting

## Issue Summary
The R2 S3 API endpoint `e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com` is not resolving in DNS.

## What We've Verified ✅
- Account ID is correct: `e0b70d52f241f7e6ece12d27961d47a5`
- Credentials format is correct (32-char Access Key, 64-char Secret Key)
- R2 is enabled with payment method
- Bucket exists: `blinkeach`
- Public URL works: `https://pub-2eb2bb70d0314a4686b5ee01cb3211c2.r2.dev`
- General DNS is working (cloudflare.com resolves)

## The Problem ❌
DNS query for `e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com` returns `EREFUSED` or `ENOTFOUND`.

## Possible Causes

### 1. Network/Firewall Blocking
Your ISP, corporate firewall, or antivirus might be blocking access to `*.r2.cloudflarestorage.com`.

**Test:**
```powershell
nslookup e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com
nslookup e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com 8.8.8.8
```

**Solutions:**
- Try from a different network (mobile hotspot)
- Contact your IT department if on corporate network
- Try using a VPN
- Change DNS servers to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)

### 2. R2 S3 API Not Fully Activated
Sometimes R2 S3 API takes time to propagate after account setup.

**Solutions:**
- Wait 24-48 hours after R2 activation
- Try deleting and recreating the API token
- Contact Cloudflare support

### 3. Regional/Jurisdiction Issue
If your bucket was created with a specific jurisdiction, the endpoint might be different.

**Test in Cloudflare Dashboard:**
1. Go to R2 → blinkeach bucket → Settings
2. Look for "Location" or "Jurisdiction"
3. If it shows EU or APAC, the endpoint might be:
   - EU: `https://e0b70d52f241f7e6ece12d27961d47a5.eu.r2.cloudflarestorage.com`
   - APAC: `https://e0b70d52f241f7e6ece12d27961d47a5.apac.r2.cloudflarestorage.com`

### 4. Account ID Mismatch
Although unlikely, the Account ID in the dashboard URL might differ from the R2 API Account ID.

**Verify:**
1. Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Click on your API token
3. Check if there's any account information displayed

## Immediate Workaround

Your application is currently configured to **automatically fall back to local storage** when R2 is unavailable. This means:

✅ **Your app will continue working normally**
✅ Files will be stored in `./uploads/` directory
✅ No functionality is lost

## Testing from Different Environment

Try running this test from a different machine/network:

```javascript
// test-r2-simple-external.js
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'e5aabe9f5e51299f890d56449510dfd3',
    secretAccessKey: 'bd910519cbdc2222643c259d4395dc90aa90030b84830e6d471e41f4e69f30a0',
  },
  forcePathStyle: true,
});

const command = new ListObjectsV2Command({ Bucket: 'blinkeach', MaxKeys: 5 });
const result = await client.send(command);
console.log('Success!', result);
```

## Next Steps

### Option 1: Wait and Retry
1. Wait 24-48 hours
2. Run: `node test-r2-fixed.js`
3. If successful, restart your application

### Option 2: Use Different Network
1. Connect to mobile hotspot or VPN
2. Run: `node test-r2-fixed.js`
3. If successful, investigate firewall/DNS settings

### Option 3: Contact Cloudflare Support
1. Go to: https://dash.cloudflare.com/support
2. Create a ticket with:
   - Account ID: `e0b70d52f241f7e6ece12d27961d47a5`
   - Bucket: `blinkeach`
   - Issue: "S3 API endpoint not resolving in DNS"
   - Error: `ENOTFOUND e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com`

### Option 4: Use Cloudflare Workers (Advanced)
Create a Cloudflare Worker to act as a proxy for R2 uploads. This bypasses the S3 API entirely.

## Monitoring

Check if R2 is being used:
```powershell
# Start your application and watch the logs
npm run dev

# Look for these messages:
# "✅ Uploaded to R2: ..." = R2 is working
# "⚠️ R2 unavailable, using local storage" = Fallback active
```

## Current Status

🟡 **R2 Integration: Configured but not connecting**
🟢 **Application: Fully functional (using local storage fallback)**
🔵 **Action Required: Network/DNS troubleshooting needed**

---

**Last Updated:** $(Get-Date)
**Status:** Investigating DNS resolution issue
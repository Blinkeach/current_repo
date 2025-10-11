# DNS Block Resolution - R2 Access Fix

## Problem Identified ✅

Your DNS server (`10.213.164.124`) is **actively blocking** all `*.r2.cloudflarestorage.com` domains.

**Proof:**
- ❌ Your DNS: `nslookup r2.cloudflarestorage.com` → **Query refused**
- ✅ Google DNS: `nslookup r2.cloudflarestorage.com 8.8.8.8` → **Resolves successfully**

## Solution: Change DNS Servers

### Option 1: Change System DNS (Recommended)

#### Windows 10/11:

1. **Open Network Settings:**
   - Press `Win + R`
   - Type: `ncpa.cpl`
   - Press Enter

2. **Configure DNS:**
   - Right-click your active network connection (Wi-Fi or Ethernet)
   - Click **Properties**
   - Select **Internet Protocol Version 4 (TCP/IPv4)**
   - Click **Properties**

3. **Set DNS Servers:**
   - Select **"Use the following DNS server addresses"**
   - **Preferred DNS:** `8.8.8.8` (Google)
   - **Alternate DNS:** `1.1.1.1` (Cloudflare)
   - Click **OK**

4. **Flush DNS Cache:**
   ```powershell
   ipconfig /flushdns
   ```

5. **Test:**
   ```powershell
   nslookup r2.cloudflarestorage.com
   ```

### Option 2: Use Mobile Hotspot (Quick Test)

1. Enable mobile hotspot on your phone
2. Connect your computer to it
3. Run: `node test-r2-apac.js`
4. If it works, the issue is confirmed as your network DNS

### Option 3: Use VPN

If you're on a corporate network that you can't modify:
1. Connect to a VPN service
2. This will bypass your corporate DNS
3. Test R2 connection again

## After DNS Change

Once DNS is working, test the connection:

```powershell
# Test DNS resolution
nslookup e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com

# Test R2 connection
node test-r2-apac.js

# If successful, restart your app
npm run dev
```

## Why This Happened

Your DNS server (`10.213.164.124`) is likely:
- A corporate DNS server with content filtering
- An ISP DNS with restrictions
- A router with parental controls/filtering enabled

The DNS server is configured to block Cloudflare R2 storage domains, possibly as part of:
- Cloud storage restrictions
- Bandwidth management policies
- Security policies

## Verification Commands

```powershell
# Check current DNS server
ipconfig /all | Select-String "DNS Servers"

# Test with Google DNS
nslookup r2.cloudflarestorage.com 8.8.8.8

# Test with Cloudflare DNS
nslookup r2.cloudflarestorage.com 1.1.1.1

# Test with your current DNS (should fail)
nslookup r2.cloudflarestorage.com
```

## Expected Results After Fix

When DNS is working correctly:

```
✅ DNS resolution: Success
✅ R2 connection: Success
✅ File uploads: Will go to R2 bucket
✅ Console logs: "✅ [R2] Image uploaded successfully"
```

## If You Can't Change DNS

If you're on a corporate network and can't change DNS settings:

1. **Contact IT Department:**
   - Request access to `*.r2.cloudflarestorage.com`
   - Explain it's for cloud storage (similar to AWS S3)

2. **Use Cloudflare Workers (Alternative):**
   - Create a Worker that proxies uploads to R2
   - This bypasses the S3 API entirely
   - Uses standard HTTPS which won't be blocked

3. **Continue with Local Storage:**
   - Your app already has fallback to local storage
   - Everything works, files just stored locally
   - No functionality is lost

## Current Status

🔴 **DNS Block:** Active - `10.213.164.124` refusing R2 domains  
🟡 **R2 Access:** Blocked by DNS  
🟢 **App Functionality:** Working (using local storage fallback)  
🔵 **Action Required:** Change DNS servers or use VPN/mobile hotspot

---

**Next Step:** Change your DNS to `8.8.8.8` and `1.1.1.1`, then test again.
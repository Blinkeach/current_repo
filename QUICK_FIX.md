# Quick Fix: Enable R2 Storage

## Problem
Your DNS server is blocking Cloudflare R2 domains.

## Solution (5 minutes)

### Step 1: Change DNS Settings

1. Press `Win + R`, type `ncpa.cpl`, press Enter
2. Right-click your network connection → **Properties**
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**
4. Select **"Use the following DNS server addresses"**
5. Enter:
   - **Preferred DNS:** `8.8.8.8`
   - **Alternate DNS:** `1.1.1.1`
6. Click **OK** → **OK**

### Step 2: Flush DNS Cache

```powershell
ipconfig /flushdns
```

### Step 3: Test R2 Connection

```powershell
node test-r2-apac.js
```

You should see:
```
✅ Successfully connected to R2!
✅ Test file uploaded successfully!
🎉 All tests passed!
```

### Step 4: Restart Your App

```powershell
npm run dev
```

### Step 5: Upload a Test Image

Upload an image through your app and check the console for:
```
✅ [R2] Image uploaded successfully: https://pub-...
```

## Alternative: Use Mobile Hotspot

If you can't change DNS:
1. Connect to mobile hotspot
2. Run `node test-r2-apac.js`
3. Run your app

## Need Help?

See `FIX_DNS_BLOCK.md` for detailed instructions.
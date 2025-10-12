# Delhivery API Troubleshooting Guide

## Current Error
```
"rmk": "shipment list contains no data."
"success": false
"error": true
```

## Most Common Causes (in order of likelihood)

### 1. ⚠️ Pickup Location Not Registered (MOST LIKELY)
**Symptom:** API returns "shipment list contains no data"

**Why:** Delhivery validates the `pickup_location` field against registered warehouses. If the name doesn't match EXACTLY (case-sensitive), the shipment is silently rejected.

**How to Fix:**
1. Log in to Delhivery Dashboard: https://track.delhivery.com/
2. Navigate to: Settings → Warehouses/Pickup Locations
3. Find your registered warehouse name
4. Copy the EXACT name (including spaces, case)
5. Update `.env` file:
   ```env
   DELHIVERY_PICKUP_LOCATION=<exact name from dashboard>
   ```

**Example Issues:**
- Dashboard has: `"Blink Each Warehouse"` but `.env` has: `"Blink Each"` ❌
- Dashboard has: `"BLINK EACH"` but `.env` has: `"Blink Each"` ❌
- Dashboard has: `"Blink Each"` and `.env` has: `"Blink Each"` ✅

### 2. ⚠️ API Key Permissions
**Symptom:** API returns "shipment list contains no data" or "unauthorized"

**Why:** The API key might not have permission to create shipments, or it's a test key being used on production.

**How to Fix:**
1. Log in to Delhivery Dashboard
2. Navigate to: Settings → API Keys
3. Check if the key has "Create Shipment" permission
4. Verify it's a production key (not staging/test)
5. If needed, regenerate the key and update `.env`:
   ```env
   DELHIVERY_API_KEY=<new key>
   ```

### 3. ⚠️ Account Not Activated for API
**Symptom:** API returns "shipment list contains no data"

**Why:** Your Delhivery account might not be activated for API access, or COD might not be enabled.

**How to Fix:**
1. Contact Delhivery support: support@delhivery.com
2. Ask them to:
   - Activate API access for your account
   - Enable COD shipments
   - Verify your pickup location is registered
3. Provide them with:
   - Your client name: `BLINK EACH`
   - Your API key (last 8 digits): `29c6d080`
   - The error message you're receiving

### 4. ⚠️ Missing Required Fields
**Symptom:** API returns "shipment list contains no data"

**Why:** Some required fields might be missing or in the wrong format.

**Already Fixed:**
- ✅ Added `shipment_length` field
- ✅ Converted all numeric fields to strings
- ✅ Removed `cod` boolean field
- ✅ Added `payment_mode` field
- ✅ Sanitized special characters

**Still Need to Verify:**
- GST fields (might be required for your account)
- E-waybill (required if order value > ₹50,000)

## Quick Test: Verify Pickup Location

### Option 1: Check via Delhivery Dashboard
1. Go to: https://track.delhivery.com/
2. Login with your credentials
3. Navigate to: Settings → Warehouses
4. Look for your warehouse
5. Copy the exact name

### Option 2: Contact Delhivery Support
Send them this email:

```
Subject: Verify Pickup Location Name for API Integration

Hi Delhivery Support,

I'm integrating with your API and getting "shipment list contains no data" error.

My details:
- Client Name: BLINK EACH
- API Key (last 8 digits): 29c6d080
- Pickup Location in .env: "Blink Each"

Can you please confirm:
1. Is my account activated for API access?
2. What is the exact pickup location name I should use?
3. Is COD enabled for my account?
4. Are there any other requirements I'm missing?

Thank you!
```

## Testing the Fix

### Step 1: Update .env File
Once you have the correct pickup location name:

```env
# Update this line with the EXACT name from Delhivery
DELHIVERY_PICKUP_LOCATION=<exact name>

# Also verify these:
DELHIVERY_CLIENT_NAME=BLINK EACH
DELHIVERY_API_KEY=bd2d6ce96269d88ed7ae8961bdaf2e5829c6d080
```

### Step 2: Restart the Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 3: Create a Test Order
1. Go to your website
2. Add a product to cart
3. Place an order
4. Go to admin panel
5. Change order status to "processing"

### Step 4: Check the Logs
Look for these in the console:

**Success:**
```
✅ ========== SHIPMENT CREATED SUCCESSFULLY ==========
   - Waybill/Tracking ID: <tracking number>
   - Tracking URL: <url>
```

**Failure:**
```
❌ ========== SHIPMENT CREATION FAILED ==========
   - Message: shipment list contains no data.
   
⚠️ POSSIBLE CAUSES:
   1. Pickup location "Blink Each" may not be registered with Delhivery
   2. Client name "BLINK EACH" may not match the registered name
```

## Alternative: Try with Full Address

If the pickup location name doesn't work, try using the full address:

```env
DELHIVERY_PICKUP_LOCATION=WARD NO. 07, KB LANE, NEAR CHAURAHA MASJID, PANCHAYATI AKHARA, GAYA, BIHAR, 823001
```

Some Delhivery accounts are configured to use the full address instead of a warehouse name.

## Direct API Test (Advanced)

If you want to test the API directly without the application:

### Using cURL:
```bash
curl -X POST "https://track.delhivery.com/api/cmu/create.json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Token bd2d6ce96269d88ed7ae8961bdaf2e5829c6d080" \
  -H "Accept: application/json" \
  -d "format=json" \
  -d 'data={"shipments":[{"name":"Test User","address":"Test Address","pin":"500016","city":"Hyderabad","state":"Telangana","country":"India","phone":"8709144545","order":"TEST123","products_desc":"Test Product","payment_mode":"COD","cod_amount":"100.00","order_date":"2025-01-11","total_amount":"100.00","seller_address":"WARD NO. 07, KB LANE, NEAR CHAURAHA MASJID, PANCHAYATI AKHARA, GAYA (BIHAR) 823001","seller_name":"BLINK EACH","seller_inv":"INV-TEST-123","quantity":"1","waybill":"","shipment_width":"10","shipment_height":"10","shipment_length":"10","weight":"1","seller_gst_tin":"","shipping_mode":"Surface","address_type":"home","client":"BLINK EACH","pickup_location":"Blink Each"}]}'
```

### Using Postman:
1. Method: POST
2. URL: `https://track.delhivery.com/api/cmu/create.json`
3. Headers:
   - `Content-Type`: `application/x-www-form-urlencoded`
   - `Authorization`: `Token bd2d6ce96269d88ed7ae8961bdaf2e5829c6d080`
   - `Accept`: `application/json`
4. Body (x-www-form-urlencoded):
   - `format`: `json`
   - `data`: `<paste the shipment JSON>`

## Expected Response

### Success:
```json
{
  "success": true,
  "packages": [
    {
      "waybill": "1234567890",
      "status": "Success"
    }
  ],
  "upload_wbn": "1234567890"
}
```

### Failure (Current):
```json
{
  "success": false,
  "error": true,
  "rmk": "shipment list contains no data.",
  "package_count": 0
}
```

## Next Steps

1. **Immediate:** Verify pickup location name from Delhivery dashboard
2. **If not accessible:** Contact Delhivery support
3. **After fixing:** Test with a new order
4. **If still failing:** Share the full request/response with Delhivery support

## Support Contacts

- **Delhivery Support Email:** support@delhivery.com
- **Delhivery API Support:** api.support@delhivery.com
- **Delhivery Phone:** +91-11-46155555

## Summary of Code Changes Made

✅ **Fixed:**
1. Added `shipment_length` field (was missing)
2. Converted all numeric fields to strings
3. Removed `cod` boolean field
4. Added proper `payment_mode` field
5. Sanitized special characters from addresses
6. Enhanced error logging

⚠️ **Still Need to Verify:**
1. Pickup location name matches Delhivery registration
2. API key has correct permissions
3. Account is activated for API access
4. COD is enabled for the account

**Most likely issue:** Pickup location name mismatch. Please verify this first!
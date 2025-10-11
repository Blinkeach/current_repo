# 🔧 Delhivery API Troubleshooting Guide

**Issue:** "shipment list contains no data" error  
**Status:** 🔄 Investigating and fixing  
**Last Updated:** January 2025

---

## 🚨 Current Problem

Despite having the correct configuration, Delhivery API is returning:

```json
{
  "rmk": "shipment list contains no data.",
  "success": false,
  "error": true
}
```

---

## ✅ What We've Fixed (Latest Changes)

### 1. **Data Type Corrections**

**Problem:** Delhivery API might be strict about data types. Some fields were sent as numbers instead of strings.

**Fix Applied:**
- ✅ `cod_amount`: Changed from number to string
- ✅ `total_amount`: Changed from number to string
- ✅ `quantity`: Changed from number to string
- ✅ `weight`: Changed from number to string
- ✅ `shipment_width`: Changed from number to string
- ✅ `shipment_height`: Changed from number to string

### 2. **Invoice Number Added**

**Problem:** `seller_inv` field was empty, which might be required by Delhivery.

**Fix Applied:**
- ✅ Auto-generate invoice number: `INV-{orderId}-{timestamp}`
- ✅ Example: `INV-5-1736462037175`

### 3. **Seller Information Consistency**

**Problem:** `seller_name` was hardcoded as "Blinkeach" instead of using the registered client name.

**Fix Applied:**
- ✅ `seller_name`: Now uses `DELHIVERY_CLIENT_NAME` from `.env`
- ✅ `seller_add`: Now uses `DELHIVERY_PICKUP_LOCATION` from `.env`

### 4. **Shipping Mode Changed**

**Problem:** "Express" shipping mode might not be available for all pickup locations.

**Fix Applied:**
- ✅ Changed from `Express` to `Surface` (more widely available)

---

## 🔍 Possible Root Causes

### 1. **Pickup Location Not Registered**

**Symptom:** "shipment list contains no data"

**Explanation:**
- Delhivery requires pickup locations to be registered in their system
- Even if you have the correct address, it must be registered as a warehouse

**How to Check:**
1. Login to https://one.delhivery.com/
2. Go to **Warehouses** → **Pickup Locations**
3. Verify that "WARD NO. 07, KB LANE, NEAR CHAURAHA MASJID, PANCHAYATI AKHARA,GAYA (BIHAR) 823001" is listed
4. Check if the name matches **exactly** (case-sensitive)

**How to Fix:**
1. If not registered, click **Add Warehouse**
2. Enter the exact address
3. Set the warehouse name to match your `.env` configuration
4. Wait for Delhivery to verify the location (may take 24-48 hours)

### 2. **API Key Permissions**

**Symptom:** "shipment list contains no data" or "unauthorized"

**Explanation:**
- The API key might be for a different environment (staging vs production)
- The API key might not have permission to create shipments

**How to Check:**
1. Login to https://one.delhivery.com/
2. Go to **Settings** → **API Keys**
3. Verify the API key is for **Production** environment
4. Check that it has **Create Shipment** permission

**How to Fix:**
1. Generate a new API key with correct permissions
2. Update `.env` file with the new key
3. Restart server

### 3. **Client Name Mismatch**

**Symptom:** "shipment list contains no data" or "invalid client"

**Explanation:**
- Delhivery requires the client name to match exactly (case-sensitive)
- Even a single space difference will cause rejection

**How to Check:**
1. Login to https://one.delhivery.com/
2. Go to **Settings** → **Company Details**
3. Copy the **exact** client name shown

**Current Configuration:**
```env
DELHIVERY_CLIENT_NAME=BLINK EACH
```

**Verify:** Does this match your dashboard **exactly**?

### 4. **COD Service Not Enabled**

**Symptom:** "shipment list contains no data" for COD orders only

**Explanation:**
- COD (Cash on Delivery) service must be enabled separately
- Your account might only support Prepaid orders

**How to Check:**
1. Login to https://one.delhivery.com/
2. Go to **Settings** → **Services**
3. Check if **COD** is enabled

**How to Fix:**
1. Contact Delhivery support to enable COD
2. Or test with a Prepaid order first

### 5. **Pincode Serviceability**

**Symptom:** "shipment list contains no data" for specific pincodes

**Explanation:**
- Delhivery might not service the delivery pincode
- The pickup pincode might not be serviceable

**How to Check:**
1. Use Delhivery's pincode checker: https://www.delhivery.com/pincode-checker
2. Enter delivery pincode: `500016`
3. Enter pickup pincode: `823001`

**How to Fix:**
- If pincode is not serviceable, you'll need to use a different courier
- Or contact Delhivery to enable service for that pincode

---

## 🧪 Testing Steps

### Step 1: Restart Server

**CRITICAL:** You must restart the server to load the new code changes.

```powershell
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 2: Test Order #5 Again

1. Go to **Admin Panel** → **Orders**
2. Find **Order #5**
3. Change status back to "Pending" (if needed)
4. Then change status to **"Shipped"**
5. Watch the server logs carefully

### Step 3: Check New Logs

You should now see:

```
📋 Delhivery Shipment Details:
   - Invoice Number: INV-5-1736462037175
   - Client: BLINK EACH
   - Pickup Location: WARD NO. 07, KB LANE...
   - Seller Address: WARD NO. 07, KB LANE...

📦 Full Shipment Data: {
  "shipment": [{
    "seller_inv": "INV-5-1736462037175",
    "seller_name": "BLINK EACH",
    "seller_add": "WARD NO. 07, KB LANE...",
    "cod_amount": "11.44",
    "total_amount": "11.44",
    "quantity": "1",
    "weight": "1",
    "shipping_mode": "Surface"
  }]
}
```

### Step 4: Analyze Response

**If Success:**
```json
{
  "success": true,
  "packages": [{
    "waybill": "XXXXXXXXXX",
    "status": "Success"
  }]
}
```

**If Still Failing:**
```json
{
  "rmk": "shipment list contains no data.",
  "success": false
}
```

---

## 🔧 Advanced Debugging

### Option 1: Test with Delhivery's API Tester

1. Go to https://one.delhivery.com/api-tester
2. Select **Create Shipment** API
3. Fill in the same data we're sending
4. Click **Test**
5. Compare the response with our server logs

### Option 2: Contact Delhivery Support

If the issue persists, contact Delhivery support with:

**Subject:** "API Error: shipment list contains no data"

**Details to Provide:**
- Client Name: `BLINK EACH`
- API Key: `***29c6d080` (last 8 digits)
- Pickup Location: `WARD NO. 07, KB LANE, NEAR CHAURAHA MASJID, PANCHAYATI AKHARA,GAYA (BIHAR) 823001`
- Error Message: "shipment list contains no data"
- Request Payload: (copy from server logs)

**Delhivery Support:**
- Email: support@delhivery.com
- Phone: +91-11-46516000
- Dashboard: https://one.delhivery.com/support

### Option 3: Verify Pickup Location Registration

Run this test to check if your pickup location is registered:

```bash
curl -X GET "https://track.delhivery.com/api/backend/clientwarehouse/all/" \
  -H "Authorization: Token bd2d6ce96269d88ed7ae8961bdaf2e5829c6d080" \
  -H "Accept: application/json"
```

This will list all registered warehouses for your account.

---

## 📋 Checklist Before Contacting Support

- [ ] ✅ API key is correct and from production environment
- [ ] ✅ Client name matches dashboard exactly (case-sensitive)
- [ ] ✅ Pickup location is registered in Delhivery dashboard
- [ ] ✅ COD service is enabled (if testing COD orders)
- [ ] ✅ Delivery pincode is serviceable by Delhivery
- [ ] ✅ Pickup pincode is serviceable by Delhivery
- [ ] ✅ Server has been restarted after `.env` changes
- [ ] ✅ All required fields are present in shipment data
- [ ] ✅ Data types are correct (strings vs numbers)
- [ ] ✅ Invoice number is generated
- [ ] ✅ Seller information matches client information

---

## 🎯 What Changed in Latest Fix

### File: `server/services/delivery.ts`

**Changes Made:**

1. **Line 177:** Added invoice number generation
   ```typescript
   const invoiceNumber = `INV-${request.orderId}-${Date.now()}`;
   ```

2. **Line 191:** Convert `cod_amount` to string
   ```typescript
   cod_amount: request.isCod ? (request.orderValue / 100).toString() : '0'
   ```

3. **Line 193:** Convert `total_amount` to string
   ```typescript
   total_amount: (request.orderValue / 100).toString()
   ```

4. **Line 194:** Use pickup location as seller address
   ```typescript
   seller_add: pickupLocation
   ```

5. **Line 195:** Use client name as seller name
   ```typescript
   seller_name: clientName
   ```

6. **Line 196:** Add invoice number
   ```typescript
   seller_inv: invoiceNumber
   ```

7. **Line 197:** Convert quantity to string
   ```typescript
   quantity: request.items.reduce((total, item) => total + item.quantity, 0).toString()
   ```

8. **Lines 199-201:** Convert dimensions and weight to strings
   ```typescript
   shipment_width: (request.dimensions?.width || 10).toString(),
   shipment_height: (request.dimensions?.height || 10).toString(),
   weight: request.weight.toString()
   ```

9. **Line 203:** Change shipping mode to Surface
   ```typescript
   shipping_mode: 'Surface'
   ```

10. **Lines 221-224:** Enhanced logging
    ```typescript
    console.log('   - Invoice Number:', invoiceNumber);
    console.log('   - Seller Address:', pickupLocation);
    ```

---

## 🚀 Next Steps

1. **✅ Restart Server** - Load the new code changes
2. **✅ Test Order #5** - Try creating shipment again
3. **✅ Check Logs** - Verify new fields are being sent
4. **✅ Verify Pickup Location** - Ensure it's registered in Delhivery
5. **✅ Contact Support** - If issue persists, contact Delhivery with details

---

## 📊 Expected vs Actual

### Expected Behavior:
```json
{
  "success": true,
  "packages": [{
    "waybill": "XXXXXXXXXX",
    "status": "Success",
    "remarks": "Shipment created successfully"
  }]
}
```

### Current Behavior:
```json
{
  "rmk": "shipment list contains no data.",
  "success": false,
  "error": true
}
```

### Most Likely Cause:
**Pickup location not registered in Delhivery system**

---

## 🔐 Security Note

When contacting Delhivery support, **never share**:
- ❌ Full API key (only last 8 digits)
- ❌ Database credentials
- ❌ Session secrets
- ❌ Payment gateway keys

**Safe to share:**
- ✅ Client name
- ✅ Pickup location address
- ✅ Last 8 digits of API key
- ✅ Error messages
- ✅ Request payload (without sensitive data)

---

**Status:** 🔄 Awaiting test results after latest fixes  
**Priority:** 🔴 HIGH - Blocking shipment creation  
**Next Action:** Restart server and test Order #5
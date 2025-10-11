# Razorpay & Delivery API - Credentials Testing Guide

## 🔐 Credentials Added

### Razorpay (Live Mode)
- **Key ID**: `rzp_live_R6geaHp283s445`
- **Key Secret**: `et4XEFk1YS1B8KTWzFAfEHb5`
- **Mode**: LIVE (Production)

### Delhivery API
- **API Key**: `f718c08b4638f9db69adac77bd2881e355bfb620`
- **Base URL**: `https://track.delhivery.com/api`

## 📝 Files Modified

1. **`.env`** - Updated with live credentials
2. **`server/controllers/payment.ts`** - Enhanced with detailed console logs
3. **`client/src/lib/razorpay.ts`** - Enhanced with detailed console logs
4. **`server/services/delivery.ts`** - Enhanced with detailed console logs

## 🧪 Testing Instructions

### Step 1: Verify Credentials Configuration

Run the test script to verify all credentials are properly loaded:

```bash
node test-credentials.js
```

Expected output:
```
✅ RAZORPAY_KEY_ID is set
   Mode: 🟢 LIVE MODE
✅ RAZORPAY_KEY_SECRET is set
✅ VITE_RAZORPAY_KEY_ID is set
✅ DELHIVERY_API_KEY is set
✅ DELHIVERY_BASE_URL is set
🎉 All credentials are properly configured!
```

### Step 2: Start the Development Server

```bash
npm run dev
```

### Step 3: Monitor Console Logs

#### Server Console Logs (Backend)

When the server starts, you should see:
```
🔐 Razorpay Configuration Status:
   - Key ID: rzp_live_R6geaH...
   - Key Secret: ***EHb5
   - Environment: development
   - Mode: LIVE
✅ Razorpay instance initialized successfully
```

#### Payment Flow Console Logs

**When creating an order:**
```
💳 ========== RAZORPAY ORDER CREATION STARTED ==========
⏰ Timestamp: [timestamp]
📦 Order Request Data:
   - User ID: [userId]
   - User Name: [userName]
   - Total Amount (paisa): [amount]
   ...
💰 Razorpay Discount Calculation:
   - Original Amount: ₹[amount]
   - Discount Percentage: [1% or 5%]
   - Final Amount: ₹[finalAmount]
🌐 Calling Razorpay API to create order...
✅ Razorpay Order Created Successfully!
   - Order ID: [orderId]
   - Amount: [amount]
   - Status: created
💳 ========== RAZORPAY ORDER CREATION COMPLETED ==========
```

**When verifying payment:**
```
🔐 ========== RAZORPAY PAYMENT VERIFICATION STARTED ==========
📥 Payment Verification Request:
   - Payment ID: [paymentId]
   - Order ID: [orderId]
   - Signature: [signature...]
🔑 Verifying payment signature...
   - Signature Match: ✅ YES
✅ Payment signature verified successfully!
💾 Updating order in database...
✅ Order status updated successfully
🔐 ========== PAYMENT VERIFICATION COMPLETED ==========
```

#### Browser Console Logs (Frontend)

**When creating an order:**
```
💳 [CLIENT] ========== CREATING RAZORPAY ORDER ==========
📦 [CLIENT] Order Details:
   - User ID: [userId]
   - Total Amount (paisa): [amount]
🌐 [CLIENT] Sending request to server...
✅ [CLIENT] Order created successfully!
   - Razorpay Order ID: [orderId]
```

**When initiating payment:**
```
🚀 [CLIENT] ========== INITIATING RAZORPAY PAYMENT ==========
📋 [CLIENT] Payment Options:
   - Key: rzp_live_R6geaH...
   - Amount: [amount]
   - Order ID: [orderId]
✅ [CLIENT] Razorpay SDK loaded successfully
✅ [CLIENT] Payment modal opened successfully
```

**When verifying payment:**
```
🔐 [CLIENT] ========== VERIFYING PAYMENT ==========
📥 [CLIENT] Payment Data:
   - Payment ID: [paymentId]
   - Order ID: [orderId]
✅ [CLIENT] Payment verified successfully!
```

#### Delivery Service Console Logs

**When creating a shipment:**
```
📦 ========== DELIVERY SERVICE INITIALIZATION ==========
🚚 Delivery Configuration:
   - Partner: delhivery
   - Service Name: Delhivery
   - API Key: ***[last8chars]
✅ Delhivery API key configured successfully

📮 ========== DELHIVERY SHIPMENT CREATION ==========
📋 Delhivery Shipment Details:
   - Recipient: [name]
   - Phone: [phone]
   - Address: [address]
   - Order Value: ₹[amount]
   - COD: [YES/NO]
🌐 Sending request to Delhivery API...
📡 Delhivery API Response:
   - Status Code: [statusCode]
✅ ========== SHIPMENT CREATED SUCCESSFULLY ==========
   - Waybill/Tracking ID: [trackingId]
   - Tracking URL: [url]
```

**When tracking a shipment:**
```
🔍 ========== DELHIVERY TRACKING INFO ==========
📮 Getting tracking info for waybill: [waybill]
🌐 Sending request to Delhivery API...
📡 Delhivery API Response:
   - Status Code: [statusCode]
✅ ========== TRACKING INFO RETRIEVED ==========
   - Status: [status]
   - Current Location: [location]
   - Updates Count: [count]
```

## 🎯 Testing Scenarios

### Scenario 1: Test Razorpay Payment (Small Order)

1. Add items to cart (total < ₹1,000)
2. Proceed to checkout
3. Select "Razorpay" payment method
4. Complete the order
5. **Expected**: 1% discount applied
6. **Check Console**: Look for discount calculation logs

### Scenario 2: Test Razorpay Payment (Large Order)

1. Add items to cart (total ≥ ₹1,000)
2. Proceed to checkout
3. Select "Razorpay" payment method
4. Complete the order
5. **Expected**: 5% discount applied
6. **Check Console**: Look for discount calculation logs

### Scenario 3: Test Payment Verification

1. Complete a payment
2. **Check Server Console**: Look for signature verification logs
3. **Expected**: Signature match should be ✅ YES
4. Order status should update to "processing"

### Scenario 4: Test Delivery Integration

1. Place an order (COD or Razorpay)
2. Admin marks order as "shipped"
3. **Check Server Console**: Look for Delhivery shipment creation logs
4. **Expected**: Waybill/Tracking ID should be generated
5. Tracking URL should be available

### Scenario 5: Test Order Tracking

1. Use a valid waybill number
2. Track the order
3. **Check Server Console**: Look for tracking info logs
4. **Expected**: Current status and location should be displayed

## 🐛 Troubleshooting

### Issue: Razorpay order creation fails

**Check:**
- Server console for error messages
- Verify API keys are correct in `.env`
- Ensure Razorpay account is active

**Look for:**
```
❌ ========== RAZORPAY ORDER CREATION FAILED ==========
Error details: [error message]
```

### Issue: Payment verification fails

**Check:**
- Signature verification logs
- Ensure key secret matches the key ID

**Look for:**
```
❌ ========== PAYMENT VERIFICATION FAILED ==========
Reason: Invalid signature
```

### Issue: Delhivery shipment creation fails

**Check:**
- Delhivery API key is correct
- Shipment data is properly formatted
- Address details are complete

**Look for:**
```
❌ ========== SHIPMENT CREATION FAILED ==========
Message: [error message]
Errors: [error details]
```

### Issue: No console logs appearing

**Check:**
1. Server is running: `npm run dev`
2. Browser console is open (F12)
3. Console filters are not hiding logs

## 📊 Log Levels

All logs are categorized with emojis for easy identification:

- 🔐 **Security/Authentication**: Razorpay keys, signatures
- 💳 **Payment**: Order creation, verification
- 📦 **Delivery**: Shipment creation, tracking
- ✅ **Success**: Operations completed successfully
- ❌ **Error**: Operations failed
- ⚠️ **Warning**: Non-critical issues
- 🌐 **Network**: API calls
- 💾 **Database**: Data operations
- 📋 **Data**: Request/response details

## 🔒 Security Notes

1. **Never commit `.env` file** to version control
2. **Rotate keys regularly** for security
3. **Use test keys** in development when possible
4. **Monitor logs** for suspicious activity
5. **Validate all inputs** before processing

## 📞 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all credentials are correct
3. Ensure your Razorpay account is active and has live mode enabled
4. Verify Delhivery API key has proper permissions

## ✅ Success Checklist

- [ ] Credentials test script passes
- [ ] Server starts without errors
- [ ] Razorpay configuration logs show LIVE mode
- [ ] Delhivery API key is configured
- [ ] Payment order creation works
- [ ] Payment verification works
- [ ] Shipment creation works
- [ ] Order tracking works
- [ ] All console logs are visible and detailed

---

**Last Updated**: [Current Date]
**Status**: ✅ Ready for Testing
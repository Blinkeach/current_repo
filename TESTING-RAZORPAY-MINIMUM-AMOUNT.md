# 🧪 Testing Guide: Razorpay Minimum Amount Validation

## 📋 Overview

This guide will help you test the Razorpay minimum amount validation fix to ensure orders below ₹1.00 are properly rejected with clear error messages.

---

## 🎯 What We're Testing

1. ✅ Orders below ₹1.00 are rejected with user-friendly error
2. ✅ Orders at exactly ₹1.00 are handled correctly
3. ✅ Orders above ₹1.00 proceed normally
4. ✅ Error messages are clear and actionable
5. ✅ Console logs provide debugging information
6. ✅ No unnecessary API calls are made

---

## 🚀 Pre-Testing Setup

### Step 1: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart to load the updated code
npm run dev
```

### Step 2: Open Browser DevTools
```bash
# Press F12 to open DevTools
# Go to Console tab to see logs
# Go to Network tab to monitor API calls
```

### Step 3: Clear Browser Cache
```bash
# Press Ctrl+Shift+Delete
# Clear cached images and files
# Or use Incognito/Private mode
```

---

## 🧪 Test Cases

### **Test Case 1: Order Below Minimum (₹0.01)**

**Objective:** Verify that orders below ₹1.00 are rejected with a clear error message.

**Steps:**
1. Add a product with price ₹0.01 to cart (or modify product price in database)
2. Go to checkout page
3. Fill in shipping details
4. Select "Razorpay" as payment method
5. Click "Proceed to Payment"

**Expected Results:**
```
✅ Error toast appears immediately (no loading delay)
✅ Toast title: "Order Amount Too Low"
✅ Toast message: "Minimum order amount for online payment is ₹1.00. 
   Your current total is ₹0.01. Please add more items or use Cash on Delivery."
✅ User is redirected back to checkout page
✅ No API call to /api/payment/create-order in Network tab
✅ No Razorpay payment UI opens
```

**Console Logs (Frontend):**
```javascript
Payment calculation: {
  isBuyNow: false,
  totalPrice: 1,
  subtotal: 0.01,
  deliveryCharge: 40,
  universalDiscount: 40,
  total: 0.01,
  totalInPaisa: 1
}
Starting payment initialization...
// Should stop here - no further logs
```

**Screenshot Checklist:**
- [ ] Error toast is visible
- [ ] Error message is clear and readable
- [ ] User is on checkout page (not payment page)
- [ ] No Razorpay UI opened

---

### **Test Case 2: Order at Minimum (₹1.00)**

**Objective:** Verify that orders at exactly ₹1.00 are handled correctly.

**Steps:**
1. Add products totaling ₹41.00 to cart
   - Subtotal: ₹41.00
   - Delivery: +₹40.00
   - Discount: -₹40.00
   - Total: ₹41.00
2. Go to checkout page
3. Fill in shipping details
4. Select "Razorpay" as payment method
5. Click "Proceed to Payment"

**Expected Results:**
```
✅ Frontend validation passes (₹41.00 > ₹1.00)
✅ API call to /api/payment/create-order is made
✅ Backend applies 1% discount: ₹41.00 - ₹0.41 = ₹40.59
✅ Backend validation fails (₹40.59 < ₹1.00 after discount)
✅ Backend returns 400 error with clear message
✅ User sees error toast
```

**Console Logs (Backend):**
```
💳 ========== RAZORPAY ORDER CREATION STARTED ==========
📦 Order Request Data:
   - Total Amount (paisa): 4100
💰 Razorpay Discount Calculation:
   - Original Amount: ₹41.00
   - Discount Percentage: 1%
   - Discount Amount: ₹0.41
   - Final Amount: ₹40.59
❌ Order amount below Razorpay minimum
   - Final Amount: ₹40.59
   - Minimum Required: ₹1.00
```

**API Response:**
```json
{
  "message": "Order amount must be at least ₹1.00. Current amount after discount: ₹40.59",
  "minimumAmount": 100,
  "currentAmount": 4059
}
```

---

### **Test Case 3: Order Above Minimum (₹100.00)**

**Objective:** Verify that normal orders proceed without issues.

**Steps:**
1. Add products totaling ₹100.00 to cart
2. Go to checkout page
3. Fill in shipping details
4. Select "Razorpay" as payment method
5. Click "Proceed to Payment"

**Expected Results:**
```
✅ Frontend validation passes
✅ API call to /api/payment/create-order is made
✅ Backend applies 1% discount: ₹100.00 - ₹1.00 = ₹99.00
✅ Backend validation passes (₹99.00 > ₹1.00)
✅ Razorpay order created successfully
✅ Razorpay payment UI opens
✅ User can complete payment
```

**Console Logs (Backend):**
```
💳 ========== RAZORPAY ORDER CREATION STARTED ==========
📦 Order Request Data:
   - Total Amount (paisa): 10000
💰 Razorpay Discount Calculation:
   - Original Amount: ₹100.00
   - Discount Percentage: 1%
   - Discount Amount: ₹1.00
   - Final Amount: ₹99.00
🌐 Calling Razorpay API to create order...
✅ Razorpay Order Created Successfully!
   - Order ID: order_xyz123
   - Amount: 9900
   - Currency: INR
   - Status: created
💳 ========== RAZORPAY ORDER CREATION COMPLETED ==========
```

**Screenshot Checklist:**
- [ ] Razorpay payment UI is visible
- [ ] Amount shown is ₹99.00 (after 1% discount)
- [ ] Payment options are available
- [ ] No error messages

---

### **Test Case 4: Large Order (₹1000+)**

**Objective:** Verify that large orders get 5% discount and proceed normally.

**Steps:**
1. Add products totaling ₹1000.00 to cart
2. Go to checkout page
3. Fill in shipping details
4. Select "Razorpay" as payment method
5. Click "Proceed to Payment"

**Expected Results:**
```
✅ Frontend validation passes
✅ API call to /api/payment/create-order is made
✅ Backend applies 5% discount: ₹1000.00 - ₹50.00 = ₹950.00
✅ Backend validation passes (₹950.00 > ₹1.00)
✅ Razorpay order created successfully
✅ Razorpay payment UI opens with ₹950.00
```

**Console Logs (Backend):**
```
💰 Razorpay Discount Calculation:
   - Original Amount: ₹1000.00
   - Discount Percentage: 5%
   - Discount Amount: ₹50.00
   - Final Amount: ₹950.00
```

---

### **Test Case 5: Cash on Delivery (Alternative)**

**Objective:** Verify that COD works for small orders.

**Steps:**
1. Add products totaling ₹0.01 to cart
2. Go to checkout page
3. Fill in shipping details
4. Select "Cash on Delivery" as payment method
5. Click "Place Order"

**Expected Results:**
```
✅ Order is created successfully
✅ COD fee (₹10) is added
✅ Final amount: ₹0.01 + ₹10.00 = ₹10.01
✅ Order status: "pending"
✅ User sees success message
✅ No Razorpay validation applies
```

---

## 📊 Test Results Matrix

| Test Case | Amount | Frontend | Backend | Razorpay | Result |
|-----------|--------|----------|---------|----------|--------|
| 1. Below Min | ₹0.01 | ❌ Reject | N/A | N/A | ❌ Error |
| 2. At Min | ₹41.00 | ✅ Pass | ❌ Reject | N/A | ❌ Error |
| 3. Above Min | ₹100.00 | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Success |
| 4. Large Order | ₹1000.00 | ✅ Pass | ✅ Pass | ✅ Pass | ✅ Success |
| 5. COD | ₹0.01 | N/A | ✅ Pass | N/A | ✅ Success |

---

## 🔍 Debugging Checklist

### If Frontend Validation Doesn't Work:
- [ ] Check if `RazorpayPayment.tsx` has the validation code
- [ ] Verify `totalInPaisa` is calculated correctly
- [ ] Check browser console for JavaScript errors
- [ ] Clear browser cache and reload
- [ ] Verify `RAZORPAY_MIN_AMOUNT` constant is set to 100

### If Backend Validation Doesn't Work:
- [ ] Check if `payment.ts` has the validation code
- [ ] Verify server was restarted after code changes
- [ ] Check server console logs
- [ ] Verify `finalAmount` is calculated correctly
- [ ] Check if discount is applied before validation

### If Error Messages Don't Appear:
- [ ] Check if toast notifications are working
- [ ] Verify `useToast` hook is imported
- [ ] Check browser console for React errors
- [ ] Verify error message text is correct

---

## 📝 Test Report Template

```markdown
## Razorpay Minimum Amount Validation - Test Report

**Date:** [Date]
**Tester:** [Your Name]
**Environment:** Development / Staging / Production

### Test Results:

#### Test Case 1: Order Below Minimum (₹0.01)
- [ ] PASS / [ ] FAIL
- Notes: _______________________________________

#### Test Case 2: Order at Minimum (₹1.00)
- [ ] PASS / [ ] FAIL
- Notes: _______________________________________

#### Test Case 3: Order Above Minimum (₹100.00)
- [ ] PASS / [ ] FAIL
- Notes: _______________________________________

#### Test Case 4: Large Order (₹1000+)
- [ ] PASS / [ ] FAIL
- Notes: _______________________________________

#### Test Case 5: Cash on Delivery
- [ ] PASS / [ ] FAIL
- Notes: _______________________________________

### Overall Status:
- [ ] All tests passed
- [ ] Some tests failed (see notes)
- [ ] Ready for production
- [ ] Needs fixes

### Screenshots:
- [ ] Error toast for below minimum
- [ ] Razorpay UI for normal order
- [ ] Console logs for debugging

### Additional Notes:
_________________________________________________
_________________________________________________
```

---

## 🎯 Acceptance Criteria

✅ **All tests must pass before deployment:**

1. [ ] Orders below ₹1.00 show clear error message
2. [ ] Error message suggests adding more items or using COD
3. [ ] No API calls made for invalid amounts (frontend validation)
4. [ ] Backend validation prevents invalid Razorpay API calls
5. [ ] Console logs provide clear debugging information
6. [ ] Normal orders (₹100+) proceed without issues
7. [ ] Large orders (₹1000+) get 5% discount correctly
8. [ ] COD works as alternative for small orders
9. [ ] No 500 errors for minimum amount violations
10. [ ] User experience is smooth and intuitive

---

## 🚀 Post-Testing Actions

### If All Tests Pass:
1. ✅ Mark feature as "Ready for Production"
2. ✅ Update deployment checklist
3. ✅ Notify QA team
4. ✅ Schedule production deployment

### If Tests Fail:
1. ❌ Document failures in test report
2. ❌ Create bug tickets with screenshots
3. ❌ Review code changes
4. ❌ Fix issues and re-test

---

## 📚 Related Documentation

- `RAZORPAY-MINIMUM-AMOUNT-FIX.md` - Technical details
- `QUICK-FIX-SUMMARY.md` - Quick overview
- `RAZORPAY-AMOUNT-VALIDATION-DIAGRAM.md` - Visual guide

---

## 💡 Tips for Testers

1. **Use Browser DevTools:** Keep Console and Network tabs open
2. **Test Multiple Scenarios:** Don't just test happy path
3. **Check Edge Cases:** Test exactly ₹1.00, ₹0.99, ₹1.01
4. **Verify Error Messages:** Ensure they're user-friendly
5. **Test on Different Devices:** Mobile, tablet, desktop
6. **Clear Cache:** Between tests to avoid stale data
7. **Document Everything:** Screenshots, logs, observations

---

## 🆘 Need Help?

If you encounter issues during testing:

1. Check the console logs (both frontend and backend)
2. Review the error messages
3. Verify the code changes are present
4. Ensure the server was restarted
5. Clear browser cache
6. Try in incognito mode
7. Contact the development team with:
   - Test case number
   - Screenshots
   - Console logs
   - Steps to reproduce

---

**Happy Testing! 🎉**

---

**Last Updated:** 2025-01-09  
**Version:** 1.0.0  
**Status:** Ready for Testing
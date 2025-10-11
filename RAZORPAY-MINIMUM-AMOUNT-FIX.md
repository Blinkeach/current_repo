# 🔧 Razorpay Minimum Amount Validation Fix

## 📋 Problem Summary

**Error:** `BAD_REQUEST_ERROR: Order amount less than minimum amount allowed`

**Root Cause:** Razorpay requires a minimum order amount of **₹1.00 (100 paisa)** for all transactions. Orders below this threshold are automatically rejected by the Razorpay API.

---

## ❌ What Was Happening

When users tried to create orders with very small amounts (e.g., ₹0.01), the following occurred:

1. **Frontend** calculated the total and sent it to the backend
2. **Backend** applied discounts (1% or 5%)
3. **Backend** tried to create a Razorpay order with the discounted amount
4. **Razorpay API** rejected the request with error code `BAD_REQUEST_ERROR`
5. **User** saw a generic "500 Internal Server Error" message

### Example Scenario:
```
Original Amount: ₹0.01 (1 paisa)
Discount (1%):   ₹0.00 (0 paisa)
Final Amount:    ₹0.01 (1 paisa)
❌ REJECTED: Below ₹1.00 minimum
```

---

## ✅ Solution Implemented

### **1. Backend Validation** (`server/controllers/payment.ts`)

Added validation **before** calling the Razorpay API:

```typescript
// Razorpay minimum order amount validation (₹1.00 = 100 paisa)
const RAZORPAY_MIN_AMOUNT = 100; // 100 paisa = ₹1.00
if (finalAmount < RAZORPAY_MIN_AMOUNT) {
  console.error('❌ Order amount below Razorpay minimum');
  console.error('   - Final Amount: ₹' + (finalAmount / 100).toFixed(2));
  console.error('   - Minimum Required: ₹' + (RAZORPAY_MIN_AMOUNT / 100).toFixed(2));
  return res.status(400).json({ 
    message: `Order amount must be at least ₹${(RAZORPAY_MIN_AMOUNT / 100).toFixed(2)}. Current amount after discount: ₹${(finalAmount / 100).toFixed(2)}`,
    minimumAmount: RAZORPAY_MIN_AMOUNT,
    currentAmount: finalAmount
  });
}
```

**Benefits:**
- ✅ Prevents unnecessary API calls to Razorpay
- ✅ Provides clear error messages with actual amounts
- ✅ Logs detailed information for debugging
- ✅ Returns proper HTTP 400 status code

---

### **2. Frontend Validation** (`client/src/components/checkout/RazorpayPayment.tsx`)

Added validation **before** initiating payment:

```typescript
// Razorpay minimum amount validation (₹1.00 = 100 paisa)
const RAZORPAY_MIN_AMOUNT = 100; // 100 paisa = ₹1.00
if (totalInPaisa < RAZORPAY_MIN_AMOUNT) {
  toast({
    title: "Order Amount Too Low",
    description: `Minimum order amount for online payment is ₹${(RAZORPAY_MIN_AMOUNT / 100).toFixed(2)}. Your current total is ₹${(totalInPaisa / 100).toFixed(2)}. Please add more items or use Cash on Delivery.`,
    variant: "destructive",
  });
  setLocation('/checkout');
  return;
}
```

**Benefits:**
- ✅ Immediate user feedback (no waiting for API call)
- ✅ User-friendly error message
- ✅ Suggests alternative payment method (COD)
- ✅ Redirects back to checkout page
- ✅ Prevents wasted network requests

---

## 📊 Validation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INITIATES PAYMENT                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND: Calculate Total Amount                │
│  • Subtotal + Delivery - Discounts = Total (in paisa)       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         FRONTEND VALIDATION: Check Minimum Amount            │
│  • Is totalInPaisa >= 100 (₹1.00)?                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
         ❌ BELOW ₹1.00              ✅ ABOVE ₹1.00
                │                           │
                ▼                           ▼
    ┌───────────────────────┐   ┌──────────────────────────┐
    │  Show Error Toast     │   │  Send to Backend API     │
    │  Redirect to Checkout │   └──────────────────────────┘
    └───────────────────────┘               │
                                            ▼
                            ┌──────────────────────────────┐
                            │  BACKEND: Apply Discounts    │
                            │  • 1% or 5% Razorpay discount│
                            └──────────────────────────────┘
                                            │
                                            ▼
                            ┌──────────────────────────────┐
                            │ BACKEND VALIDATION: Recheck  │
                            │ • Is finalAmount >= 100?     │
                            └──────────────────────────────┘
                                            │
                              ┌─────────────┴─────────────┐
                              │                           │
                              ▼                           ▼
                       ❌ BELOW ₹1.00              ✅ ABOVE ₹1.00
                              │                           │
                              ▼                           ▼
                  ┌───────────────────────┐   ┌──────────────────────────┐
                  │  Return 400 Error     │   │  Create Razorpay Order   │
                  │  with Clear Message   │   │  Return Order Details    │
                  └───────────────────────┘   └──────────────────────────┘
                                                          │
                                                          ▼
                                          ┌──────────────────────────────┐
                                          │  FRONTEND: Open Razorpay UI  │
                                          │  User Completes Payment      │
                                          └──────────────────────────────┘
```

---

## 🧪 Testing Scenarios

### **Test Case 1: Order Below Minimum (₹0.01)**
```
Input:
  - Subtotal: ₹0.01
  - Delivery: ₹40.00
  - Discount: ₹40.00
  - Total: ₹0.01

Expected Result:
  ❌ Frontend shows error toast
  ❌ User redirected to checkout
  ❌ No API call made to backend
```

### **Test Case 2: Order Exactly at Minimum (₹1.00)**
```
Input:
  - Subtotal: ₹41.00
  - Delivery: ₹40.00
  - Discount: ₹40.00
  - Total: ₹41.00
  - After 1% Razorpay discount: ₹40.59

Expected Result:
  ❌ Backend rejects (₹40.59 < ₹1.00 after discount)
  ❌ Returns 400 error with clear message
```

### **Test Case 3: Order Above Minimum (₹100.00)**
```
Input:
  - Subtotal: ₹100.00
  - Delivery: ₹40.00
  - Discount: ₹40.00
  - Total: ₹100.00
  - After 1% Razorpay discount: ₹99.00

Expected Result:
  ✅ Frontend validation passes
  ✅ Backend validation passes
  ✅ Razorpay order created successfully
  ✅ Payment UI opens
```

### **Test Case 4: Large Order (₹1000+)**
```
Input:
  - Subtotal: ₹1000.00
  - Delivery: ₹40.00
  - Discount: ₹40.00
  - Total: ₹1000.00
  - After 5% Razorpay discount: ₹950.00

Expected Result:
  ✅ Frontend validation passes
  ✅ Backend validation passes
  ✅ Razorpay order created successfully
  ✅ 5% discount applied (₹1000+ orders)
```

---

## 🔍 How to Test

### **1. Test with Very Small Amount:**
```bash
# Add a product with price ₹0.01 to cart
# Proceed to checkout
# Select Razorpay payment
# Expected: Error toast appears, redirected to checkout
```

### **2. Test with Minimum Amount:**
```bash
# Add products totaling ₹1.00 (after discounts)
# Proceed to checkout
# Select Razorpay payment
# Expected: Payment should proceed (if above ₹1.00 after Razorpay discount)
```

### **3. Test with Normal Amount:**
```bash
# Add products totaling ₹100+
# Proceed to checkout
# Select Razorpay payment
# Expected: Payment proceeds normally
```

### **4. Check Console Logs:**
```bash
# Backend logs should show:
✅ Razorpay Discount Calculation:
   - Original Amount: ₹X.XX
   - Discount Percentage: X%
   - Discount Amount: ₹X.XX
   - Final Amount: ₹X.XX

# If below minimum:
❌ Order amount below Razorpay minimum
   - Final Amount: ₹X.XX
   - Minimum Required: ₹1.00
```

---

## 📝 Error Messages

### **Frontend Error (User-Facing):**
```
Title: "Order Amount Too Low"
Description: "Minimum order amount for online payment is ₹1.00. 
Your current total is ₹0.01. Please add more items or use 
Cash on Delivery."
```

### **Backend Error (API Response):**
```json
{
  "message": "Order amount must be at least ₹1.00. Current amount after discount: ₹0.01",
  "minimumAmount": 100,
  "currentAmount": 1
}
```

### **Console Logs (Developer):**
```
❌ Order amount below Razorpay minimum
   - Final Amount: ₹0.01
   - Minimum Required: ₹1.00
```

---

## 🎯 Key Takeaways

1. **Razorpay Minimum:** All orders must be ≥ ₹1.00 (100 paisa)
2. **Dual Validation:** Both frontend and backend validate amounts
3. **User Experience:** Clear error messages guide users to solutions
4. **Alternative Payment:** Users can use COD for small orders
5. **Discount Consideration:** Validation happens AFTER applying Razorpay discounts

---

## 🚀 Deployment Checklist

- [x] Backend validation added to `payment.ts`
- [x] Frontend validation added to `RazorpayPayment.tsx`
- [x] Error messages are user-friendly
- [x] Console logs provide debugging information
- [x] Alternative payment method (COD) suggested
- [x] Documentation created

---

## 📚 Related Files

1. **Backend:** `server/controllers/payment.ts` (Lines 68-79)
2. **Frontend:** `client/src/components/checkout/RazorpayPayment.tsx` (Lines 70-80)

---

## 🔗 Razorpay Documentation

- [Razorpay Orders API](https://razorpay.com/docs/api/orders/)
- [Razorpay Error Codes](https://razorpay.com/docs/api/errors/)
- [Minimum Order Amount](https://razorpay.com/docs/payments/payments/test-card-details/#minimum-order-amount)

---

## ✅ Status

**FIXED & DEPLOYED** ✅

The minimum amount validation is now active on both frontend and backend, preventing orders below ₹1.00 from being processed through Razorpay.

---

**Last Updated:** 2025-01-09  
**Version:** 1.0.0  
**Author:** Development Team
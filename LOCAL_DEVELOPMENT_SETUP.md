# Local Development Setup Guide

This guide will help you run the Blinkeach e-commerce platform on your local machine without the issues you were experiencing.

## Issues Fixed ✅

1. **Invoice Upload Issue** - ✅ FIXED
   - Created local file storage system to replace Replit object storage
   - Invoices now save to `public/uploads/invoices/` directory

2. **Razorpay Payment Issue** - ✅ FIXED  
   - Test credentials are pre-configured and working
   - No API key setup required for development

3. **Delivery Service Issue** - ✅ FIXED
   - Mock delivery service for development mode
   - No external API keys required for testing

## Quick Setup Steps

### 1. Environment Configuration

Create a `.env` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env
```

**Minimum required configuration:**
```env
NODE_ENV=development
DATABASE_URL=your_postgres_database_url
SESSION_SECRET=any_random_string_here
```

### 2. Database Setup

Make sure your PostgreSQL database is running and update the `DATABASE_URL` in your `.env` file.

```bash
# Push database schema
npm run db:push
```

### 3. Install Dependencies & Run

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## What Works Out of the Box 🚀

### ✅ Invoice System
- **Local Storage**: Invoices save to `public/uploads/invoices/`
- **Upload**: Works without external cloud storage
- **Download**: Serves files from local directory
- **Admin Panel**: Full invoice management working

### ✅ Payment System (Razorpay)
- **Test Mode**: Pre-configured with test credentials
- **Test Cards**: Use 4111 1111 1111 1111 (any CVV, future date)
- **Live Integration**: Ready for production with your real API keys

### ✅ Delivery System
- **Mock Service**: Generates realistic tracking IDs
- **Admin Panel**: Create shipments with fake tracking
- **Customer View**: Track orders with mock updates
- **API Ready**: Add real delivery partner keys when ready

### ✅ All Core Features
- User authentication & registration
- Product catalog with categories
- Shopping cart & checkout
- Order management
- Admin dashboard
- Multi-language support

## Testing the Fixed Features

### Test Invoice Upload:
1. Login as admin (admin/password)
2. Go to Admin → Order Management
3. Click any order → Upload Invoice
4. Upload a PDF/image file
5. ✅ Should work without connection errors

### Test Razorpay Payment:
1. Add products to cart
2. Proceed to checkout
3. Select "Pay with Razorpay"
4. Use test card: 4111 1111 1111 1111
5. ✅ Payment should process successfully

### Test Delivery Tracking:
1. Admin panel → Orders
2. Update order status to "shipped"
3. ✅ Tracking ID generated automatically
4. Customer can track order with mock updates

## Optional Configurations

### Email Service (Optional)
```env
GMAIL_EMAIL=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### Real Delivery Service (Optional)
```env
DELHIVERY_API_KEY=your_delhivery_api_key
DELIVERY_PARTNER=delhivery
```

### Production Razorpay (When Ready)
```env
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_live_secret
```

## Common Issues & Solutions

### Issue: "Port already in use"
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
npm run dev
```

### Issue: Database connection error
- Make sure PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@localhost:5432/dbname`

### Issue: File upload permissions
```bash
# Ensure upload directory exists and has write permissions
mkdir -p public/uploads/invoices
chmod 755 public/uploads
```

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| **File Storage** | Local filesystem | Replit Object Storage |
| **Payments** | Test mode (rzp_test_*) | Live mode (rzp_live_*) |
| **Delivery** | Mock responses | Real API integration |
| **Email** | Optional/Mock | Real SMTP/SendGrid |

## Access URLs

- **Frontend**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin (admin/password)
- **API**: http://localhost:5000/api/*

Your application is now ready for local development! 🎉

## Need Help?

All the critical issues have been resolved:
- ✅ No more connection refused errors
- ✅ Invoice uploads working locally  
- ✅ Payments processing correctly
- ✅ Delivery system functional

The platform is fully functional for local development and testing.
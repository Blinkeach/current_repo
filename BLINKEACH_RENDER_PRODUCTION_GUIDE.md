# Blinkeach Production Deployment Guide for Render

## Your Domains
- **Primary**: https://blinkeach.in
- **Secondary**: https://blinkeach.com
- **With WWW**: https://www.blinkeach.in, https://www.blinkeach.com

## Quick Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Configure for blinkeach.in production deployment"
git push origin main
```

### 2. Deploy on Render
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically use `render.yaml` to create:
   - PostgreSQL database: `blinkeach-production-db`
   - Web service: `blinkeach-production`
   - Auto-configure your domains

### 3. Configure Custom Domains
After deployment:
1. Go to your web service settings
2. Navigate to "Settings" → "Custom Domains"
3. Add your domains:
   - `blinkeach.in`
   - `www.blinkeach.in`
   - `blinkeach.com`
   - `www.blinkeach.com`
4. Render will provide SSL certificates automatically

### 4. Set Required Environment Variables
Go to your web service → Environment tab and add:

#### Essential for Production
```env
# Payment (REQUIRED - Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET

# Email (REQUIRED for order confirmations)
SENDGRID_API_KEY=YOUR_SENDGRID_KEY
```

#### Optional Services
```env
# Gmail Backup (Optional)
GMAIL_USER=your_business_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth (Optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Delivery Service (Optional)
DELHIVERY_API_KEY=your_delhivery_api_key

# AI Chatbot (Optional)
OPENAI_API_KEY=your_openai_api_key
```

## OAuth Redirect URLs Configuration

### Google OAuth Console
Add these redirect URIs in your Google Cloud Console:
- `https://blinkeach.in/auth/google/callback`
- `https://www.blinkeach.in/auth/google/callback`
- `https://blinkeach.com/auth/google/callback`
- `https://www.blinkeach.com/auth/google/callback`

### Facebook App Settings
Add these Valid OAuth Redirect URIs:
- `https://blinkeach.in/auth/facebook/callback`
- `https://www.blinkeach.in/auth/facebook/callback`
- `https://blinkeach.com/auth/facebook/callback`
- `https://www.blinkeach.com/auth/facebook/callback`

### Razorpay Webhook URLs
Configure in Razorpay Dashboard:
- `https://blinkeach.in/api/payment/webhook`

## DNS Configuration

### For blinkeach.in
Point your DNS to Render:
```
Type: CNAME
Name: @
Value: [your-render-url].onrender.com

Type: CNAME  
Name: www
Value: [your-render-url].onrender.com
```

### For blinkeach.com
```
Type: CNAME
Name: @
Value: [your-render-url].onrender.com

Type: CNAME
Name: www
Value: [your-render-url].onrender.com
```

## Post-Deployment Tasks

### 1. Database Setup
- Tables will be created automatically on first run
- Access admin panel: `https://blinkeach.in/admin`
- Default login: `admin` / `password` (change immediately)

### 2. Add Initial Data
1. **Categories**: Electronics, Fashion, Home & Kitchen, etc.
2. **Products**: Upload product images and details
3. **Carousel Images**: Add homepage banners
4. **Navbar Settings**: Upload your logo

### 3. Test Critical Features
- [ ] User registration/login
- [ ] Product browsing and search
- [ ] Add to cart functionality
- [ ] Checkout process
- [ ] Payment with Razorpay (use test mode first)
- [ ] Order confirmation emails
- [ ] Admin panel access
- [ ] Invoice generation

### 4. Go Live Checklist
- [ ] Switch Razorpay to live mode
- [ ] Test real payment (small amount)
- [ ] Verify email delivery
- [ ] Check order management workflow
- [ ] Test on mobile devices
- [ ] Monitor error logs in Render dashboard

## Production Optimization

### Performance
- Render Starter plan supports moderate traffic
- Upgrade to Professional plan for high traffic
- Enable caching in browser settings

### Security
- SSL certificates auto-managed by Render
- Environment variables encrypted
- CORS configured for your domains only
- JWT tokens for secure authentication

### Monitoring
- Use Render's built-in monitoring
- Check logs regularly: Render Dashboard → Logs
- Set up error alerts if needed

## Troubleshooting

### Common Issues
1. **Build Failed**: Check that all dependencies are in package.json
2. **Database Connection**: Verify DATABASE_URL is properly linked
3. **Payment Issues**: Ensure Razorpay keys are correct and live mode is enabled
4. **Email Not Sending**: Verify SendGrid API key and domain verification
5. **OAuth Errors**: Check redirect URLs match exactly

### Support Resources
- Render Documentation: [render.com/docs](https://render.com/docs)
- Your application logs: Render Dashboard → Your Service → Logs
- Test all features in staging before promoting to production

## Success! 🎉

Your Blinkeach e-commerce platform is now live on:
- **https://blinkeach.in**
- **https://blinkeach.com**

Ready to serve customers with full e-commerce functionality!
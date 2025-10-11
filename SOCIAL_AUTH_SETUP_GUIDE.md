# Social Authentication Setup Guide

This guide will help you configure Google and Facebook OAuth authentication for your Blinkeach e-commerce application.

## 🔍 Current Status

Currently, social authentication (Google and Facebook login) is **NOT CONFIGURED**. The application will show disabled buttons with "(Not configured)" labels until you complete the setup below.

## ✅ What Has Been Fixed

1. **Error Handling**: Added proper error handling for unconfigured OAuth providers
2. **User Feedback**: Users now see clear messages when social login is not available
3. **Graceful Degradation**: The app redirects to login page with error messages instead of crashing
4. **Configuration Check**: Added `/api/auth/social-config` endpoint to check which providers are enabled
5. **UI Updates**: Social login buttons are automatically disabled when not configured

## 🚀 How to Enable Social Authentication

### Option 1: Google OAuth Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** for your project

#### Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application** as the application type
4. Configure the OAuth consent screen if prompted:
   - Add your app name: "Blinkeach"
   - Add your support email
   - Add authorized domains (e.g., `blinkeach.in`, `localhost`)

#### Step 3: Configure Authorized Redirect URIs

Add the following redirect URIs:

**For Development:**
```
http://localhost:5000/api/auth/google/callback
```

**For Production:**
```
https://blinkeach.in/api/auth/google/callback
https://www.blinkeach.in/api/auth/google/callback
```

#### Step 4: Get Your Credentials

After creating the OAuth client, you'll receive:
- **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abcdefghijklmnop`)

#### Step 5: Update Your .env File

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

---

### Option 2: Facebook OAuth Setup

#### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Consumer** as the app type
4. Fill in your app details:
   - App Name: "Blinkeach"
   - App Contact Email: your email

#### Step 2: Add Facebook Login Product

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Select **Web** as the platform

#### Step 3: Configure OAuth Redirect URIs

1. Go to **Facebook Login** → **Settings**
2. Add the following to **Valid OAuth Redirect URIs**:

**For Development:**
```
http://localhost:5000/api/auth/facebook/callback
```

**For Production:**
```
https://blinkeach.in/api/auth/facebook/callback
https://www.blinkeach.in/api/auth/facebook/callback
```

#### Step 4: Get Your Credentials

1. Go to **Settings** → **Basic**
2. You'll find:
   - **App ID** (your Facebook App ID)
   - **App Secret** (click "Show" to reveal it)

#### Step 5: Update Your .env File

```env
FACEBOOK_APP_ID=your_actual_app_id_here
FACEBOOK_APP_SECRET=your_actual_app_secret_here
```

---

## 🔧 Complete .env Configuration

After setting up both providers, your `.env` file should look like this:

```env
# Social Media Login
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=abcdef1234567890abcdef1234567890
```

---

## 🧪 Testing Your Setup

### 1. Restart Your Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

### 2. Check Server Logs

You should see messages indicating which OAuth strategies are registered:
- ✅ Google Strategy registered (if configured)
- ✅ Facebook Strategy registered (if configured)

### 3. Test the Login Flow

1. Navigate to `/login` page
2. Click on the **Social Login** tab
3. The buttons should now be **enabled** (no "Not configured" label)
4. Click **Sign in with Google** or **Sign in with Facebook**
5. You should be redirected to the respective OAuth provider
6. After authentication, you'll be redirected back to your app

### 4. Verify User Creation

Check your database to ensure:
- User is created with the correct email
- `isGoogleUser` or `isFacebookUser` flag is set to `true`
- `emailVerified` is set to `true`
- Profile picture is saved (if provided by the OAuth provider)

---

## 🐛 Troubleshooting

### Issue: "Google login is not configured" error

**Solution:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
2. Ensure there are no extra spaces or quotes around the values
3. Restart your server after updating `.env`

### Issue: "Redirect URI mismatch" error

**Solution:**
1. Check that your redirect URIs in Google/Facebook console match exactly
2. Ensure you're using the correct protocol (`http` vs `https`)
3. Verify the port number matches (e.g., `:5000`)

### Issue: "Email not provided from Google/Facebook"

**Solution:**
1. For Google: Ensure you've requested the `email` scope
2. For Facebook: Ensure you've requested the `email` permission
3. Check that the user has granted email permission during OAuth flow

### Issue: Users can't log in after OAuth

**Solution:**
1. Check server logs for detailed error messages
2. Verify database connection is working
3. Ensure the `users` table has all required columns
4. Check that session store is properly configured

---

## 🔒 Security Best Practices

1. **Never commit credentials**: Keep your `.env` file in `.gitignore`
2. **Use environment variables**: Never hardcode credentials in your code
3. **Rotate secrets regularly**: Change your OAuth secrets periodically
4. **Use HTTPS in production**: Always use HTTPS for OAuth callbacks in production
5. **Validate redirect URIs**: Only whitelist your actual domains
6. **Monitor OAuth usage**: Check your Google/Facebook dashboards for suspicious activity

---

## 📊 How It Works

### Authentication Flow

1. **User clicks social login button** → Frontend redirects to `/api/auth/google` or `/api/auth/facebook`
2. **Server initiates OAuth flow** → Redirects user to Google/Facebook login page
3. **User authenticates** → Google/Facebook redirects back to your callback URL
4. **Server receives OAuth token** → Exchanges it for user profile information
5. **User is created/updated** → Server creates or updates user in database
6. **JWT token is generated** → Server generates a JWT token for the user
7. **User is redirected** → Frontend receives token and logs user in

### Database Changes

When a user logs in via social auth:
- New user is created if email doesn't exist
- `isGoogleUser` or `isFacebookUser` flag is set
- `emailVerified` is automatically set to `true`
- Profile picture is saved from OAuth provider
- Random password is generated (user can't use password login unless they reset it)

---

## 📝 Additional Configuration

### Production Deployment

When deploying to production (e.g., Render, Heroku, Vercel):

1. Add environment variables in your hosting platform's dashboard
2. Update OAuth redirect URIs to use your production domain
3. Ensure `NODE_ENV=production` is set
4. The callback URLs will automatically use `https://blinkeach.in`

### Custom Domain Setup

If using a custom domain:

1. Update redirect URIs in Google/Facebook console
2. Update `callbackURL` in `server/auth.ts` if needed
3. Test thoroughly before going live

---

## ✨ Features Included

- ✅ Automatic user creation on first login
- ✅ Email verification bypass (OAuth providers verify emails)
- ✅ Profile picture sync from OAuth provider
- ✅ Seamless integration with existing email/password auth
- ✅ JWT token generation for API access
- ✅ Session management
- ✅ Error handling and user feedback
- ✅ Graceful degradation when not configured

---

## 🆘 Need Help?

If you encounter issues:

1. Check the server console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a fresh browser session (clear cookies/cache)
4. Check Google/Facebook developer console for API errors
5. Review the OAuth provider's documentation

---

## 📚 References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Passport Google OAuth20 Strategy](https://github.com/jaredhanson/passport-google-oauth2)
- [Passport Facebook Strategy](https://github.com/jaredhanson/passport-facebook)

---

**Last Updated:** January 2025
**Version:** 1.0.0
# Admin Setup Guide

## Quick Admin Access Setup

### Step 1: Get Firebase Admin SDK Credentials

You need to add Firebase Admin SDK credentials to your `.env.local` file to run the admin claims script.

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (equza-6b3c0)
3. **Go to Project Settings** (gear icon)
4. **Service Accounts tab**
5. **Click "Generate new private key"**
6. **Download the JSON file**

### Step 2: Add Credentials to .env.local

From the downloaded JSON file, add these to your `.env.local`:

```bash
# Firebase Admin SDK (add these to your existing .env.local)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@equza-6b3c0.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**Important**: 
- Keep the quotes around the private key
- Keep the `\n` characters as they are
- Don't remove any of the `-----BEGIN PRIVATE KEY-----` parts

### Step 3: Run the Admin Claims Script

```bash
# Navigate to project directory
cd equza-living-co-website

# Set admin claims for your user
node scripts/set-admin-claims.mjs test@email.com
```

### Step 4: Test Admin Login

1. **Sign out** of any current session (if logged in)
2. **Go to** http://localhost:3000/admin/login
3. **Sign in** with test@email.com
4. **Should work!** 🎉

## Troubleshooting Steps

### If script fails with "Missing environment variables":
- Double-check your `.env.local` file has the Firebase Admin credentials
- Restart your dev server (`npm run dev`) after adding new env vars

### If script fails with "Firebase Admin SDK initialization failed":
- Check that the private key is properly formatted with quotes and `\n` characters
- Verify the client email matches your Firebase project

### If login still fails after running script:
- Make sure you signed out and signed back in (JWT tokens are cached)
- Check browser console for any errors
- Verify the script showed "SUCCESS!" message

## Security Notes

- **Never commit** the `.env.local` file to git
- **Keep Admin SDK credentials secure** - they have full access to your Firebase project
- **Use environment variables** for production deployment
- **Consider rotating keys** periodically for security

## Alternative: Quick Development Setup

If you just want to test quickly without Admin SDK setup, you can temporarily modify the admin check in `/admin/login/page.tsx` to accept your specific email for development only.
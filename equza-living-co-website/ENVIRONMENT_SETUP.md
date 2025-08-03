# Environment Setup Guide

## Required Environment Variables

To run this project, you'll need to set up the following environment variables in your `.env.local` file:

### Firebase Configuration (Required)

```bash
# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin Configuration (Server-side)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

### Contact Information (Easily Configurable)

```bash
NEXT_PUBLIC_CONTACT_EMAIL=info@equzalivingco.com
NEXT_PUBLIC_CONTACT_PHONE=+1234567890
```

### Social Media Links (Optional)

```bash
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/equzalivingco
NEXT_PUBLIC_PINTEREST_URL=https://pinterest.com/equzalivingco
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/equzalivingco
```

### External Services (Optional)

```bash
# Google Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Calendly Integration
CALENDLY_API_TOKEN=your_calendly_api_token
CALENDLY_USER_URI=https://api.calendly.com/users/your_user_id

# Email Service (Choose one)
RESEND_API_KEY=re_xxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxx
# OR
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASS=your_app_password
```

### Application Settings

```bash
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

## Firebase Setup Instructions

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Enable Storage

2. **Get Configuration Values:**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the config values to your `.env.local`

3. **Set up Service Account (for admin functions):**
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Use the email and private key in your environment variables

4. **Deploy Security Rules:**
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

## Development Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Firebase configuration values**

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Production Deployment

For production deployment, make sure to:

1. Set `NODE_ENV=production`
2. Update `NEXT_PUBLIC_SITE_URL` to your production domain
3. Configure all required environment variables in your hosting platform
4. Deploy Firebase rules and indexes

## Security Notes

- Never commit `.env.local` to version control
- The `NEXT_PUBLIC_*` variables will be exposed to the client
- Keep `FIREBASE_PRIVATE_KEY` and other sensitive data secure
- Regularly rotate API keys and tokens 
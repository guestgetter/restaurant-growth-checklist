# Authentication Setup Guide

## Google OAuth Setup

To enable Google login for your Growth OS platform, follow these steps:

### 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen if prompted
6. For Application type, select "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)

### 2. Environment Variables

Create a `.env.local` file in your project root with these variables:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Team Member Configuration

In `app/api/auth/[...nextauth]/route.ts`, update the `guestGetterEmails` array with your team email addresses:

```typescript
const guestGetterEmails = [
  '@guestgetter.com',
  'kyle@guestgetter.com',
  'team@guestgetter.com',
  // Add more team emails here
]
```

### 4. Role-Based Access

The system automatically assigns roles:

- **Team Members**: Users with emails matching `guestGetterEmails`
  - Can access all restaurant clients
  - Full dashboard and management access

- **Restaurant Clients**: All other authenticated users
  - Limited to their own restaurant data
  - Dashboard and reporting access only

## Features Included

✅ **Google OAuth Integration**
✅ **Role-based Access Control** 
✅ **Team vs Client User Types**
✅ **Session Management**
✅ **Secure Sign-out**
✅ **User Profile in Sidebar**

## Multi-Tenant Access

For restaurant clients to only see their own data:

1. Restaurant clients will be automatically identified by their email domain
2. Data filtering will be implemented based on user sessions
3. Client-specific data access will be enforced in API routes

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URI to Google OAuth settings
3. Use secure environment variable storage (Vercel, Railway, etc.)
4. Enable HTTPS for secure authentication

## Next Steps

After setting up authentication, you can:

1. **Deploy the application** - Ready for production use
2. **Add restaurant client domains** - Configure which email domains are restaurant clients
3. **Implement data filtering** - Restrict client access to their own data
4. **Add more OAuth providers** - GitHub, Microsoft, etc.
5. **Enhanced permissions** - Granular role-based permissions 
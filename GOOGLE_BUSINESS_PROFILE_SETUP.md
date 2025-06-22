# Google Business Profile API Setup Guide

## Overview
This guide walks you through setting up real Google Business Profile API integration for your Restaurant Growth OS. The API provides access to **18 months of historical data** (vs. only 6 months in the native interface) and comprehensive business insights.

## Prerequisites
- Google Cloud Console project
- Business Profile account with claimed locations
- Restaurant business verification completed

## Step 1: Enable Required APIs

**IMPORTANT:** You must first **request access** to Google Business Profile APIs through the [access request form](https://developers.google.com/my-business/content/prereqs#request-api-access).

Once approved, enable these 8 APIs in Google Cloud Console:

1. **Google My Business API**
2. **My Business Account Management API** 
3. **My Business Business Information API**
4. **My Business Performance API** (for insights/metrics)
5. **My Business Lodging API**
6. **My Business Place Actions API**
7. **My Business Notifications API**
8. **My Business Verifications API**
9. **My Business Q&A API**

### Enable APIs:
```bash
# Go to: https://console.cloud.google.com/apis/library
# Search for each API above and click "Enable"
```

## Step 2: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"Create Credentials" > "OAuth client ID"**
3. Choose **"Web application"**
4. Add authorized redirect URIs:
   ```
   https://restaurant-growth-checklist.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
5. Download the JSON credentials file

## Step 3: Configure OAuth Consent Screen

1. Go to **OAuth consent screen** in Google Cloud Console
2. Set **Application name**: "Restaurant Growth OS"
3. Add **Authorized domains**: `vercel.app`, `localhost`
4. Add **Scopes**:
   ```
   https://www.googleapis.com/auth/business.manage
   ```
5. Add test users (your restaurant owner emails)

## Step 4: Environment Variables

Add these to your `.env.local` and Vercel environment:

```bash
# Google Business Profile API
GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your_client_id_here
GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=your_client_secret_here
GOOGLE_BUSINESS_PROFILE_REDIRECT_URI=https://restaurant-growth-checklist.vercel.app/api/auth/callback/google

# OAuth Scopes
GOOGLE_BUSINESS_PROFILE_SCOPES=https://www.googleapis.com/auth/business.manage
```

## Step 5: API Integration Points

### Key Endpoints You'll Use:

1. **Account Management**:
   ```
   GET /v1/accounts
   ```

2. **Location Data**:
   ```
   GET /v1/accounts/{accountId}/locations
   ```

3. **Performance Metrics** (18 months historical):
   ```
   GET /v1/locations/{locationId}/fetchMultiDailyMetricsTimeSeries
   ```

4. **Reviews**:
   ```
   GET /v4/accounts/{accountId}/locations/{locationId}/reviews
   ```

5. **Search Keywords**:
   ```
   GET /v1/locations/{locationId}/searchkeywords/impressions/monthly
   ```

## Step 6: Authentication Flow

The API uses **OAuth 2.0** with these scopes:
- `https://www.googleapis.com/auth/business.manage` (primary)
- `https://www.googleapis.com/auth/plus.business.manage` (deprecated but still works)

## Step 7: Rate Limits & Quotas

- **10,000 requests per day** (default)
- **100 requests per 100 seconds per user**
- Request quota increases through Google Cloud Console if needed

## Step 8: Testing

Use the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) to test:

1. Configure with your Client ID
2. Authorize with scope: `https://www.googleapis.com/auth/business.manage`
3. Test endpoint: `https://mybusinessaccountmanagement.googleapis.com/v1/accounts`

## Step 9: Data Available

### Views & Engagement:
- Total profile views (search vs maps)
- Website clicks, phone calls, direction requests
- Mobile vs desktop breakdown

### Search Performance:
- Search queries that found your business
- Branded vs discovery searches
- Search keyword trends

### Reviews & Ratings:
- Review sentiment analysis
- Response rates and times
- Rating distribution over time

### Historical Data:
- **18 months** of daily metrics (vs 6 months in native interface)
- Year-over-year comparisons
- Seasonal trend analysis

## Step 10: Implementation Notes

### Restaurant-Specific Insights:
- Menu page views
- Reservation click-through rates
- Order online clicks
- Photo engagement (food photos vs interior)
- Peak hours analysis
- Local search ranking positions

### Error Handling:
- Handle 403 errors (insufficient permissions)
- Retry logic for rate limits (429 errors)
- Graceful fallback to demo data during setup

## Step 11: Compliance & Best Practices

- **Never expose client secrets** in frontend code
- Store refresh tokens securely in database
- Implement proper error logging
- Regular token refresh (1 hour expiry)
- Respect user privacy and data retention policies

## Next Steps

1. **Request API access** (most important - can take 1-2 weeks)
2. **Set up OAuth credentials**
3. **Update environment variables**
4. **Test with OAuth playground**
5. **Integrate with existing Google OAuth flow**
6. **Deploy and test with real restaurant data**

## Support Resources

- [Business Profile API Documentation](https://developers.google.com/my-business)
- [OAuth 2.0 Implementation Guide](https://developers.google.com/my-business/content/implement-oauth)
- [API Rate Limits](https://developers.google.com/my-business/content/usage-limits)
- [Business Profile Help Center](https://support.google.com/business/)

---

**⚠️ IMPORTANT**: The Google Business Profile API is **not publicly available**. You must request access through Google's approval process. This typically takes 1-2 weeks and requires a legitimate business use case. 
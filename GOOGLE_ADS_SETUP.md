# 🚀 Google Ads API Integration Setup Guide

## Overview

This guide will help you set up Google Ads API integration for the Restaurant Growth OS, enabling real-time advertising performance insights and automated reporting for your restaurant clients.

## 🎯 What You'll Get

### ✅ **Real-Time Ad Performance Data**
- Campaign performance metrics
- Keyword performance analysis
- Geographic performance insights
- Cost and conversion tracking
- Click-through rates and ROI analysis

### ✅ **Restaurant-Specific Insights**
- Average order value tracking
- Peak hour analysis
- Location-based performance
- Seasonal trend analysis
- Competitor benchmarking

### ✅ **Automated Reporting**
- Daily, weekly, and monthly reports
- Custom date range analysis
- Export capabilities
- Visual charts and graphs
- Client-specific dashboards

## 📋 Prerequisites

Before starting, ensure you have:
- A Google Ads account with active campaigns
- Access to Google Cloud Console
- Administrator access to your Google Ads account
- Basic understanding of API authentication

## 🔧 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `restaurant-growth-ads-api`
4. Click **"Create"**

### Step 2: Enable Google Ads API

1. In your Google Cloud project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Ads API"**
3. Click on **"Google Ads API"** and click **"Enable"**
4. Wait for the API to be enabled

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `Restaurant Growth OS`
   - User support email: Your email
   - Developer contact: Your email
4. For Application type, select **"Web application"**
5. Name: `Restaurant Growth OS Web Client`
6. Authorized redirect URIs: Add your domain
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
7. Click **"Create"**
8. **Save the Client ID and Client Secret** - you'll need these!

### Step 4: Get Developer Token

1. Go to [Google Ads](https://ads.google.com/)
2. Click the tools icon (🔧) in the top right
3. Under **"Setup"**, click **"API Center"**
4. Click **"Apply for access"** if you don't have a developer token
5. Fill out the application form:
   - Company name: Your restaurant/agency name
   - Website: Your business website
   - API usage description: "Restaurant marketing performance analysis and reporting"
6. Wait for approval (usually 24-48 hours)
7. Once approved, copy your **Developer Token**

### Step 5: Generate Refresh Token

1. Create a temporary HTML file to get the authorization code:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Google Ads API Authorization</title>
</head>
<body>
    <h1>Click the link below to authorize</h1>
    <a href="https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline">
        Authorize Google Ads API Access
    </a>
</body>
</html>
```

2. Replace `YOUR_CLIENT_ID` with your actual client ID
3. Open this file in a browser and click the authorization link
4. Grant access to your Google Ads account
5. Copy the authorization code from the redirect URL

6. Exchange the authorization code for a refresh token using curl:

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost:3000"
```

7. Save the `refresh_token` from the response

### Step 6: Configure Environment Variables

Create or update your `.env.local` file:

```env
# Google Ads API Configuration
GOOGLE_ADS_CLIENT_ID=your_client_id_here
GOOGLE_ADS_CLIENT_SECRET=your_client_secret_here
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here

# Optional: Default Customer ID (if you have one main account)
GOOGLE_ADS_DEFAULT_CUSTOMER_ID=123-456-7890
```

### Step 7: Test the Integration

1. Restart your development server:
```bash
npm run dev
```

2. Navigate to the Reports page
3. You should see the Google Ads configuration status
4. If configured correctly, you'll see account selection options

## 🏢 Multi-Client Setup (Agency/MCC Account)

If you're managing multiple restaurant clients:

### Step 1: Set Up Manager Account (MCC)

1. Create a [Google Ads Manager Account](https://ads.google.com/home/tools/manager-accounts/)
2. Link all client Google Ads accounts to your MCC
3. Use your MCC Customer ID in the API calls

### Step 2: Update Environment Variables

```env
# Use your MCC Customer ID
GOOGLE_ADS_MCC_CUSTOMER_ID=123-456-7890
```

### Step 3: Client-Specific Access

The system will automatically:
- Load all accessible accounts under your MCC
- Allow selection of specific client accounts
- Store account preferences per restaurant client
- Generate separate reports for each account

## 🔒 Security Best Practices

### Environment Variables
- Never commit API credentials to version control
- Use different credentials for development and production
- Regularly rotate your refresh tokens

### Access Control
- Limit API access to necessary scopes only
- Use read-only access when possible
- Monitor API usage in Google Cloud Console

### Data Protection
- Store sensitive data encrypted
- Implement proper error handling
- Log API errors but not sensitive data

## 📊 Available Metrics

### Campaign Metrics
- Impressions, Clicks, Cost
- Conversions and Conversion Value
- Click-through Rate (CTR)
- Cost per Click (CPC)
- Return on Ad Spend (ROAS)

### Keyword Metrics
- Keyword performance by match type
- Quality scores
- Search terms triggering ads
- Negative keyword opportunities

### Geographic Metrics
- Performance by city, region, country
- Location-based conversion rates
- Geographic bid adjustments
- Local search performance

### Time-Based Metrics
- Hour of day performance
- Day of week trends
- Seasonal patterns
- Campaign scheduling optimization

## 🚨 Troubleshooting

### Common Issues

#### "Authentication Error"
- Check that all environment variables are set correctly
- Verify your refresh token hasn't expired
- Ensure your developer token is approved

#### "Access Denied"
- Verify you have access to the Google Ads account
- Check that the account is linked to your MCC (if applicable)
- Ensure the account has active campaigns

#### "API Quota Exceeded"
- Monitor your API usage in Google Cloud Console
- Implement request throttling if needed
- Consider upgrading your API limits

#### "Invalid Customer ID"
- Ensure customer IDs are in correct format (123-456-7890)
- Verify the account exists and you have access
- Check that the account is active

### Debug Mode

Add this to your `.env.local` for detailed logging:

```env
GOOGLE_ADS_DEBUG=true
```

This will log API requests and responses to help diagnose issues.

## 📈 Optimization Tips

### API Performance
- Cache frequently accessed data
- Use batch requests when possible
- Implement proper error handling and retries
- Monitor API quota usage

### Data Accuracy
- Sync data regularly (daily recommended)
- Handle timezone differences correctly
- Account for data processing delays
- Validate data against Google Ads UI

### Restaurant-Specific Insights
- Set up conversion tracking for orders
- Use location extensions for multiple locations
- Track call conversions for phone orders
- Monitor competitor performance

## 🔄 Maintenance

### Regular Tasks
- Monitor API quota usage
- Check for new Google Ads features
- Update conversion tracking as needed
- Review and rotate credentials annually

### Updates
- Keep the google-ads-api package updated
- Monitor Google Ads API changelogs
- Test integration after Google Ads updates
- Update error handling for new API responses

## 📞 Support Resources

### Google Ads API
- [Official Documentation](https://developers.google.com/google-ads/api/docs)
- [Community Forum](https://groups.google.com/g/adwords-api)
- [Best Practices Guide](https://developers.google.com/google-ads/api/docs/best-practices)

### Restaurant-Specific Resources
- [Local Campaigns Guide](https://support.google.com/google-ads/answer/9118422)
- [Conversion Tracking for Restaurants](https://support.google.com/google-ads/answer/2684489)
- [Location Extensions Setup](https://support.google.com/google-ads/answer/2404182)

---

## ⚡ Quick Start Checklist

- [ ] Create Google Cloud project
- [ ] Enable Google Ads API
- [ ] Create OAuth 2.0 credentials
- [ ] Apply for developer token
- [ ] Generate refresh token
- [ ] Configure environment variables
- [ ] Test the integration
- [ ] Set up conversion tracking
- [ ] Configure client accounts (if MCC)
- [ ] Verify data accuracy

**You're ready to track restaurant ad performance! 🎉** 
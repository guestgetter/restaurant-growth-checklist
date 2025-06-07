# Restaurant Growth OS - Vercel Deployment Guide

## Overview
This guide covers deploying your Restaurant Growth OS application using Vercel's staging-to-production workflow with your existing setup.

## Prerequisites
- ✅ Vercel account with existing deployment
- ✅ GitHub repository connected to Vercel
- ✅ All stability improvements implemented (Error Boundaries, defensive programming, etc.)

## Deployment Workflow

### 1. Staging Deployment (Preview)
Vercel automatically creates preview deployments for every branch and pull request.

**Deploy Current Stability Branch:**
```bash
# Push your current branch for preview deployment
git push origin feature/stability-improvements
```

This will automatically trigger a Vercel preview deployment at:
`https://restaurant-growth-os-checklist-git-<branch-name>-<your-username>.vercel.app`

### 2. Testing Staging Environment

**Test Key Functionality:**
- [ ] Error boundary functionality (visit `/debug` and trigger test errors)
- [ ] Checklist state persistence across page refreshes
- [ ] Client switching functionality
- [ ] API endpoints (`/api/google-ads`, `/api/meta-ads`)
- [ ] Authentication flow
- [ ] SOP generation and editing

**Monitor for Issues:**
- Check Vercel Functions logs in dashboard
- Test localStorage operations
- Verify no console errors
- Confirm responsive design on mobile

### 3. Production Deployment

**Merge to Main (Production):**
```bash
# Switch to main and merge
git checkout main
git merge feature/stability-improvements
git push origin main
```

Vercel will automatically deploy to your production domain.

## Environment Variables

Ensure these are set in your Vercel dashboard:

### Required for Production:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Optional (for API features):
```
GOOGLE_ADS_CUSTOMER_ID=your-customer-id
GOOGLE_ADS_DEVELOPER_TOKEN=your-dev-token
GOOGLE_ADS_CLIENT_ID=your-client-id
GOOGLE_ADS_CLIENT_SECRET=your-client-secret
GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token

META_ACCESS_TOKEN=your-access-token
META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
```

## Monitoring & Health Checks

### Vercel Analytics
Monitor your deployment through:
- Vercel Dashboard → Analytics
- Real User Monitoring (RUM)
- Web Vitals tracking

### Error Monitoring
Your implemented error boundaries will:
- Log errors with unique IDs for tracking
- Provide graceful fallbacks for users
- Capture error details in console/logs

### Performance Monitoring
- Check Vercel Speed Insights
- Monitor function execution times
- Review Web Vitals scores

## Rollback Procedures

### Quick Rollback via Vercel Dashboard:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Git-based Rollback:
```bash
# Find the commit hash of last working version
git log --oneline

# Create rollback commit
git revert <commit-hash>
git push origin main
```

### Emergency Rollback:
```bash
# Hard reset to previous working commit (use carefully)
git reset --hard <previous-commit-hash>
git push --force origin main
```

## Stability Features Deployed

✅ **Error Boundaries**: Comprehensive error handling with user-friendly fallbacks
✅ **Defensive Programming**: Safe operations for localStorage, JSON parsing, array operations
✅ **Webpack Configuration**: Prevents cache corruption issues
✅ **API Route Fixes**: Eliminated dynamic server usage warnings
✅ **TypeScript Safety**: Proper type checking and null safety

## Post-Deployment Checklist

### Immediate (within 5 minutes):
- [ ] Visit production URL and verify homepage loads
- [ ] Test user authentication
- [ ] Check one checklist interaction
- [ ] Verify no console errors

### Within 24 hours:
- [ ] Monitor Vercel function logs for errors
- [ ] Check analytics for user engagement
- [ ] Verify error boundary reporting (if any errors occur)
- [ ] Test from different devices/browsers

### Within 1 week:
- [ ] Review performance metrics
- [ ] Analyze error reports and patterns
- [ ] Optimize based on real user data

## Troubleshooting

### Common Issues:

**Build Failures:**
- Check for TypeScript errors in Vercel build logs
- Verify all environment variables are set
- Review function bundle sizes

**Runtime Errors:**
- Check Vercel Functions logs
- Review error boundary logs
- Verify database connectivity

**Performance Issues:**
- Review bundle size in build output
- Check for unnecessary re-renders
- Optimize images and assets

### Support Resources:
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- This project's error boundaries will provide detailed error IDs for support

---

## Quick Commands Reference

```bash
# Deploy staging branch
git push origin feature/stability-improvements

# Deploy to production
git checkout main
git merge feature/stability-improvements
git push origin main

# Check deployment status
npx vercel --help

# View production logs
npx vercel logs <deployment-url>
``` 
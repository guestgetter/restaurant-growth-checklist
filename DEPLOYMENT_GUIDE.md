# 🚀 Deployment Guide: Staging & Production

## **Overview: Dev → Staging → Production Workflow**

```
Local Development → Push to Git → Staging Deploy → Test → Production Deploy
```

## **🎯 Deployment Platform: Railway**

**Why Railway?**
- ✅ Next.js + PostgreSQL optimized
- ✅ Easy staging/production separation
- ✅ Automatic deployments from Git
- ✅ Built-in database backups
- ✅ Simple environment management

## **📋 Prerequisites**

1. **Git Repository** (you already have this)
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **Stability Improvements** committed (we'll do this now)

## **🛠️ Step 1: Commit Stability Improvements**

```bash
# Add all our stability fixes
git add .

# Commit with descriptive message
git commit -m "feat: implement comprehensive stability improvements

- Add React Error Boundaries for crash prevention
- Implement defensive programming throughout app
- Fix dynamic server usage in API routes
- Add safe localStorage and JSON operations
- Prevent undefined property access crashes
- Add comprehensive error logging

Stability improvements include:
- Global ErrorBoundary component
- DataErrorBoundary for API errors  
- Defensive programming utilities (lib/defensive.ts)
- Safe array mapping and object access
- Webpack cache corruption fixes
- Rollback guides for all changes"

# Push to your feature branch
git push origin feature/stability-improvements
```

## **🚀 Step 2: Set Up Railway Staging Environment**

### **2.1 Create Railway Project**
1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your Restaurant Growth OS repository
5. Select the `feature/stability-improvements` branch

### **2.2 Add PostgreSQL Database**
1. In your Railway project, click **"+ New Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a database

### **2.3 Configure Environment Variables**
In Railway dashboard, go to your Next.js service → **Variables** tab:

**Required Variables:**
```bash
# Database (Railway will auto-populate these)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth Configuration
NEXTAUTH_URL=https://your-staging-app.railway.app
NEXTAUTH_SECRET=your-generated-secret-staging

# Optional: API Keys (for testing real data)
META_ACCESS_TOKEN=your-meta-token
META_APP_ID=your-meta-app-id  
META_APP_SECRET=your-meta-app-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-google-token
GOOGLE_ADS_CUSTOMER_ID=your-customer-id
```

## **🧪 Step 3: Deploy to Staging**

Railway will automatically deploy when you push to the connected branch.

**Staging URL Example:** `https://your-app-name-staging.railway.app`

### **3.1 Test Staging Deployment**
- [ ] App loads without errors
- [ ] Error Boundary test works (visit `/debug`)
- [ ] Client creation/switching works
- [ ] Checklist progress saves properly
- [ ] All pages load correctly
- [ ] Database connections work

### **3.2 Database Migration**
Railway runs Prisma migrations automatically, but verify:
```bash
# In Railway logs, you should see:
# "Running prisma generate"
# "Running prisma migrate deploy"
```

## **🌟 Step 4: Set Up Production Environment**

### **4.1 Create Production Project**
1. Create a **new Railway project** for production
2. Connect to the **main** branch (not feature branch)
3. Add PostgreSQL database
4. Configure production environment variables

### **4.2 Production Environment Variables**
```bash
# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth (IMPORTANT: Different secret for production)
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your-production-secret-different-from-staging

# Production API Keys
META_ACCESS_TOKEN=your-production-meta-token
# ... other production credentials
```

## **📋 Deployment Workflow**

### **Daily Development:**
```bash
# 1. Work locally
npm run dev

# 2. Make changes, test locally
# 3. Commit and push to feature branch
git add .
git commit -m "feat: add new feature"
git push origin feature/stability-improvements

# 4. Test automatically deploys to STAGING
# 5. Test staging deployment
# 6. If good, merge to main for PRODUCTION
```

### **Release to Production:**
```bash
# 1. Create Pull Request to main branch
# 2. Review changes
# 3. Merge to main
# 4. Production automatically deploys
```

## **🔍 Environment URLs**

- **Local**: `http://localhost:3000`
- **Staging**: `https://your-app-staging.railway.app`
- **Production**: `https://your-app.railway.app` or custom domain

## **📊 Database Management**

### **Staging Database:**
- Test data, can be reset
- Use for testing new features
- Safe to experiment with

### **Production Database:**
- Real customer data
- Automated backups
- Never test directly here

## **🛡️ Security Considerations**

1. **Different Secrets**: Use different NEXTAUTH_SECRET for each environment
2. **API Keys**: Use test/sandbox keys for staging
3. **Domain Verification**: Only production should use real domain
4. **Environment Separation**: Keep staging and production completely separate

## **📈 Monitoring & Logs**

Railway provides:
- **Real-time logs**: See console.log output
- **Build logs**: See deployment process
- **Metrics**: CPU, memory, request volume
- **Database metrics**: Connection count, query performance

## **🚨 Troubleshooting**

### **Common Issues:**
1. **Build Failures**: Check build logs in Railway
2. **Database Connection**: Verify DATABASE_URL is set
3. **Environment Variables**: Double-check all required vars
4. **Port Issues**: Railway automatically handles ports

### **Health Checks:**
- **Staging**: Visit `/api/test-db` to verify database
- **Production**: Monitor `/debug` page for errors

## **🔄 Rollback Strategy**

If production deployment fails:
1. **Railway Dashboard**: Deploy previous successful build
2. **Git Revert**: Revert commits and redeploy
3. **Database**: Restore from backup if needed

## **💰 Cost Estimation**

**Railway Pricing:**
- **Hobby Plan**: $5/month per service (staging)
- **Pro Plan**: $20/month per service (production)
- **Database**: Included in plan
- **Bandwidth**: Generous limits

**Total Monthly Cost:** ~$25-45 for staging + production

---

## **🎯 Next Steps After Deployment**

1. **Custom Domain**: Point your domain to production
2. **SSL Certificate**: Automatic with Railway
3. **Monitoring**: Set up error tracking (Sentry)
4. **Analytics**: Add usage tracking
5. **Backup Strategy**: Configure automated backups

**Your app will be production-ready with proper staging environment!** 🚀 
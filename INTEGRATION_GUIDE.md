# 🔄 Growth OS Dashboard Integration Guide

## Overview
This guide walks you through integrating your **Growth OS Dashboard** from your other Cursor project into this unified **Growth OS Platform**.

## 🎯 Current Structure

```
Growth OS Platform
├── 📊 Overview (landing page)
├── ✅ Growth Checklist (completed)
├── 📈 Dashboard (ready for integration)
├── 🎯 Goal Tracking (coming soon)
├── 👥 Client Management (coming soon)
└── ⚙️ Settings (coming soon)
```

## 🚀 Integration Steps

### Step 1: Copy Dashboard Components

From your **other Cursor project**, copy these to this project:

```bash
# From your dashboard project
src/components/Dashboard/
src/components/Charts/
src/lib/dashboard-utils.ts
src/hooks/useDashboard.ts

# To this project
components/Dashboard/
components/Charts/
lib/dashboard-utils.ts
hooks/useDashboard.ts
```

### Step 2: Update Dependencies

If your dashboard uses additional packages, add them:

```bash
# Common dashboard packages
npm install recharts chart.js react-chartjs-2 date-fns
npm install @tanstack/react-query axios
```

### Step 3: Replace Dashboard Page

Replace `app/dashboard/page.tsx` with your dashboard content:

```typescript
// app/dashboard/page.tsx
import DashboardMain from '../../components/Dashboard/DashboardMain';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <DashboardMain />
    </div>
  );
}
```

### Step 4: Adapt to New Layout

Your dashboard components may need minor adjustments:

```typescript
// Instead of full-page layouts, design for sidebar layout
const DashboardMain = () => {
  return (
    <div className="space-y-6">
      {/* Remove any duplicate headers/navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricsCard />
        <RevenueChart />
        <PerformanceWidget />
      </div>
    </div>
  );
};
```

## 🎨 Design Consistency

### Color Scheme
Match the existing Growth OS design:

```css
/* Primary Colors */
--blue-500: #3b82f6
--purple-600: #9333ea
--slate-800: #1e293b

/* Background */
--background: #f8fafc (light) / #0f172a (dark)
```

### Component Style
Follow the established patterns:

```typescript
// Card Component Example
<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
    Chart Title
  </h3>
  {/* Chart content */}
</div>
```

## 🔗 Data Integration

### Client Context
Access current client data throughout the app:

```typescript
// Create client context
const ClientContext = createContext();

// In your dashboard components
const { currentClient } = useContext(ClientContext);

// Example client object
const currentClient = {
  name: "Pizza Palace",
  industry: "quick service restaurant",
  logo: "/clients/pizza-palace/logo.png"
};
```

### API Integration
Set up API calls for restaurant metrics:

```typescript
// lib/api.ts
export const getRestaurantMetrics = async (clientId: string) => {
  const response = await fetch(`/api/metrics/${clientId}`);
  return response.json();
};

// In your dashboard components
const { data: metrics } = useQuery(['metrics', clientId], () => 
  getRestaurantMetrics(clientId)
);
```

## 📱 Mobile Responsiveness

Ensure your dashboard works with the sidebar:

```css
/* Desktop with sidebar */
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile (sidebar becomes header) */
@media (max-width: 1023px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🧪 Testing Checklist

- [ ] Dashboard loads correctly at `/dashboard`
- [ ] Sidebar navigation works smoothly
- [ ] Dark mode toggle affects dashboard
- [ ] Mobile responsive layout
- [ ] Client data displays properly
- [ ] Charts and metrics render
- [ ] No console errors

## 🔄 File Structure After Integration

```
Restaurant Growth OS Checklist/
├── app/
│   ├── dashboard/
│   │   └── page.tsx (your integrated dashboard)
│   ├── checklist/
│   │   └── page.tsx
│   └── page.tsx (overview)
├── components/
│   ├── Layout/
│   │   └── Sidebar.tsx
│   ├── Dashboard/ (from your project)
│   │   ├── DashboardMain.tsx
│   │   ├── MetricsCard.tsx
│   │   └── RevenueChart.tsx
│   └── ChecklistApp.tsx
├── lib/
│   ├── dashboard-utils.ts (from your project)
│   └── tenant.ts
└── hooks/
    └── useDashboard.ts (from your project)
```

## 🚀 Future Enhancements

Once integrated, you can easily:

1. **Add More Sections**: Goal tracking, client management, reports
2. **Connect Real Data**: APIs for POS, Google Analytics, social media
3. **Multi-Client Support**: Switch between different restaurant clients
4. **White-Labeling**: Custom branding per client
5. **Team Collaboration**: Multiple users per restaurant

## 💡 Pro Tips

- **Start Simple**: Copy one dashboard component at a time
- **Test Often**: Check navigation and responsiveness frequently  
- **Preserve Functionality**: Don't lose any existing dashboard features
- **Client Focus**: Design around the restaurant client workflow
- **Scalability**: Consider how this will work with multiple clients

## 🆘 Need Help?

If you run into issues:

1. Check the browser console for errors
2. Verify all imports are correct
3. Ensure package dependencies are installed
4. Test dashboard components in isolation first

---

**Ready to integrate?** Your dashboard project can seamlessly become part of this unified Growth OS platform! 🎉 
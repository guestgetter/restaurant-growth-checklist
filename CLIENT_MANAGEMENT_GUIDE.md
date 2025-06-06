# Client Management System Guide

The Growth OS platform now includes a comprehensive client management system that allows you to manage multiple restaurant clients with their own branding and information directly from the app.

## Features

### ✅ **Fully Functional Client Management**
- Add, edit, and delete restaurant clients
- Dynamic client switching with instant UI updates
- Logo upload and branding customization
- Complete contact information management
- Industry categorization
- Client status management (Active/Inactive)

### ✅ **Branding Customization**
- Primary and secondary color selection
- Font family options
- Logo upload with preview
- Real-time branding display in sidebar

### ✅ **Data Persistence**
- All client data stored in localStorage
- Automatic restoration on page reload
- Client switching persists across sessions

## How to Use

### 1. **Accessing Client Management**
1. Navigate to **Settings** in the sidebar
2. Click on the **Client Management** section
3. View all clients, current active client, and management options

### 2. **Adding a New Client**
1. Click the **"Add Client"** button
2. Fill out the comprehensive form:
   - **Basic Information**: Restaurant name, industry type
   - **Logo**: Upload restaurant logo (PNG/JPG, up to 2MB)
   - **Branding**: Primary color, secondary color, font family
   - **Contact**: Email, phone, address, status

3. Click **"Add Client"** to save

### 3. **Editing Existing Clients**
1. Find the client in the client list
2. Click the **Edit** button (pencil icon)
3. Modify any information in the form
4. Click **"Save Changes"**

### 4. **Switching Active Client**
1. In the client list, find the client you want to activate
2. Click **"Set Active"** button
3. The page will reload and update the sidebar with new client info

### 5. **Deleting Clients**
1. Click the **Delete** button (trash icon) next to a client
2. Confirm the deletion (note: cannot delete the last remaining client)
3. If deleting the active client, the system automatically switches to another client

## Technical Details

### **Data Structure**
Each client contains:
```typescript
interface Client {
  id: string;                    // Unique identifier
  name: string;                  // Restaurant name
  industry: string;              // Industry category
  logo?: string;                 // Base64 image data
  branding: {
    primaryColor: string;        // Hex color code
    secondaryColor: string;      // Hex color code
    fontFamily: string;          // Font family name
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;             // ISO timestamp
}
```

### **Storage**
- **Client Data**: Stored in `localStorage` under `growth-os-clients`
- **Active Client**: Stored in `localStorage` under `growth-os-current-client`
- **Auto-sync**: Components automatically update when localStorage changes

### **Default Client**
If no clients exist, the system creates a default "Pizza Palace" client to ensure the app always has at least one client.

## Industry Options
The following restaurant industry categories are available:
- Quick Service Restaurant
- Fast Casual
- Fine Dining
- Casual Dining
- Coffee Shop
- Bar & Grill
- Food Truck
- Catering
- Other

## Font Options
Available font families for branding:
- Inter (default)
- Roboto
- Open Sans
- Poppins
- Montserrat
- Playfair Display
- Merriweather
- Lato

## Client Context (For Developers)

The system includes a React Context (`ClientProvider`) for easy access to client data throughout the app:

```typescript
import { useClient } from '../lib/ClientContext';

function MyComponent() {
  const { 
    currentClient, 
    allClients, 
    setCurrentClient,
    addClient,
    updateClient,
    deleteClient 
  } = useClient();
  
  // Use client data...
}
```

## Future Enhancements

The current system is designed to scale easily to include:

1. **Database Integration**: Replace localStorage with proper database
2. **Multi-user Support**: Different team members managing different clients
3. **Advanced Branding**: Custom CSS themes, logo positioning, color schemes
4. **Client Analytics**: Performance metrics per client
5. **Backup/Export**: Client data export and backup functionality
6. **Bulk Operations**: Import multiple clients, bulk editing
7. **Client Onboarding**: Guided setup for new clients

## Benefits for Your Business

### **Immediate Value**
- **Professional Presentation**: Each client sees their own branding
- **Easy Management**: Add/remove clients as your business grows
- **No Technical Skills Required**: Entirely GUI-based management
- **Instant Switching**: Work with multiple clients seamlessly

### **Scalability**
- **Unlimited Clients**: No limit on number of clients (within localStorage constraints)
- **Rapid Onboarding**: New clients can be added in under 2 minutes
- **White-label Ready**: Each client experiences their own branded interface
- **Future-proof**: Designed to easily integrate with databases and user management

## Usage Tips

1. **Logo Requirements**: For best results, use square logos (1:1 aspect ratio) in PNG format
2. **Color Selection**: Test colors in both light and dark modes
3. **Client Switching**: Always use "Set Active" rather than manually editing localStorage
4. **Data Backup**: Consider periodically exporting client data for backup
5. **Industry Selection**: Choose the most specific industry category for better categorization

The client management system transforms Growth OS from a single-client tool into a professional multi-client platform, ready for immediate use with your restaurant clients while providing a foundation for future SaaS expansion. 
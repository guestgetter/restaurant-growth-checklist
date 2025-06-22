'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Users,
  Palette,
  Building,
  CheckCircle
} from 'lucide-react';
import { initializeDefaultClient, getAllClients } from '../../lib/clientUtils';

export interface Client {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  googleAdsCustomerId?: string;
  metaAdsAccountId?: string;
  googleAnalyticsPropertyId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const defaultClient: Omit<Client, 'id' | 'createdAt'> = {
  name: '',
  industry: 'restaurant',
  branding: {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Inter',
  },
  contact: {
    email: '',
    phone: '',
    address: '',
  },
  status: 'active',
};

const industryOptions = [
  'Quick Service Restaurant',
  'Fast Casual',
  'Fine Dining',
  'Casual Dining',
  'Coffee Shop',
  'Bar & Grill',
  'Food Truck',
  'Catering',
  'Other'
];

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Merriweather',
  'Lato'
];

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [currentClient, setCurrentClient] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Load clients from localStorage and database
  useEffect(() => {
    const fetchAndSyncClients = async () => {
      try {
        console.log('🔄 Fetching clients from API...');
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Failed to fetch clients from database');
        }
        const dbClients = await response.json();
        console.log(`✅ Fetched ${dbClients.length} clients from DB.`);

        // Also get clients from localStorage
        const localClients = getAllClients();
        console.log(`✅ Found ${localClients.length} clients in localStorage.`);

        // Merge DB and local clients, DB is source of truth
        const clientMap = new Map<string, Client>();
        localClients.forEach(c => clientMap.set(c.id, c));
        dbClients.forEach((c: Client) => clientMap.set(c.id, c));
        
        const syncedClients = Array.from(clientMap.values());
        console.log(`✅ Synced to ${syncedClients.length} total clients.`);

        // Save synced list back to localStorage
        localStorage.setItem('growth-os-clients', JSON.stringify(syncedClients));
        setClients(syncedClients);

        // Set current client
        let currentClientId = localStorage.getItem('growth-os-current-client');
        if (!currentClientId || !syncedClients.some(c => c.id === currentClientId)) {
          currentClientId = syncedClients[0]?.id || null;
          if (currentClientId) {
            localStorage.setItem('growth-os-current-client', currentClientId);
          }
        }
        setCurrentClient(currentClientId);

      } catch (error) {
        console.error('❌ Error loading and syncing clients:', error);
        // Fallback to only localStorage if DB fails
        const localClients = getAllClients();
        setClients(localClients);
        const currentClientId = localStorage.getItem('growth-os-current-client');
        setCurrentClient(currentClientId);
      }
    };

    fetchAndSyncClients();
  }, []);

  const saveClients = (updatedClients: Client[]) => {
    setClients(updatedClients);
    localStorage.setItem('growth-os-clients', JSON.stringify(updatedClients));
  };

  const handleAddClient = () => {
    setEditingClient({ ...defaultClient });
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveClient = async () => {
    if (!editingClient || !editingClient.name) return;

    const clientData: Client = {
      id: isAddingNew ? editingClient.name.toLowerCase().replace(/\s+/g, '-') : editingClient.id!,
      name: editingClient.name,
      industry: editingClient.industry || 'restaurant',
      logo: editingClient.logo,
      branding: editingClient.branding || defaultClient.branding,
      contact: editingClient.contact || defaultClient.contact,
      googleAdsCustomerId: editingClient.googleAdsCustomerId,
      metaAdsAccountId: editingClient.metaAdsAccountId,
      googleAnalyticsPropertyId: editingClient.googleAnalyticsPropertyId,
      status: editingClient.status || 'active',
      createdAt: isAddingNew ? new Date().toISOString() : editingClient.createdAt!,
    };

    let updatedClients;
    if (isAddingNew) {
      updatedClients = [...clients, clientData];
    } else {
      updatedClients = clients.map(c => c.id === clientData.id ? clientData : c);
    }

    // Save to localStorage first (existing functionality)
    saveClients(updatedClients);
    
    // Also save to database via API
    console.log('🔧 DEBUG: Save function called');
    console.log('🔧 DEBUG: isAddingNew =', isAddingNew);
    console.log('🔧 DEBUG: clientData.id =', clientData.id);
    console.log('🔧 DEBUG: clientData =', clientData);
    
    try {
      if (isAddingNew) {
        console.log('🔄 Creating new client in database:', clientData.name);
        
        const response = await fetch('/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Client created in database successfully:', clientData.name);
        } else {
          throw new Error(result.error || 'Failed to create client');
        }
      } else {
        console.log('🔄 Updating existing client in database:', clientData.name);
        console.log('🔄 API URL will be:', `/api/clients/${clientData.id}`);
        
        const response = await fetch(`/api/clients/${clientData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData),
        });
        
        console.log('🔄 API response status:', response.status);
        const result = await response.json();
        console.log('🔄 API response data:', result);
        
        if (result.success) {
          console.log('✅ Client updated in database successfully:', clientData.name);
        } else {
          throw new Error(result.error || 'Failed to update client');
        }
      }
    } catch (error) {
      console.error('❌ Database operation failed:', error);
      // Continue with localStorage-only operation
    }
    
    setIsEditing(false);
    setEditingClient(null);
    setIsAddingNew(false);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (clients.length <= 1) {
      alert('Cannot delete the last client. Add another client first.');
      return;
    }

    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      const updatedClients = clients.filter(c => c.id !== clientId);
      saveClients(updatedClients);

      if (currentClient === clientId) {
        const newCurrentClient = updatedClients[0]?.id;
        setCurrentClient(newCurrentClient);
        localStorage.setItem('growth-os-current-client', newCurrentClient);
      }
      
      // Also delete from database via API
      try {
        console.log('🔄 Deleting client from database:', clientId);
        const response = await fetch(`/api/clients/${clientId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('✅ Client deleted from database:', clientId);
        } else {
          throw new Error('Delete API call failed');
        }
      } catch (error) {
        console.error('❌ Failed to delete client from database:', error);
        // Continue with localStorage-only operation
      }
    }
  };

  const handleSetCurrentClient = (clientId: string) => {
    setCurrentClient(clientId);
    localStorage.setItem('growth-os-current-client', clientId);
    
    // Trigger storage event for sidebar to update without reload
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'growth-os-current-client',
      newValue: clientId,
      oldValue: currentClient || ''
    }));
    
    // Trigger custom event for immediate updates
    window.dispatchEvent(new CustomEvent('clientChanged', {
      detail: { clientId }
    }));
    
    // Show success message instead of reload
    alert(`Successfully switched to ${clients.find(c => c.id === clientId)?.name || 'client'}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (editingClient) {
          setEditingClient({
            ...editingClient,
            logo: event.target?.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Building size={24} />
            Client Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Manage restaurant clients and their branding
          </p>
        </div>
        <button
          onClick={handleAddClient}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Client
        </button>
      </div>

      {/* Current Client */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
          Current Active Client
        </h3>
        {currentClient && clients.find(c => c.id === currentClient) && (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
              {clients.find(c => c.id === currentClient)?.logo ? (
                <img 
                  src={clients.find(c => c.id === currentClient)?.logo} 
                  alt="Client logo"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {clients.find(c => c.id === currentClient)?.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                {clients.find(c => c.id === currentClient)?.name}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {clients.find(c => c.id === currentClient)?.industry}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Clients List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users size={20} />
            All Clients ({clients.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {clients.map((client) => (
            <div key={client.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {client.logo ? (
                      <img 
                        src={client.logo} 
                        alt={client.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400 font-bold text-xl">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      {client.name}
                      {currentClient === client.id && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{client.industry}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">{client.contact.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: client.branding.primaryColor }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: client.branding.secondaryColor }}
                        ></div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {client.branding.fontFamily}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentClient !== client.id && (
                    <button
                      onClick={() => handleSetCurrentClient(client.id)}
                      className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClient(client)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Client Modal */}
      <AnimatePresence>
        {isEditing && editingClient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  {isAddingNew ? 'Add New Client' : 'Edit Client'}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Restaurant Name *
                      </label>
                      <input
                        type="text"
                        value={editingClient.name || ''}
                        onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="Pizza Palace"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Industry
                      </label>
                      <select
                        value={editingClient.industry || ''}
                        onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                      >
                        {industryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Logo</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      {editingClient.logo ? (
                        <img 
                          src={editingClient.logo} 
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="text-slate-400" size={24} />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                      >
                        Upload Logo
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Branding */}
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Palette size={20} />
                    Branding
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editingClient.branding?.primaryColor || '#3b82f6'}
                          onChange={(e) => setEditingClient({
                            ...editingClient,
                            branding: { ...editingClient.branding!, primaryColor: e.target.value }
                          })}
                          className="w-12 h-10 rounded border border-slate-300 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={editingClient.branding?.primaryColor || '#3b82f6'}
                          onChange={(e) => setEditingClient({
                            ...editingClient,
                            branding: { ...editingClient.branding!, primaryColor: e.target.value }
                          })}
                          className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editingClient.branding?.secondaryColor || '#8b5cf6'}
                          onChange={(e) => setEditingClient({
                            ...editingClient,
                            branding: { ...editingClient.branding!, secondaryColor: e.target.value }
                          })}
                          className="w-12 h-10 rounded border border-slate-300 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={editingClient.branding?.secondaryColor || '#8b5cf6'}
                          onChange={(e) => setEditingClient({
                            ...editingClient,
                            branding: { ...editingClient.branding!, secondaryColor: e.target.value }
                          })}
                          className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Font Family
                      </label>
                      <select
                        value={editingClient.branding?.fontFamily || 'Inter'}
                        onChange={(e) => setEditingClient({
                          ...editingClient,
                          branding: { ...editingClient.branding!, fontFamily: e.target.value }
                        })}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                      >
                        {fontOptions.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Contact Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingClient.contact?.email || ''}
                        onChange={(e) => setEditingClient({
                          ...editingClient,
                          contact: { ...editingClient.contact!, email: e.target.value }
                        })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="owner@restaurant.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editingClient.contact?.phone || ''}
                          onChange={(e) => setEditingClient({
                            ...editingClient,
                            contact: { ...editingClient.contact!, phone: e.target.value }
                          })}
                          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Status
                        </label>
                        <select
                          value={editingClient.status || 'active'}
                          onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as 'active' | 'inactive' })}
                          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Google Ads Customer ID
                      </label>
                      <input
                        type="text"
                        value={editingClient.googleAdsCustomerId || ''}
                        onChange={(e) => setEditingClient({
                          ...editingClient,
                          googleAdsCustomerId: e.target.value
                        })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="123-456-7890"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Find this 10-digit ID in the top right corner of Google Ads (format: 123-456-7890)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Meta Ads Account ID
                      </label>
                      <input
                        type="text"
                        value={editingClient.metaAdsAccountId || ''}
                        onChange={(e) => setEditingClient({
                          ...editingClient,
                          metaAdsAccountId: e.target.value
                        })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="123-456-7890"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Find this 10-digit ID in the top right corner of Meta Ads (format: 123-456-7890)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Google Analytics Property ID
                      </label>
                      <input
                        type="text"
                        value={editingClient.googleAnalyticsPropertyId || ''}
                        onChange={(e) => setEditingClient({
                          ...editingClient,
                          googleAnalyticsPropertyId: e.target.value
                        })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="123456789"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Find this in Google Analytics → Admin → Property Settings (format: 123456789)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Address
                      </label>
                      <textarea
                        value={editingClient.contact?.address || ''}
                        onChange={(e) => setEditingClient({
                          ...editingClient,
                          contact: { ...editingClient.contact!, address: e.target.value }
                        })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        rows={3}
                        placeholder="123 Main St, Anytown, USA"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClient}
                    disabled={!editingClient.name}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={16} />
                    {isAddingNew ? 'Add Client' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 
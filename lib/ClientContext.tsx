'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client } from '../components/Settings/ClientManagement';

interface ClientContextType {
  currentClient: Client | null;
  allClients: Client[];
  setCurrentClient: (clientId: string) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  refreshClients: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function useClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [currentClient, setCurrentClientState] = useState<Client | null>(null);
  const [allClients, setAllClients] = useState<Client[]>([]);

  const refreshClients = () => {
    // Load clients from localStorage
    const savedClients = localStorage.getItem('growth-os-clients');
    const savedCurrentClientId = localStorage.getItem('growth-os-current-client');
    
    if (savedClients) {
      const clients: Client[] = JSON.parse(savedClients);
      setAllClients(clients);
      
      if (savedCurrentClientId) {
        const client = clients.find(c => c.id === savedCurrentClientId);
        setCurrentClientState(client || null);
      }
    } else {
      // Set up default client if none exist
      const defaultClient: Client = {
        id: 'pizza-palace',
        name: 'Pizza Palace',
        industry: 'Quick Service Restaurant',
        branding: {
          primaryColor: '#e53e3e',
          secondaryColor: '#ff6b6b',
          fontFamily: 'Inter',
        },
        contact: {
          email: 'owner@pizzapalace.com',
          phone: '(555) 123-4567',
          address: '123 Main St, Anytown, USA',
        },
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      setAllClients([defaultClient]);
      setCurrentClientState(defaultClient);
      localStorage.setItem('growth-os-clients', JSON.stringify([defaultClient]));
      localStorage.setItem('growth-os-current-client', defaultClient.id);
    }
  };

  useEffect(() => {
    refreshClients();
  }, []);

  const setCurrentClient = (clientId: string) => {
    const client = allClients.find(c => c.id === clientId);
    if (client) {
      setCurrentClientState(client);
      localStorage.setItem('growth-os-current-client', clientId);
    }
  };

  const addClient = (client: Client) => {
    const updatedClients = [...allClients, client];
    setAllClients(updatedClients);
    localStorage.setItem('growth-os-clients', JSON.stringify(updatedClients));
  };

  const updateClient = (updatedClient: Client) => {
    const updatedClients = allClients.map(c => 
      c.id === updatedClient.id ? updatedClient : c
    );
    setAllClients(updatedClients);
    localStorage.setItem('growth-os-clients', JSON.stringify(updatedClients));
    
    // Update current client if it's the one being updated
    if (currentClient?.id === updatedClient.id) {
      setCurrentClientState(updatedClient);
    }
  };

  const deleteClient = (clientId: string) => {
    if (allClients.length <= 1) {
      throw new Error('Cannot delete the last client');
    }
    
    const updatedClients = allClients.filter(c => c.id !== clientId);
    setAllClients(updatedClients);
    localStorage.setItem('growth-os-clients', JSON.stringify(updatedClients));
    
    // If deleting current client, switch to first available
    if (currentClient?.id === clientId) {
      const newCurrentClient = updatedClients[0];
      setCurrentClientState(newCurrentClient);
      localStorage.setItem('growth-os-current-client', newCurrentClient.id);
    }
  };

  const value: ClientContextType = {
    currentClient,
    allClients,
    setCurrentClient,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
} 
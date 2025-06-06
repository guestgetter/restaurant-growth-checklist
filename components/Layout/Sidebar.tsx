'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Target, 
  FileText, 
  Settings,
  Menu,
  X,
  Home,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  User,
  LogOut
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Client } from '../Settings/ClientManagement';
import { initializeDefaultClient, getAllClients } from '../../lib/clientUtils';
import { filterClientsForUser, getDefaultClientForUser } from '../../lib/clientAccess';

interface SidebarItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  comingSoon?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: <Home size={20} />,
    href: '/',
  },
  {
    id: 'checklist',
    title: 'Growth System Checklist',
    icon: <CheckSquare size={20} />,
    href: '/checklist',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    href: '/dashboard',
  },
  {
    id: 'leverage',
    title: 'Leverage',
    icon: <Target size={20} />,
    href: '/leverage',
    comingSoon: true,
  },
  {
    id: 'reports',
    title: 'Report & Insights Generator',
    icon: <FileText size={20} />,
    href: '/reports',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <Settings size={20} />,
    href: '/settings',
  },
];

// User Profile Component
function UserProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        {session.user.image ? (
          <img 
            src={session.user.image} 
            alt={session.user.name || 'User'} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        )}
        
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {session.user.name || 'User'}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {session.user.email}
                  </p>
                  {session.user.role === 'team' && (
                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded">
                      Team
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut size={14} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [showClientSwitcher, setShowClientSwitcher] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const loadClients = async () => {
    if (!session) {
      setIsLoadingClients(false);
      return;
    }

    try {
      setIsLoadingClients(true);
      
      // Get all clients from storage
      const allStoredClients = getAllClients();
      
      // Filter clients based on user permissions
      const allowedClients = filterClientsForUser(allStoredClients, session);
      
      // Set allowed clients
      setAllClients(allowedClients);
      
      // Set current client based on user permissions
      if (session?.user?.role === 'client') {
        // Restaurant clients automatically get their specific restaurant
        const defaultClient = getDefaultClientForUser(allStoredClients, session);
        if (defaultClient) {
          setCurrentClient(defaultClient);
          localStorage.setItem('growth-os-current-client', defaultClient.id);
        }
      } else {
        // Team members can use the stored current client or default
        const storedCurrentClientId = localStorage.getItem('growth-os-current-client');
        const storedCurrentClient = allowedClients.find(c => c.id === storedCurrentClientId);
        
        if (storedCurrentClient) {
          setCurrentClient(storedCurrentClient);
        } else if (allowedClients.length > 0) {
          // Fall back to first allowed client
          setCurrentClient(allowedClients[0]);
          localStorage.setItem('growth-os-current-client', allowedClients[0].id);
        } else {
          // Initialize default client if none exists (for team members)
          const defaultClient = initializeDefaultClient();
          setCurrentClient(defaultClient);
          setAllClients([defaultClient]);
        }
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      // Ensure we have at least a default client even if there's an error
      try {
        const defaultClient = initializeDefaultClient();
        setCurrentClient(defaultClient);
        setAllClients([defaultClient]);
      } catch (fallbackError) {
        console.error('Failed to initialize default client:', fallbackError);
      }
    } finally {
      setIsLoadingClients(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') {
      return; // Still loading session
    }
    
    if (session) {
      loadClients();
    } else {
      setIsLoadingClients(false);
      setCurrentClient(null);
      setAllClients([]);
    }
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'growth-os-current-client' || e.key === 'growth-os-clients') {
        if (session) {
          loadClients();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [session, status]); // Re-run when session or status changes

  // Fallback timeout to ensure loading doesn't get stuck
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoadingClients) {
        console.warn('Client loading timeout - forcing completion');
        setIsLoadingClients(false);
        
        // Try to initialize a default client if we don't have one
        if (!currentClient && session) {
          try {
            const defaultClient = initializeDefaultClient();
            setCurrentClient(defaultClient);
            setAllClients([defaultClient]);
          } catch (error) {
            console.error('Failed to initialize fallback client:', error);
          }
        }
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [isLoadingClients, currentClient, session]);

  const switchClient = (clientId: string) => {
    console.log('switchClient called with:', clientId);
    
    const client = allClients.find(c => c.id === clientId);
    if (!client) {
      console.error('Client not found:', clientId);
      return;
    }
    
    console.log('Switching to client:', client.name);
    
    // Update localStorage
    localStorage.setItem('growth-os-current-client', clientId);
    
    // Update state immediately
    setCurrentClient(client);
    setShowClientSwitcher(false);
    
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'growth-os-current-client',
      newValue: clientId,
      oldValue: currentClient?.id || ''
    }));
    
    // Trigger custom event for immediate updates
    window.dispatchEvent(new CustomEvent('clientChanged', {
      detail: { clientId, client }
    }));
    
    console.log('Client switch events dispatched');
    
    // Force a page refresh for reports and other data-dependent components
    if (window.location.pathname === '/reports') {
      console.log('On reports page, scheduling refresh');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.client-switcher')) {
        setShowClientSwitcher(false);
      }
    };

    if (showClientSwitcher) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showClientSwitcher]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Guest Getter Logo Header */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-center">
            <img 
              src="/guest-getter-logo-light.png" 
              alt="Guest Getter" 
              className="h-8 object-contain dark:hidden"
            />
            <img 
              src="/guest-getter-logo-dark.png" 
              alt="Guest Getter" 
              className="h-8 object-contain hidden dark:block"
            />
          </div>
        </div>
      )}
      
      {/* Growth OS Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-slate-100">Growth OS</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Restaurant Growth Platform</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors lg:block hidden"
          >
            <Menu size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Current Client */}
      {currentClient && !isCollapsed && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
          <div className="flex items-center gap-3">
            {currentClient.logo ? (
              <img 
                src={currentClient.logo} 
                alt={currentClient.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {currentClient.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                {currentClient.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {currentClient.industry}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Client Switcher */}
      <div className="relative p-4 border-b border-slate-200 dark:border-slate-700 client-switcher">
        {isLoadingClients ? (
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ) : currentClient ? (
          <>
            <button
              onClick={() => {
                // Only allow switching for team members with multiple clients
                if (session?.user?.role === 'team' && allClients.length > 1) {
                  setShowClientSwitcher(!showClientSwitcher)
                }
              }}
              className={`w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors client-switcher ${
                session?.user?.role === 'team' && allClients.length > 1 
                  ? 'hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer' 
                  : 'cursor-default'
              }`}
            >
              {currentClient.logo ? (
                <img 
                  src={currentClient.logo} 
                  alt={`${currentClient.name} logo`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: currentClient.branding?.primaryColor || '#3B82F6' }}
                >
                  {currentClient.name?.charAt(0) || 'R'}
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">
                  {currentClient.name || 'Loading...'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentClient.industry || 'Restaurant'}
                </p>
              </div>
              {/* Only show dropdown arrow for team members with multiple clients */}
              {session?.user?.role === 'team' && allClients.length > 1 && (
                showClientSwitcher ? (
                  <ChevronUp className="text-slate-400" size={16} />
                ) : (
                  <ChevronDown className="text-slate-400" size={16} />
                )
              )}
            </button>

            {/* Dropdown */}
            {showClientSwitcher && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto client-switcher">
                <div className="p-2 client-switcher">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">
                    Switch Client
                  </div>
                  
                  {allClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        switchClient(client.id);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors client-switcher ${
                        client.id === currentClient.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {client.logo ? (
                        <img 
                          src={client.logo} 
                          alt={`${client.name} logo`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: client.branding?.primaryColor || '#3B82F6' }}
                        >
                          {client.name?.charAt(0) || 'R'}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {client.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {client.industry}
                        </p>
                      </div>
                      {client.id === currentClient.id && (
                        <Check className="text-blue-500" size={14} />
                      )}
                    </button>
                  ))}
                  
                  {/* Only show Manage Clients for team members */}
                  {session?.user?.role === 'team' && (
                    <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                      <Link
                        href="/settings"
                        onClick={() => setShowClientSwitcher(false)}
                        className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-blue-600 dark:text-blue-400 client-switcher"
                      >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Manage Clients</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm text-slate-500 dark:text-slate-400">No clients available</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.comingSoon ? '#' : item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
              isActive(item.href) && !item.comingSoon
                ? 'bg-blue-500 text-white shadow-lg'
                : item.comingSoon
                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            onClick={(e) => item.comingSoon && e.preventDefault()}
          >
            <div className={`${isActive(item.href) && !item.comingSoon ? 'text-white' : ''}`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="font-medium truncate">{item.title}</span>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.comingSoon && (
                    <span className="px-2 py-1 text-xs bg-amber-100 text-amber-600 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <UserProfile isCollapsed={isCollapsed} />

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Growth OS v1.0
            <br />
            Built for Restaurant Success
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img 
              src="/guest-getter-logo-light.png" 
              alt="Guest Getter" 
              className="h-8 object-contain dark:hidden"
            />
            <img 
              src="/guest-getter-logo-dark.png" 
              alt="Guest Getter" 
              className="h-8 object-contain hidden dark:block"
            />
            <h1 className="font-bold text-slate-800 dark:text-slate-100">Growth OS</h1>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="w-80 h-full bg-white dark:bg-slate-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <img 
                    src="/guest-getter-logo-light.png" 
                    alt="Guest Getter" 
                    className="h-8 object-contain dark:hidden"
                  />
                  <img 
                    src="/guest-getter-logo-dark.png" 
                    alt="Guest Getter" 
                    className="h-8 object-contain hidden dark:block"
                  />
                  <h1 className="font-bold text-slate-800 dark:text-slate-100">Growth OS</h1>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarContent />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
} 
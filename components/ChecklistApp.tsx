'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  Trophy, 
  Target, 
  BarChart3, 
  Download, 
  Share2, 
  RotateCcw, 
  Moon, 
  Sun,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  ExternalLink,
  FileText,
  Play,
  Settings,
  BookOpen
} from 'lucide-react';
import { checklistData, ChecklistItem, ChecklistSection, ChecklistSubTask } from '../app/data/checklist-data';
import { Client } from './Settings/ClientManagement';
import { migrateGlobalProgressToClient } from '../lib/migrateProgress';
import { 
  safeArray, 
  safeMap, 
  safeFilter, 
  safeGet, 
  safeString, 
  safeNumber,
  safeLocalStorage,
  safeJsonParse,
  safeJsonStringify,
  isValidObject,
  validateArray
} from '../lib/defensive';

export default function ChecklistApp() {
  const [sections, setSections] = useState<ChecklistSection[]>(checklistData);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [completedSubTasks, setCompletedSubTasks] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'all' | string>('all');
  const [showStats, setShowStats] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  // Load current client and client-specific progress
  useEffect(() => {
    const loadClientAndProgress = () => {
      // First, migrate any existing global progress
      migrateGlobalProgressToClient();
      
      // Load current client with safe operations
      const savedCurrentClientId = safeLocalStorage.getItem('growth-os-current-client');
      const savedClients = safeLocalStorage.getItem('growth-os-clients');
      
      // Debug logging
      console.log('Loading clients:', { savedCurrentClientId, savedClients });
      
      let clients: Client[] = [];
      let currentClientId = savedCurrentClientId;
      
      // Safe JSON parsing with validation
      clients = safeJsonParse<Client[]>(savedClients, []);
      
      // Validate that clients is actually an array
      clients = validateArray<Client>(clients, 'clients');
      console.log('Safely parsed clients:', clients);
      
      // Create default client ONLY if absolutely no clients exist
      if (clients.length === 0) {
        console.log('No clients found, creating default client');
        const defaultClient: Client = {
          id: '1',
          name: 'Pizza Palace',
          industry: 'Quick Service Restaurant',
          logo: '',
          branding: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF',
            fontFamily: 'Inter'
          },
          contact: {
            email: 'info@pizzapalace.com',
            phone: '(555) 123-4567',
            address: '123 Main St, Your City'
          },
          status: 'active',
          createdAt: new Date().toISOString()
        };
        
        clients = [defaultClient];
        currentClientId = defaultClient.id;
        
        // Save to localStorage with safe operations
        safeLocalStorage.setItem('growth-os-clients', safeJsonStringify(clients));
        safeLocalStorage.setItem('growth-os-current-client', currentClientId || '');
        console.log('Saved default client to localStorage');
      } else {
        console.log('Found existing clients, preserving them');
      }
      
      // Find and set current client
      if (currentClientId && clients.length > 0) {
        const client = clients.find(c => c.id === currentClientId) || clients[0];
        setCurrentClient(client);
        
        // Update current client ID if we fell back to first client
        if (client.id !== currentClientId) {
          safeLocalStorage.setItem('growth-os-current-client', client.id);
        }
        
        // Load progress specific to this client
        const clientProgressKey = `restaurant-checklist-progress-${client.id}`;
        const clientSubTasksKey = `restaurant-checklist-subtasks-${client.id}`;
        
        const saved = safeLocalStorage.getItem(clientProgressKey);
        const savedSubTasks = safeLocalStorage.getItem(clientSubTasksKey);
        
        // Safe parsing of completed IDs
        const completedIds = safeJsonParse<string[]>(saved, []);
        if (safeArray(completedIds).length > 0) {
          setCompletedItems(new Set(completedIds));
          
          // Update sections with completed status for this client
          setSections(prevSections => 
            prevSections.map(section => ({
              ...section,
              items: section.items.map(item => ({
                ...item,
                completed: completedIds.includes(item.id)
              }))
            }))
          );
        } else {
          // No progress for this client yet - reset to empty
          setCompletedItems(new Set());
          setSections(checklistData); // Reset to default state
        }

        // Safe parsing of completed subtasks
        const completedSubTaskIds = safeJsonParse<string[]>(savedSubTasks, []);
        setCompletedSubTasks(new Set(safeArray(completedSubTaskIds)));
      } else {
        // Fallback: create and set a default client immediately
        const fallbackClient: Client = {
          id: Date.now().toString(),
          name: 'My Restaurant',
          industry: 'Restaurant',
          logo: '',
          branding: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF',
            fontFamily: 'Inter'
          },
          contact: {
            email: '',
            phone: '',
            address: ''
          },
          status: 'active',
          createdAt: new Date().toISOString()
        };
        
        setCurrentClient(fallbackClient);
        safeLocalStorage.setItem('growth-os-clients', safeJsonStringify([fallbackClient]));
        safeLocalStorage.setItem('growth-os-current-client', fallbackClient.id);
        
        // Initialize with empty progress
        setCompletedItems(new Set());
        setCompletedSubTasks(new Set());
        setSections(checklistData);
      }
    };

    loadClientAndProgress();

    // Load theme with safe localStorage
    const savedTheme = safeLocalStorage.getItem('restaurant-checklist-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Listen for client changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'growth-os-current-client') {
        loadClientAndProgress();
      }
    };

    // Listen for custom client change events for immediate updates
    const handleClientChange = (e: CustomEvent) => {
      if (e.detail.client) {
        setCurrentClient(e.detail.client);
        // Reload progress for the new client
        setTimeout(() => {
          loadClientAndProgress();
        }, 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('clientChanged', handleClientChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clientChanged', handleClientChange as EventListener);
    };
  }, []);

  // Save progress to localStorage for current client with defensive programming
  const saveProgress = (newCompletedItems: Set<string>) => {
    if (currentClient?.id) {
      const clientProgressKey = `restaurant-checklist-progress-${currentClient.id}`;
      const progressArray = Array.from(newCompletedItems);
      safeLocalStorage.setItem(clientProgressKey, safeJsonStringify(progressArray));
    }
  };

  // Save sub-task progress to localStorage for current client with defensive programming
  const saveSubTaskProgress = (newCompletedSubTasks: Set<string>) => {
    if (currentClient?.id) {
      const clientSubTasksKey = `restaurant-checklist-subtasks-${currentClient.id}`;
      const subTasksArray = Array.from(newCompletedSubTasks);
      safeLocalStorage.setItem(clientSubTasksKey, safeJsonStringify(subTasksArray));
    }
  };

  // Toggle dark mode with safe localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      safeLocalStorage.setItem('restaurant-checklist-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      safeLocalStorage.setItem('restaurant-checklist-theme', 'light');
    }
  };

  const toggleItem = (itemId: string) => {
    const newCompletedItems = new Set(completedItems);
    
    if (newCompletedItems.has(itemId)) {
      newCompletedItems.delete(itemId);
    } else {
      newCompletedItems.add(itemId);
    }
    
    setCompletedItems(newCompletedItems);
    saveProgress(newCompletedItems);
    
    // Update sections
    setSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        items: section.items.map(item => 
          item.id === itemId 
            ? { ...item, completed: !item.completed }
            : item
        )
      }))
    );
  };

  const toggleSubTask = (subTaskId: string) => {
    const newCompletedSubTasks = new Set(completedSubTasks);
    
    if (newCompletedSubTasks.has(subTaskId)) {
      newCompletedSubTasks.delete(subTaskId);
    } else {
      newCompletedSubTasks.add(subTaskId);
    }
    
    setCompletedSubTasks(newCompletedSubTasks);
    saveSubTaskProgress(newCompletedSubTasks);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    
    setExpandedItems(newExpandedItems);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen size={14} />;
      case 'video': return <Play size={14} />;
      case 'tool': return <Settings size={14} />;
      case 'template': return <FileText size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };

  const resetProgress = () => {
    if (!currentClient?.id || !currentClient?.name) return;
    
    if (confirm(`Are you sure you want to reset all progress for ${currentClient.name}? This cannot be undone.`)) {
      setCompletedItems(new Set());
      setCompletedSubTasks(new Set());
      const clientProgressKey = `restaurant-checklist-progress-${currentClient.id}`;
      const clientSubTasksKey = `restaurant-checklist-subtasks-${currentClient.id}`;
      safeLocalStorage.removeItem(clientProgressKey);
      safeLocalStorage.removeItem(clientSubTasksKey);
      setSections(validateArray(checklistData, 'checklistData'));
    }
  };

  const exportProgress = () => {
    if (!currentClient) return;
    
    const data = {
      client: {
        name: currentClient.name,
        industry: currentClient.industry
      },
      timestamp: new Date().toISOString(),
      completedItems: Array.from(completedItems),
      completedSubTasks: Array.from(completedSubTasks),
      totalItems: sections.reduce((acc, section) => acc + section.items.length, 0),
      totalSubTasks: sections.reduce((acc, section) => 
        acc + section.items.reduce((itemAcc, item) => itemAcc + (item.subTasks?.length || 0), 0), 0),
      progress: Math.round((completedItems.size / sections.reduce((acc, section) => acc + section.items.length, 0)) * 100)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentClient.name.toLowerCase().replace(/\s+/g, '-')}-growth-checklist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProgress = async () => {
    if (!currentClient) return;
    
    const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
    const progress = Math.round((completedItems.size / totalItems) * 100);
    
    const shareText = `${currentClient.name} - Restaurant Growth OS Checklist Progress: ${completedItems.size}/${totalItems} items completed (${progress}%)`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    }
  };

  // Don't render until we have a current client
  if (!currentClient) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading client data...</p>
        </div>
      </div>
    );
  }

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
  const progressPercentage = Math.round((completedItems.size / totalItems) * 100);

  const getSectionProgress = (section: ChecklistSection) => {
    // Defensive programming for section progress calculation
    if (!section || !Array.isArray(section.items)) {
      console.warn('getSectionProgress: Invalid section or items:', section);
      return 0;
    }
    
    if (section.items.length === 0) return 0;
    
    const sectionCompleted = section.items.filter(
      (item: ChecklistItem) => item?.id && completedItems.has(item.id)
    ).length;
    
    return Math.round((sectionCompleted / section.items.length) * 100);
  };

  // Safe section filtering with defensive programming
  const filteredSections = currentView === 'all' 
    ? (Array.isArray(sections) ? sections : [])
    : (Array.isArray(sections) ? sections.filter(section => section?.id === currentView) : []);

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Checklist Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Growth System Checklist
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                {currentClient.name} - Your comprehensive roadmap to restaurant success
              </p>
            </div>
            
            {/* Progress Circle */}
            <div className="relative">
              <div className="w-20 h-20 relative">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-200 dark:text-slate-700"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    className="text-blue-500 dark:text-blue-400"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progressPercentage / 100 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{
                      strokeDasharray: '251.2',
                      strokeDashoffset: 251.2 * (1 - progressPercentage / 100),
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-3 py-2 bg-slate-600 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors text-sm"
            >
              <BarChart3 size={16} />
              Stats
            </button>
            <button
              onClick={exportProgress}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-500 transition-colors text-sm"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={shareProgress}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 dark:bg-purple-600 text-white rounded-lg hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors text-sm"
            >
              <Share2 size={16} />
              Share
            </button>
            <button
              onClick={resetProgress}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition-colors text-sm"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCurrentView('all')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                currentView === 'all' 
                  ? 'bg-slate-800 dark:bg-slate-600 text-white' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              All Sections
            </button>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setCurrentView(section.id)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                  currentView === section.id 
                    ? 'bg-slate-800 dark:bg-slate-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{section.emoji}</span>
                <span className="hidden sm:inline">{section.title}</span>
                <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
                  {getSectionProgress(section)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedItems.size}</div>
                  <div className="text-sm opacity-90">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalItems - completedItems.size}</div>
                  <div className="text-sm opacity-90">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <div className="text-sm opacity-90">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{progressPercentage}%</div>
                  <div className="text-sm opacity-90">Progress</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {filteredSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden checklist-card transition-colors duration-300"
            >
              {/* Section Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-6 border-b border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl shadow-md">
                      {section.emoji}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{section.title}</h2>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{section.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {getSectionProgress(section)}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {(section.items || []).filter(item => item?.id && completedItems.has(item.id)).length}/{(section.items || []).length}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getSectionProgress(section)}%` }}
                      transition={{ duration: 1, delay: sectionIndex * 0.1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Section Items */}
              <div className="p-6">
                <div className="space-y-3">
                  {(section.items || []).map((item, itemIndex) => {
                    // Defensive check for item validity
                    if (!item || !item.id) {
                      console.warn('Invalid item in section:', section.id, item);
                      return null;
                    }
                    
                    return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      className={`border-2 rounded-xl transition-all duration-300 ${
                        item.completed
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {/* Main Item */}
                      <div className="flex items-start gap-4 p-4">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
                        >
                          {item.completed ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-green-600 dark:text-green-400"
                            >
                              <CheckSquare size={20} />
                            </motion.div>
                          ) : (
                            <Square size={20} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed transition-colors ${
                            item.completed 
                              ? 'text-green-800 dark:text-green-300 line-through' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {item.text}
                          </p>
                        </div>
                        {(item.description || item.subTasks || item.tips || item.resources) && (
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="flex-shrink-0 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                          >
                            {expandedItems.has(item.id) ? (
                              <ChevronDown size={16} className="text-slate-500" />
                            ) : (
                              <ChevronRight size={16} className="text-slate-500" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedItems.has(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4 border-t border-slate-200 dark:border-slate-600 pt-4">
                              {/* Description */}
                              {item.description && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                  <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {item.description}
                                  </p>
                                </div>
                              )}

                              {/* Sub-tasks */}
                              {item.subTasks && item.subTasks.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                                    <Target size={16} />
                                    Action Steps
                                  </h4>
                                  <div className="space-y-2">
                                    {(item.subTasks || []).map((subTask: ChecklistSubTask) => {
                                      if (!subTask?.id) return null;
                                      return (
                                      <div
                                        key={subTask.id}
                                        className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600"
                                      >
                                        <button
                                          onClick={() => toggleSubTask(subTask.id)}
                                          className="flex-shrink-0"
                                        >
                                          {completedSubTasks.has(subTask.id) ? (
                                            <CheckSquare size={16} className="text-green-600 dark:text-green-400" />
                                          ) : (
                                            <Square size={16} className="text-slate-400 dark:text-slate-500" />
                                          )}
                                        </button>
                                        <span className={`text-sm ${
                                          completedSubTasks.has(subTask.id)
                                            ? 'text-green-700 dark:text-green-300 line-through'
                                            : 'text-slate-600 dark:text-slate-400'
                                        }`}>
                                          {subTask.text}
                                        </span>
                                      </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Tips */}
                              {item.tips && item.tips.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                                    <Lightbulb size={16} />
                                    Pro Tips
                                  </h4>
                                  <div className="space-y-2">
                                    {item.tips.map((tip, tipIndex) => (
                                      <div
                                        key={tipIndex}
                                        className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
                                      >
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-sm text-amber-800 dark:text-amber-200">{tip}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Resources */}
                              {item.resources && item.resources.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                                    <BookOpen size={16} />
                                    Resources
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {item.resources.map((resource, resourceIndex) => (
                                      <a
                                        key={resourceIndex}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                      >
                                        <div className="text-blue-500 dark:text-blue-400">
                                          {getResourceIcon(resource.type)}
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                          {resource.title}
                                        </span>
                                        <ExternalLink size={12} className="text-slate-400 ml-auto" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completion Celebration */}
        <AnimatePresence>
          {progressPercentage === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center max-w-md mx-auto border dark:border-slate-700"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Congratulations!
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {currentClient.name} has completed the entire Restaurant Growth OS Checklist! 
                  This restaurant is ready for explosive growth.
                </p>
                <button
                  onClick={() => setShowStats(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 transition-colors"
                >
                  Amazing! 🚀
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
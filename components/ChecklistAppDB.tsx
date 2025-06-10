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
import { useDatabase } from '../hooks/useDatabase';

export default function ChecklistAppDB() {
  const {
    clients,
    currentClientId,
    setCurrentClientId,
    loading,
    error,
    setError,
    fetchClients,
    createClient,
    fetchChecklist,
    updateChecklistItem
  } = useDatabase();

  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [completedSubTasks, setCompletedSubTasks] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'all' | string>('all');
  const [showStats, setShowStats] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load checklist when client changes
  useEffect(() => {
    if (currentClientId) {
      loadChecklistForClient(currentClientId);
    }
  }, [currentClientId]);

  const loadChecklistForClient = async (clientId: string) => {
    try {
      const items = await fetchChecklist(clientId);
      setChecklistItems(items);
      
      // Update completed sets from database
      const completedIds: string[] = items.filter((item: any) => item.completed).map((item: any) => item.originalId);
      const completedSubIds: string[] = items.flatMap((item: any) => 
        item.subTasks.filter((sub: any) => sub.completed).map((sub: any) => sub.originalId)
      );
      
      setCompletedItems(new Set(completedIds));
      setCompletedSubTasks(new Set(completedSubIds));
    } catch (err) {
      console.error('Error loading checklist:', err);
      setError('Failed to load checklist');
    }
  };

  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('restaurant-checklist-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('restaurant-checklist-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('restaurant-checklist-theme', 'light');
    }
  };

  const toggleItem = async (originalId: string) => {
    if (!currentClientId) return;
    
    try {
      const item = checklistItems.find(i => i.originalId === originalId);
      if (!item) return;
      
      const newCompleted = !item.completed;
      
      // Update database
      await updateChecklistItem(currentClientId, item.id, undefined, newCompleted);
      
      // Update local state
      const newCompletedItems = new Set(completedItems);
      if (newCompleted) {
        newCompletedItems.add(originalId);
      } else {
        newCompletedItems.delete(originalId);
      }
      setCompletedItems(newCompletedItems);
      
      // Update the items array
      setChecklistItems(prev => 
        prev.map(i => i.id === item.id ? { ...i, completed: newCompleted } : i)
      );
      
    } catch (err) {
      console.error('Error toggling item:', err);
      setError('Failed to update item');
    }
  };

  const toggleSubTask = async (originalId: string) => {
    if (!currentClientId) return;
    
    try {
      let targetSubTask: any = null;
      let parentItem: any = null;
      
      // Find the subtask
      for (const item of checklistItems) {
        const subtask = item.subTasks.find((sub: any) => sub.originalId === originalId);
        if (subtask) {
          targetSubTask = subtask;
          parentItem = item;
          break;
        }
      }
      
      if (!targetSubTask || !parentItem) return;
      
      const newCompleted = !targetSubTask.completed;
      
      // Update database
      await updateChecklistItem(currentClientId, undefined, targetSubTask.id, newCompleted);
      
      // Update local state
      const newCompletedSubTasks = new Set(completedSubTasks);
      if (newCompleted) {
        newCompletedSubTasks.add(originalId);
      } else {
        newCompletedSubTasks.delete(originalId);
      }
      setCompletedSubTasks(newCompletedSubTasks);
      
      // Update the items array
      setChecklistItems(prev => 
        prev.map(item => 
          item.id === parentItem.id 
            ? {
                ...item,
                subTasks: item.subTasks.map((sub: any) => 
                  sub.id === targetSubTask.id ? { ...sub, completed: newCompleted } : sub
                )
              }
            : item
        )
      );
      
    } catch (err) {
      console.error('Error toggling subtask:', err);
      setError('Failed to update subtask');
    }
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'checklist': return <CheckSquare className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const resetProgress = async () => {
    if (!currentClientId) return;
    
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      try {
        // Reset all items to incomplete
        for (const item of checklistItems) {
          if (item.completed) {
            await updateChecklistItem(currentClientId, item.id, undefined, false);
          }
          // Reset subtasks
          for (const subtask of item.subTasks) {
            if (subtask.completed) {
              await updateChecklistItem(currentClientId, undefined, subtask.id, false);
            }
          }
        }
        
        // Reload checklist
        await loadChecklistForClient(currentClientId);
        
      } catch (err) {
        console.error('Error resetting progress:', err);
        setError('Failed to reset progress');
      }
    }
  };

  // Group items by section for display
  const groupedItems = checklistItems.reduce((acc: any, item: any) => {
    if (!acc[item.section.id]) {
      acc[item.section.id] = {
        ...item.section,
        items: []
      };
    }
    acc[item.section.id].items.push(item);
    return acc;
  }, {});

  const sections = Object.values(groupedItems);

  const getSectionProgress = (section: any) => {
    const items = section.items || [];
    const completedCount = items.filter((item: any) => item.completed).length;
    const totalCount = items.length;
    return { completed: completedCount, total: totalCount };
  };

  const getOverallProgress = () => {
    const total = checklistItems.length;
    const completed = checklistItems.filter(item => item.completed).length;
    return { completed, total };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading checklist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
        <button 
          onClick={() => setError(null)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentClient = clients.find(c => c.id === currentClientId);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Restaurant Growth OS
            </h1>
            {currentClient && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {currentClient.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
            
            <button
              onClick={resetProgress}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        {(() => {
          const { completed, total } = getOverallProgress();
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overall Progress</h2>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {completed} of {total} items completed
              </p>
            </div>
          );
        })()}

        {/* Checklist Sections */}
        <div className="space-y-6">
          {sections.map((section: any) => {
            const { completed, total } = getSectionProgress(section);
            const sectionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            return (
              <motion.div
                key={section.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.emoji}</span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {completed}/{total} completed
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{section.description}</p>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${sectionPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {section.items.map((item: any) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleItem(item.originalId)}
                          className="mt-1 flex-shrink-0"
                        >
                          {item.completed ? (
                            <CheckSquare className="h-5 w-5 text-green-500" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${item.completed ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                              {item.text}
                            </p>
                            
                            {item.subTasks && item.subTasks.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(item.originalId)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                {expandedItems.has(item.originalId) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                          
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {item.description}
                            </p>
                          )}
                          
                          {/* Subtasks */}
                          <AnimatePresence>
                            {expandedItems.has(item.originalId) && item.subTasks && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-2"
                              >
                                {item.subTasks.map((subtask: any) => (
                                  <div key={subtask.id} className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleSubTask(subtask.originalId)}
                                      className="flex-shrink-0"
                                    >
                                      {subtask.completed ? (
                                        <CheckSquare className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Square className="h-4 w-4 text-gray-400" />
                                      )}
                                    </button>
                                    <span className={`text-sm ${subtask.completed ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {subtask.text}
                                    </span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
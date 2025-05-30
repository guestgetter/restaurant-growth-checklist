'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, Trophy, Target, BarChart3, Download, Share2, RotateCcw, Moon, Sun } from 'lucide-react';
import { checklistData, ChecklistItem, ChecklistSection } from '../app/data/checklist-data';

export default function ChecklistApp() {
  const [sections, setSections] = useState<ChecklistSection[]>(checklistData);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'all' | string>('all');
  const [showStats, setShowStats] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load progress and theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('restaurant-checklist-progress');
    const savedTheme = localStorage.getItem('restaurant-checklist-theme');
    
    if (saved) {
      const completedIds = JSON.parse(saved);
      setCompletedItems(new Set(completedIds));
      
      // Update sections with completed status
      setSections(prevSections => 
        prevSections.map(section => ({
          ...section,
          items: section.items.map(item => ({
            ...item,
            completed: completedIds.includes(item.id)
          }))
        }))
      );
    }

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newCompletedItems: Set<string>) => {
    localStorage.setItem('restaurant-checklist-progress', JSON.stringify(Array.from(newCompletedItems)));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('restaurant-checklist-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('restaurant-checklist-theme', 'light');
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

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setCompletedItems(new Set());
      localStorage.removeItem('restaurant-checklist-progress');
      setSections(checklistData);
    }
  };

  const exportProgress = () => {
    const data = {
      timestamp: new Date().toISOString(),
      completedItems: Array.from(completedItems),
      totalItems: sections.reduce((acc, section) => acc + section.items.length, 0),
      progress: Math.round((completedItems.size / sections.reduce((acc, section) => acc + section.items.length, 0)) * 100)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurant-growth-checklist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProgress = async () => {
    const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
    const progress = Math.round((completedItems.size / totalItems) * 100);
    
    const shareText = `Restaurant Growth OS Checklist Progress: ${completedItems.size}/${totalItems} items completed (${progress}%)`;
    
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

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
  const progressPercentage = Math.round((completedItems.size / totalItems) * 100);

  const getSectionProgress = (section: ChecklistSection) => {
    const sectionCompleted = section.items.filter(item => completedItems.has(item.id)).length;
    return Math.round((sectionCompleted / section.items.length) * 100);
  };

  const filteredSections = currentView === 'all' 
    ? sections 
    : sections.filter(section => section.id === currentView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Restaurant Growth OS Checklist
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Your comprehensive roadmap to restaurant success
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
                      {section.items.filter(item => completedItems.has(item.id)).length}/{section.items.length}
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
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                        item.completed
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {item.completed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-600 dark:text-green-400"
                          >
                            <CheckSquare size={20} />
                          </motion.div>
                        ) : (
                          <Square size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed transition-colors ${
                          item.completed 
                            ? 'text-green-800 dark:text-green-300 line-through' 
                            : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                        }`}>
                          {item.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
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
                  You've completed the entire Restaurant Growth OS Checklist! 
                  Your restaurant is ready for explosive growth.
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
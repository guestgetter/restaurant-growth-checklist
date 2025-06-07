'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  ChevronDown,
  ChevronRight,
  Lightbulb,
  FileText,
  Play,
  BookOpen
} from 'lucide-react';
import { ChecklistItem, ChecklistSection, ChecklistSubTask } from '../app/data/checklist-data';
import { updateChecklistProgress } from '../app/actions';

interface ChecklistClientProps {
  sections: ChecklistSection[];
  initialCompletedItems: string[];
  initialCompletedSubTasks: string[];
  currentClientId: string;
}

export default function ChecklistClient({ 
  sections, 
  initialCompletedItems, 
  initialCompletedSubTasks, 
  currentClientId 
}: ChecklistClientProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set(initialCompletedItems));
  const [completedSubTasks, setCompletedSubTasks] = useState<Set<string>>(new Set(initialCompletedSubTasks));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'all' | string>('all');

  const toggleItem = async (itemId: string) => {
    const newCompletedItems = new Set(completedItems);
    if (newCompletedItems.has(itemId)) {
      newCompletedItems.delete(itemId);
    } else {
      newCompletedItems.add(itemId);
    }
    setCompletedItems(newCompletedItems);

    await updateChecklistProgress(currentClientId, itemId, null);
  };

  const toggleSubTask = async (itemId: string, subTaskId: string) => {
    const newCompletedSubTasks = new Set(completedSubTasks);
    if (newCompletedSubTasks.has(subTaskId)) {
      newCompletedSubTasks.delete(subTaskId);
    } else {
      newCompletedSubTasks.add(subTaskId);
    }
    setCompletedSubTasks(newCompletedSubTasks);
    
    await updateChecklistProgress(currentClientId, itemId, subTaskId);
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
      case 'article': return <FileText className="w-4 h-4 mr-2" />;
      case 'video': return <Play className="w-4 h-4 mr-2" />;
      case 'tool': return <BookOpen className="w-4 h-4 mr-2" />;
      case 'template': return <FileText className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  const visibleSections = sections.filter(section => 
    currentView === 'all' || section.id === currentView
  );

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 min-h-[100dvh]">
      {/* Header and Controls will be added back later */}
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {visibleSections.map(section => (
            <div key={section.id}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-3">{section.emoji}</span>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 transition-all">
                    <div className="flex items-start">
                      <button onClick={() => toggleItem(item.id)} className="mr-4 mt-1 flex-shrink-0">
                        {completedItems.has(item.id) ? (
                          <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                        ) : (
                          <Square className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                      <div className="flex-grow">
                        <p className={`font-semibold ${completedItems.has(item.id) ? 'line-through text-gray-500' : ''}`}>
                          {item.text}
                        </p>
                        {item.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>}
                      </div>
                      <button onClick={() => toggleExpanded(item.id)} className="ml-4 p-1">
                        {expandedItems.has(item.id) ? <ChevronDown /> : <ChevronRight />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {expandedItems.has(item.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pl-10">
                            {item.subTasks && item.subTasks.length > 0 && (
                              <div className="space-y-2 mb-4">
                                <h4 className="font-semibold text-sm">Sub-tasks:</h4>
                                {item.subTasks.map(subTask => (
                                  <div key={subTask.id} className="flex items-center">
                                    <button onClick={() => toggleSubTask(item.id, subTask.id)} className="mr-3 flex-shrink-0">
                                      {completedSubTasks.has(subTask.id) ? (
                                        <CheckSquare className="w-5 h-5 text-blue-500" />
                                      ) : (
                                        <Square className="w-5 h-5 text-gray-400" />
                                      )}
                                    </button>
                                    <span className={`text-sm ${completedSubTasks.has(subTask.id) ? 'line-through text-gray-500' : ''}`}>
                                      {subTask.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {item.tips && item.tips.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-sm mb-2 flex items-center"><Lightbulb className="w-4 h-4 mr-2 text-yellow-400"/>Pro Tips:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  {item.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                                </ul>
                              </div>
                            )}

                            {item.resources && item.resources.length > 0 && (
                               <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center"><BookOpen className="w-4 h-4 mr-2 text-green-500"/>Resources:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {item.resources.map((resource, index) => (
                                    <a href={resource.url} key={index} target="_blank" rel="noopener noreferrer" className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center hover:bg-gray-300 dark:hover:bg-gray-600">
                                       {getResourceIcon(resource.type)} {resource.title}
                                    </a>
                                  ))}
                                </div>
                               </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
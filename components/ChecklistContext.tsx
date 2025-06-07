'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { updateChecklistProgress } from '../app/actions';
import { debounce } from 'lodash';

// 1. Types and Interfaces
type Progress = { [key: string]: string[] }; // sectionId: subTaskId[]

interface ChecklistContextType {
  progress: Progress;
  toggleItem: (sectionId: string, subTaskId: string) => void;
  isCompleted: (sectionId: string, subTaskId: string) => boolean;
  getSectionProgress: (sectionId: string, totalItems: number) => number;
}

// 2. Create Context
const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

// Debounced server action
const debouncedUpdate = debounce(
  (subAccountId: string, newProgress: Progress) => {
    updateChecklistProgress(subAccountId, newProgress);
  },
  1000 // 1 second debounce delay
);

// 3. Provider Component
export const ChecklistProvider = ({
  children,
  subAccountId,
  initialProgress,
}: {
  children: ReactNode;
  subAccountId: string;
  initialProgress: Progress;
}) => {
  const [progress, setProgress] = useState<Progress>(initialProgress);

  const toggleItem = (sectionId: string, subTaskId: string) => {
    setProgress(prevProgress => {
      const newProgress = { ...prevProgress };
      const sectionProgress = newProgress[sectionId] ? [...newProgress[sectionId]] : [];
      const subTaskIndex = sectionProgress.indexOf(subTaskId);

      if (subTaskIndex > -1) {
        sectionProgress.splice(subTaskIndex, 1);
      } else {
        sectionProgress.push(subTaskId);
      }

      newProgress[sectionId] = sectionProgress;
      
      // Call the debounced server action
      debouncedUpdate(subAccountId, newProgress);

      return newProgress;
    });
  };

  const isCompleted = (sectionId: string, subTaskId: string) => {
    return progress[sectionId]?.includes(subTaskId) ?? false;
  };

  const getSectionProgress = (sectionId: string, totalItems: number) => {
    if (totalItems === 0) return 0;
    const completedCount = progress[sectionId]?.length ?? 0;
    return (completedCount / totalItems) * 100;
  };

  return (
    <ChecklistContext.Provider
      value={{ progress, toggleItem, isCompleted, getSectionProgress }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};

// 4. Custom Hook
export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
}; 
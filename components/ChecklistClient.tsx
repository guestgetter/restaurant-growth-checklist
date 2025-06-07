'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { checklistData } from '../app/data/checklist-data';
import { useChecklist } from './ChecklistContext';
import { CheckCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';

const SubTask = ({ sectionId, subTask }: { sectionId: string; subTask: any }) => {
  const { toggleItem, isCompleted } = useChecklist();
  const completed = isCompleted(sectionId, subTask.id);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3 pl-4 py-2 border-l border-gray-200 ml-3"
    >
      <button onClick={() => toggleItem(sectionId, subTask.id)} className="flex-shrink-0">
        {completed ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <span className={`text-sm ${completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
        {subTask.text}
      </span>
    </motion.li>
  );
};

const ChecklistItem = ({ sectionId, item }: { sectionId: string; item: any }) => {
  const { toggleItem, isCompleted } = useChecklist();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const completed = isCompleted(sectionId, item.id);

  return (
    <motion.div
      layout
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => toggleItem(sectionId, item.id)} className="flex-shrink-0">
          {completed ? (
            <CheckCircle className="w-6 h-6 text-primary" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300" />
          )}
        </button>
        <div className="flex-1">
          <p className={`font-semibold ${completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
            {item.text}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500">{item.description}</p>
          )}
        </div>
        {item.subTasks && item.subTasks.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </button>
        )}
      </div>
      {isExpanded && item.subTasks && item.subTasks.length > 0 && (
        <ul className="mt-4 space-y-2">
          {item.subTasks.map((subTask: any) => (
            <SubTask key={subTask.id} sectionId={sectionId} subTask={subTask} />
          ))}
        </ul>
      )}
    </motion.div>
  );
};

const ChecklistSection = ({ section }: { section: any }) => {
  const { getSectionProgress } = useChecklist();
  const totalItems = section.items.reduce((acc: number, item: any) => acc + (item.subTasks?.length || 1), 0);
  const progress = getSectionProgress(section.id, totalItems);

  return (
    <motion.div layout className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">{section.emoji}</span>
          {section.title}
        </h2>
        <p className="text-sm text-gray-500">{section.description}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <motion.div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="space-y-3">
        {section.items.map((item: any) => (
          <ChecklistItem key={item.id} sectionId={section.id} item={item} />
        ))}
      </div>
    </motion.div>
  );
};

export default function ChecklistClient() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Growth Checklist</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your progress and unlock new levels of growth for your restaurant.
          </p>
        </header>
        <main>
          {checklistData.map(section => (
            <ChecklistSection key={section.id} section={section} />
          ))}
        </main>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Edit3,
  Save,
  X,
  Plus,
  Star,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Eye,
  Globe,
  BarChart3,
  Share2
} from 'lucide-react';

interface ConversationNote {
  id: string;
  date: string;
  type: 'call' | 'email' | 'meeting' | 'text';
  summary: string;
  keyPoints: string[];
  nextSteps: string[];
  participants: string[];
  sentiment: 'positive' | 'neutral' | 'concern';
  stage: 'prospect' | 'proposal' | 'negotiation' | 'closed' | 'onboarding' | 'active';
}

interface ScreenshotEntry {
  id: string;
  name: string;
  data: string; // Base64
  uploadedAt: string;
  category: 'google-business' | 'website' | 'analytics' | 'social-media';
  type: 'before' | 'progress' | 'after';
  description?: string;
}

interface BaselineMetrics {
  monthlyRevenue: number;
  guestCount: number;
  averagePerHeadSpend: number;
  googleRating: number;
  screenshots: ScreenshotEntry[];
}

interface DreamCaseStudy {
  timeframe: string;
  revenueGoal: string;
  customerGrowthGoal: string;
  marketExpansion: string;
  brandVision: string;
  successMetrics: string[];
  milestones: Array<{
    month: number;
    goal: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
}

interface ClientProfileData {
  id: string;
  conversations: ConversationNote[];
  baseline: BaselineMetrics;
  dreamCaseStudy: DreamCaseStudy;
  lastUpdated: string;
}

export default function ClientProfileManager({ clientId }: { clientId: string }) {
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'baseline' | 'dream'>('conversations');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddConversation, setShowAddConversation] = useState(false);
  const [showModal, setShowModal] = useState<ScreenshotEntry | null>(null);
  const [viewMode, setViewMode] = useState<'upload' | 'progression'>('upload');

  useEffect(() => {
    loadClientProfile().catch(console.error);
  }, [clientId]);

  const loadClientProfile = async () => {
    try {
      // Try to load from database first
      const response = await fetch(`/api/clients/${clientId}/profile`);
      if (response.ok) {
        const profileData = await response.json();
        if (profileData && (profileData.conversations?.length > 0 || profileData.baseline?.monthlyRevenue || profileData.dreamCaseStudy?.revenueGoal)) {
          console.log('Loaded profile from database:', profileData);
          // Ensure clientContext exists (migration for existing profiles)
          const migratedProfile = ensureClientContext(profileData);
          setProfile(migratedProfile);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load profile from database:', error);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(`client-profile-${clientId}`);
    if (saved) {
      try {
        const localProfile = JSON.parse(saved);
        console.log('Loaded profile from localStorage:', localProfile);
        // Ensure clientContext exists (migration for existing profiles)
        const migratedProfile = ensureClientContext(localProfile);
        setProfile(migratedProfile);
        return;
      } catch (error) {
        console.error('Error parsing profile from localStorage:', error);
      }
    }

    // Initialize empty profile if nothing exists
    const newProfile: ClientProfileData = {
      id: clientId,
      conversations: [],
      baseline: {
        monthlyRevenue: 0,
        guestCount: 0,
        averagePerHeadSpend: 0,
        googleRating: 0,
        screenshots: []
      },
      dreamCaseStudy: {
        timeframe: '',
        revenueGoal: '',
        customerGrowthGoal: '',
        marketExpansion: '',
        brandVision: '',
        successMetrics: [],
        milestones: []
      },
      lastUpdated: new Date().toISOString()
    };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Helper function to ensure screenshots exists on existing profiles
  const ensureClientContext = (profile: any): ClientProfileData => {
    // Handle baseline screenshots migration from old object format to new array format
    if (!profile.baseline) {
      profile.baseline = {
        monthlyRevenue: 0,
        guestCount: 0,
        averagePerHeadSpend: 0,
        googleRating: 0,
        screenshots: []
      };
    } else if (!profile.baseline.screenshots) {
      profile.baseline.screenshots = [];
    } else if (!Array.isArray(profile.baseline.screenshots)) {
      // Migrate old object format to new array format
      const oldScreenshots = profile.baseline.screenshots;
      const newScreenshots: ScreenshotEntry[] = [];
      
      // Convert old format to new format
      Object.keys(oldScreenshots).forEach(category => {
        if (oldScreenshots[category] && typeof oldScreenshots[category] === 'object') {
          Object.keys(oldScreenshots[category]).forEach(type => {
            if (oldScreenshots[category][type] && typeof oldScreenshots[category][type] === 'string') {
              newScreenshots.push({
                id: Math.random().toString(36).substr(2, 9),
                name: `${category}-${type}-migrated.png`,
                data: oldScreenshots[category][type],
                uploadedAt: new Date().toISOString(),
                category: category as ScreenshotEntry['category'],
                type: type as ScreenshotEntry['type'],
                description: `Migrated ${category.replace('-', ' ')} ${type} screenshot`
              });
            }
          });
        }
      });
      
      profile.baseline.screenshots = newScreenshots;
    }
    
    // Ensure baseline has all required numeric fields
    if (typeof profile.baseline.monthlyRevenue !== 'number') {
      profile.baseline.monthlyRevenue = 0;
    }
    if (typeof profile.baseline.guestCount !== 'number') {
      profile.baseline.guestCount = 0;
    }
    if (typeof profile.baseline.averagePerHeadSpend !== 'number') {
      profile.baseline.averagePerHeadSpend = 0;
    }
    if (typeof profile.baseline.googleRating !== 'number') {
      profile.baseline.googleRating = 0;
    }
    
    return profile as ClientProfileData;
  };

  const saveProfile = async (updatedProfile: ClientProfileData) => {
    updatedProfile.lastUpdated = new Date().toISOString();
    
    // Save to localStorage immediately for instant UI feedback
    localStorage.setItem(`client-profile-${clientId}`, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    
    // Save to database
    try {
      const response = await fetch(`/api/clients/${clientId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile: ${response.status}`);
      }

      console.log('Profile saved to database successfully');
    } catch (error) {
      console.error('Failed to save profile to database:', error);
      // localStorage save already completed, so UI won't be affected
    }
  };

  const addConversation = (conversation: Omit<ConversationNote, 'id'>) => {
    if (!profile) return;
    
    const newConversation: ConversationNote = {
      ...conversation,
      id: Date.now().toString()
    };
    
    const updatedProfile = {
      ...profile,
      conversations: [newConversation, ...profile.conversations]
    };
    
    saveProfile(updatedProfile);
    setShowAddConversation(false);
  };

  const updateBaseline = (baseline: BaselineMetrics) => {
    if (!profile) return;
    saveProfile({ ...profile, baseline });
  };

  const updateDreamCaseStudy = (dreamCaseStudy: DreamCaseStudy) => {
    if (!profile) return;
    saveProfile({ ...profile, dreamCaseStudy });
  };

  const handleScreenshotUpload = (
    files: FileList | null, 
    category: ScreenshotEntry['category'], 
    type: ScreenshotEntry['type']
  ) => {
    if (!files || !profile) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newScreenshot: ScreenshotEntry = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          data: result,
          uploadedAt: new Date().toISOString(),
          category,
          type,
          description: `${category.replace('-', ' ')} ${type} screenshot`
        };

        const updatedProfile: ClientProfileData = {
          ...profile,
          baseline: {
            ...profile.baseline,
            screenshots: [...(Array.isArray(profile.baseline.screenshots) ? profile.baseline.screenshots : []), newScreenshot]
          }
        };

        saveProfile(updatedProfile);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteScreenshot = (screenshotId: string) => {
    if (!profile) return;
    
    const updatedProfile: ClientProfileData = {
      ...profile,
      baseline: {
        ...profile.baseline,
        screenshots: (Array.isArray(profile.baseline.screenshots) ? profile.baseline.screenshots : []).filter(s => s.id !== screenshotId)
      }
    };
    saveProfile(updatedProfile);
    setShowModal(null);
  };

  const handleReplaceScreenshot = (screenshotId: string, newData: string) => {
    if (!profile) return;
    
    const updatedProfile: ClientProfileData = {
      ...profile,
      baseline: {
        ...profile.baseline,
        screenshots: (Array.isArray(profile.baseline.screenshots) ? profile.baseline.screenshots : []).map(s => 
          s.id === screenshotId 
            ? { ...s, data: newData, uploadedAt: new Date().toISOString() }
            : s
        )
      }
    };
    saveProfile(updatedProfile);
  };

  if (!profile) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Client Profile
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Complete view of client journey and goals
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'conversations'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              Conversations ({profile.conversations.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('baseline')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'baseline'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} />
              Starting Baseline
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dream')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'dream'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Target size={16} />
              Dream Case Study
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'conversations' && (
            <ConversationsTab
              conversations={profile.conversations}
              onAdd={addConversation}
              showAdd={showAddConversation}
              setShowAdd={setShowAddConversation}
            />
          )}
          {activeTab === 'baseline' && (
            <BaselineTab
              baseline={profile.baseline}
              onUpdate={updateBaseline}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              showModal={showModal}
              setShowModal={setShowModal}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
          {activeTab === 'dream' && (
            <DreamCaseStudyTab
              dreamCaseStudy={profile.dreamCaseStudy}
              onUpdate={updateDreamCaseStudy}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Conversations Tab Component
function ConversationsTab({ 
  conversations, 
  onAdd, 
  showAdd, 
  setShowAdd 
}: {
  conversations: ConversationNote[];
  onAdd: (conversation: Omit<ConversationNote, 'id'>) => void;
  showAdd: boolean;
  setShowAdd: (show: boolean) => void;
}) {
  const [newConversation, setNewConversation] = useState<Omit<ConversationNote, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'call',
    summary: '',
    keyPoints: [''],
    nextSteps: [''],
    participants: [''],
    sentiment: 'positive',
    stage: 'active'
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'concern': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospect': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'onboarding': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty strings from arrays and ensure keyPoints is populated from summary
    const cleanedConversation = {
      ...newConversation,
      keyPoints: [], // AI summary will contain key points, so we don't need separate keyPoints
      nextSteps: newConversation.nextSteps.filter(step => step.trim() !== ''),
      participants: newConversation.participants.filter(participant => participant.trim() !== '')
    };
    onAdd(cleanedConversation);
    setNewConversation({
      date: new Date().toISOString().split('T')[0],
      type: 'call',
      summary: '',
      keyPoints: [''],
      nextSteps: [''],
      participants: [''],
      sentiment: 'positive',
      stage: 'active'
    });
  };

  const addKeyPoint = () => {
    setNewConversation({
      ...newConversation,
      keyPoints: [...newConversation.keyPoints, '']
    });
  };

  const updateKeyPoint = (index: number, value: string) => {
    const updated = [...newConversation.keyPoints];
    updated[index] = value;
    setNewConversation({ ...newConversation, keyPoints: updated });
  };

  const removeKeyPoint = (index: number) => {
    const updated = newConversation.keyPoints.filter((_, i) => i !== index);
    setNewConversation({ ...newConversation, keyPoints: updated });
  };

  const addNextStep = () => {
    setNewConversation({
      ...newConversation,
      nextSteps: [...newConversation.nextSteps, '']
    });
  };

  const updateNextStep = (index: number, value: string) => {
    const updated = [...newConversation.nextSteps];
    updated[index] = value;
    setNewConversation({ ...newConversation, nextSteps: updated });
  };

  const removeNextStep = (index: number) => {
    const updated = newConversation.nextSteps.filter((_, i) => i !== index);
    setNewConversation({ ...newConversation, nextSteps: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Add Conversation Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Client Interactions & Call Notes
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Conversation
        </button>
      </div>

      {/* Add Conversation Form */}
      {showAdd && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg space-y-6 border border-slate-200 dark:border-slate-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newConversation.date}
                onChange={(e) => setNewConversation({ ...newConversation, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                value={newConversation.type}
                onChange={(e) => setNewConversation({ ...newConversation, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="text">Text/Message</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Client Sentiment
              </label>
              <select
                value={newConversation.sentiment}
                onChange={(e) => setNewConversation({ ...newConversation, sentiment: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="concern">Concern/Issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              AI-Generated Call Summary & Key Points
            </label>
            <textarea
              value={newConversation.summary}
              onChange={(e) => setNewConversation({ ...newConversation, summary: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Paste AI-processed call summary here including key takeaways and important points..."
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              💡 Tip: Record your call, process with AI, then copy/paste the summary here
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Action Items & Next Steps
            </label>
            <textarea
              value={newConversation.nextSteps.join('\n')}
              onChange={(e) => setNewConversation({ 
                ...newConversation, 
                nextSteps: e.target.value.split('\n').filter(step => step.trim() !== '')
              })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="• Follow up on menu pricing discussion&#10;• Send proposal for social media package&#10;• Schedule next check-in for next Friday"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              One action item per line (bullet points optional)
            </p>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-slate-200 dark:border-slate-600">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Conversation
            </button>
          </div>
        </motion.form>
      )}

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No client interactions recorded yet</p>
            <p className="text-sm">Start tracking conversations to build a comprehensive client relationship history</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {new Date(conversation.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(conversation.sentiment)}`}>
                    {conversation.sentiment}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {conversation.type}
                  </span>
                  {conversation.stage && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(conversation.stage)}`}>
                      {conversation.stage}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Summary */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI-Generated Summary</h4>
                  <div className="text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                    {conversation.summary}
                  </div>
                </div>

                {/* Action Items */}
                {conversation.nextSteps && conversation.nextSteps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Action Items</h4>
                    <ul className="space-y-1">
                      {conversation.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-900 dark:text-slate-100">
                          <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Participants */}
                {conversation.participants && conversation.participants.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Participants: {conversation.participants.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// Baseline Tab Component  
function BaselineTab({ 
  baseline, 
  onUpdate, 
  isEditing, 
  setIsEditing,
  showModal,
  setShowModal,
  viewMode,
  setViewMode
}: {
  baseline: BaselineMetrics;
  onUpdate: (baseline: BaselineMetrics) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  showModal: ScreenshotEntry | null;
  setShowModal: (screenshot: ScreenshotEntry | null) => void;
  viewMode: 'upload' | 'progression';
  setViewMode: (mode: 'upload' | 'progression') => void;
}) {
  const [editData, setEditData] = useState(baseline);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(baseline);
    setIsEditing(false);
  };

  const handleScreenshotUpload = (
    files: FileList | null, 
    category: ScreenshotEntry['category'], 
    type: ScreenshotEntry['type']
  ) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newScreenshot: ScreenshotEntry = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          data: result,
          uploadedAt: new Date().toISOString(),
          category,
          type,
          description: `${category.replace('-', ' ')} ${type} screenshot`
        };

                 const updatedProfile = {
           ...baseline,
           screenshots: [...(Array.isArray(baseline.screenshots) ? baseline.screenshots : []), newScreenshot]
         };

        onUpdate(updatedProfile);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteScreenshot = (screenshotId: string) => {
    const updatedProfile = {
      ...baseline,
      screenshots: (Array.isArray(baseline.screenshots) ? baseline.screenshots : []).filter(s => s.id !== screenshotId)
    };
    onUpdate(updatedProfile);
    setShowModal(null);
  };

  const handleReplaceScreenshot = (screenshotId: string, newData: string) => {
    const updatedProfile = {
      ...baseline,
      screenshots: (Array.isArray(baseline.screenshots) ? baseline.screenshots : []).map(s => 
        s.id === screenshotId 
          ? { ...s, data: newData, uploadedAt: new Date().toISOString() }
          : s
      )
    };
    onUpdate(updatedProfile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Starting Baseline & Case Study Assets
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
            Edit Baseline
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        )}
      </div>

      {/* Screenshot Management */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Case Study Assets & Screenshots</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('upload')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'upload' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload & Manage
              </button>
              <button
                onClick={() => setViewMode('progression')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'progression' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                View Progression
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === 'upload' && (
            <div className="space-y-6">
              {/* Upload Areas */}
              {[
                { key: 'google-business' as const, label: 'Google Business Profile', icon: MapPin },
                { key: 'website' as const, label: 'Website', icon: Globe },
                { key: 'analytics' as const, label: 'Analytics Dashboard', icon: BarChart3 },
                { key: 'social-media' as const, label: 'Social Media', icon: Share2 }
              ].map(category => (
                <div key={category.key} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <category.icon className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">{category.label}</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {['before', 'progress', 'after'].map(type => (
                      <div key={type}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {type} {type === 'progress' ? 'Updates' : ''}
                        </label>
                        
                        {/* Upload Area */}
                        <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">
                            Drop files or click to upload
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleScreenshotUpload(e.target.files, category.key, type as ScreenshotEntry['type'])}
                          />
                        </label>

                        {/* Uploaded Screenshots */}
                        <div className="mt-3 space-y-2">
                          {(Array.isArray(baseline.screenshots) ? baseline.screenshots : [])
                            .filter(s => s.category === category.key && s.type === type)
                            .map(screenshot => (
                              <div key={screenshot.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <img 
                                  src={screenshot.data} 
                                  alt={screenshot.name}
                                  className="w-8 h-8 object-cover rounded cursor-pointer"
                                  onClick={() => setShowModal(screenshot)}
                                />
                                <span className="flex-1 text-sm truncate">{screenshot.name}</span>
                                <button
                                  onClick={() => handleDeleteScreenshot(screenshot.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'progression' && (
            <ScreenshotProgressionView screenshots={Array.isArray(baseline.screenshots) ? baseline.screenshots : []} />
          )}
        </div>
      </div>

      {/* Screenshot Modal */}
      {showModal && (
        <ScreenshotModal 
          screenshot={showModal}
          onClose={() => setShowModal(null)}
          onDelete={() => handleDeleteScreenshot(showModal.id)}
          onReplace={(newData) => handleReplaceScreenshot(showModal.id, newData)}
        />
      )}
    </motion.div>
  );
}

// Dream Case Study Tab Component
function DreamCaseStudyTab({ 
  dreamCaseStudy, 
  onUpdate, 
  isEditing, 
  setIsEditing 
}: {
  dreamCaseStudy: DreamCaseStudy;
  onUpdate: (dreamCaseStudy: DreamCaseStudy) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}) {
  const [editData, setEditData] = useState(dreamCaseStudy);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(dreamCaseStudy);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Dream Case Study Vision
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
            Edit Vision
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Timeframe
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData.timeframe}
              onChange={(e) => setEditData({ ...editData, timeframe: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="e.g., 12 months"
            />
          ) : (
            <p className="text-slate-900 dark:text-slate-100">{dreamCaseStudy.timeframe || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Revenue Goal
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData.revenueGoal}
              onChange={(e) => setEditData({ ...editData, revenueGoal: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="e.g., $75,000/month (67% increase)"
            />
          ) : (
            <p className="text-slate-900 dark:text-slate-100">{dreamCaseStudy.revenueGoal || 'Not set'}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Brand Vision
        </label>
        {isEditing ? (
          <textarea
            value={editData.brandVision}
            onChange={(e) => setEditData({ ...editData, brandVision: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Describe the client's ultimate vision for their brand and business..."
          />
        ) : (
          <p className="text-slate-900 dark:text-slate-100">{dreamCaseStudy.brandVision || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Success Metrics
        </label>
        {isEditing ? (
          <textarea
            value={editData.successMetrics.join('\n')}
            onChange={(e) => setEditData({ 
              ...editData, 
              successMetrics: e.target.value.split('\n').filter(item => item.trim())
            })}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
            placeholder="One metric per line (e.g., 67% revenue increase, 300+ Google reviews, etc.)"
          />
        ) : (
          <div className="space-y-1">
            {dreamCaseStudy.successMetrics.length > 0 ? (
              dreamCaseStudy.successMetrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-500 flex-shrink-0" />
                  <span className="text-slate-900 dark:text-slate-100">{metric}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No success metrics defined</p>
            )}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div>
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Key Milestones</h4>
        {dreamCaseStudy.milestones.length > 0 ? (
          <div className="space-y-3">
            {dreamCaseStudy.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in-progress' ? 'bg-blue-500' :
                  'bg-slate-300 dark:bg-slate-600'
                }`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Month {milestone.month}:
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                    {milestone.goal}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
                }`}>
                  {milestone.status === 'completed' ? 'Done' :
                   milestone.status === 'in-progress' ? 'In Progress' :
                   'Pending'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No milestones defined yet</p>
        )}
      </div>
    </motion.div>
  );
}

// Add this new component before ClientProfileManager
const ScreenshotModal = ({ 
  screenshot, 
  onClose, 
  onDelete, 
  onReplace 
}: { 
  screenshot: ScreenshotEntry; 
  onClose: () => void;
  onDelete: () => void;
  onReplace: (newData: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onReplace(result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">{screenshot.name}</h3>
            <p className="text-sm text-gray-600">
              {screenshot.category.replace('-', ' ').toUpperCase()} • {screenshot.type.toUpperCase()} • 
              {new Date(screenshot.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Image */}
        <div className="max-h-[60vh] overflow-auto p-4">
          <img 
            src={screenshot.data} 
            alt={screenshot.name}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
          {screenshot.description && (
            <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {screenshot.description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              Replace
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplace}
        className="hidden"
      />
    </div>
  );
};

const ScreenshotProgressionView = ({ screenshots }: { screenshots: ScreenshotEntry[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<ScreenshotEntry['category']>('google-business');
  
  const categories = [
    { key: 'google-business' as const, label: 'Google Business Profile' },
    { key: 'website' as const, label: 'Website' },
    { key: 'analytics' as const, label: 'Analytics' },
    { key: 'social-media' as const, label: 'Social Media' }
  ];
  
  const getScreenshotsByType = (category: ScreenshotEntry['category'], type: ScreenshotEntry['type']) => {
    return screenshots.filter(s => s.category === category && s.type === type);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Progression Timeline */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h4 className="font-semibold">
            {categories.find(c => c.key === selectedCategory)?.label} Progression
          </h4>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Before */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h5 className="font-medium text-gray-900">Before</h5>
              </div>
              <div className="space-y-2">
                {getScreenshotsByType(selectedCategory, 'before').map(screenshot => (
                  <ScreenshotThumbnail key={screenshot.id} screenshot={screenshot} />
                ))}
                {getScreenshotsByType(selectedCategory, 'before').length === 0 && (
                  <div className="text-sm text-gray-500 italic">No before screenshots</div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h5 className="font-medium text-gray-900">Progress Updates</h5>
              </div>
              <div className="space-y-2">
                {getScreenshotsByType(selectedCategory, 'progress').map(screenshot => (
                  <ScreenshotThumbnail key={screenshot.id} screenshot={screenshot} />
                ))}
                {getScreenshotsByType(selectedCategory, 'progress').length === 0 && (
                  <div className="text-sm text-gray-500 italic">No progress screenshots</div>
                )}
              </div>
            </div>

            {/* After */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h5 className="font-medium text-gray-900">After</h5>
              </div>
              <div className="space-y-2">
                {getScreenshotsByType(selectedCategory, 'after').map(screenshot => (
                  <ScreenshotThumbnail key={screenshot.id} screenshot={screenshot} />
                ))}
                {getScreenshotsByType(selectedCategory, 'after').length === 0 && (
                  <div className="text-sm text-gray-500 italic">No after screenshots</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenshotThumbnail = ({ screenshot }: { screenshot: ScreenshotEntry }) => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group relative cursor-pointer bg-gray-50 rounded-lg overflow-hidden border hover:border-blue-300 transition-colors"
      >
        <img 
          src={screenshot.data} 
          alt={screenshot.name}
          className="w-full h-24 object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-2">
          <p className="text-xs font-medium truncate">{screenshot.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(screenshot.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {showModal && (
        <ScreenshotModal 
          screenshot={screenshot}
          onClose={() => setShowModal(false)}
          onDelete={() => {
            // This will be handled by parent component
            setShowModal(false);
          }}
          onReplace={(newData) => {
            // This will be handled by parent component
          }}
        />
      )}
    </>
  );
}; 
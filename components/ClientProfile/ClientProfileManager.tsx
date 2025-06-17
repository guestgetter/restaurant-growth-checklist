'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle
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

interface BaselineMetrics {
  monthlyRevenue: string;
  averagePerHeadSpend: string;
  guestCount: string;
  onlinePresence: {
    googleReviews: string;
    websiteTraffic: string;
    socialFollowing: string;
  };
  marketingChannels: string[];
  mainChallenges: string[];
  currentTools: string[];
  screenshots: {
    googleBusinessProfile?: {
      before?: string;
      after?: string;
    };
    website?: {
      before?: string;
      after?: string;
    };
    analytics?: {
      before?: string;
      after?: string;
    };
    socialMedia?: {
      before?: string;
      after?: string;
    };
  };
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
        monthlyRevenue: '',
        averagePerHeadSpend: '',
        guestCount: '',
        onlinePresence: {
          googleReviews: '',
          websiteTraffic: '',
          socialFollowing: ''
        },
        marketingChannels: [],
        mainChallenges: [],
        currentTools: [],
        screenshots: {}
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
    if (!profile.baseline?.screenshots) {
      profile.baseline = {
        ...profile.baseline,
        screenshots: {}
      };
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
  setIsEditing 
}: {
  baseline: BaselineMetrics;
  onUpdate: (baseline: BaselineMetrics) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
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

  const handleScreenshotUpload = (category: string, type: 'before' | 'after', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setEditData({
        ...editData,
        screenshots: {
          ...editData.screenshots,
          [category]: {
            ...editData.screenshots[category as keyof typeof editData.screenshots],
            [type]: imageData
          }
        }
      });
    };
    reader.readAsDataURL(file);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Core Restaurant Metrics</h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly Revenue
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.monthlyRevenue}
                onChange={(e) => setEditData({ ...editData, monthlyRevenue: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., $45,000"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.monthlyRevenue || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Average Per Head Spend
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.averagePerHeadSpend}
                onChange={(e) => setEditData({ ...editData, averagePerHeadSpend: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., $28"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.averagePerHeadSpend || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly Guest Count
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.guestCount}
                onChange={(e) => setEditData({ ...editData, guestCount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., 1,600"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.guestCount || 'Not set'}</p>
            )}
          </div>
        </div>

        {/* Online Presence */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Online Presence</h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google Reviews
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.onlinePresence.googleReviews}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  onlinePresence: { ...editData.onlinePresence, googleReviews: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., 4.2 stars (127 reviews)"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.onlinePresence.googleReviews || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Website Traffic
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.onlinePresence.websiteTraffic}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  onlinePresence: { ...editData.onlinePresence, websiteTraffic: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., 2,500 monthly visitors"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.onlinePresence.websiteTraffic || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Social Following
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.onlinePresence.socialFollowing}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  onlinePresence: { ...editData.onlinePresence, socialFollowing: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., 850 Instagram, 420 Facebook"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.onlinePresence.socialFollowing || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Case Study Screenshots */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Case Study Screenshots (Before & After)</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Google Business Profile */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">Google Business Profile</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">Before</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('googleBusinessProfile', 'before', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editData.screenshots?.googleBusinessProfile?.before && (
                      <img
                        src={editData.screenshots.googleBusinessProfile.before}
                        alt="GBP Before"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.googleBusinessProfile?.before ? (
                  <img
                    src={baseline.screenshots.googleBusinessProfile.before}
                    alt="GBP Before"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">After</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('googleBusinessProfile', 'after', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {editData.screenshots?.googleBusinessProfile?.after && (
                      <img
                        src={editData.screenshots.googleBusinessProfile.after}
                        alt="GBP After"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.googleBusinessProfile?.after ? (
                  <img
                    src={baseline.screenshots.googleBusinessProfile.after}
                    alt="GBP After"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">Before</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('website', 'before', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editData.screenshots?.website?.before && (
                      <img
                        src={editData.screenshots.website.before}
                        alt="Website Before"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.website?.before ? (
                  <img
                    src={baseline.screenshots.website.before}
                    alt="Website Before"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">After</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('website', 'after', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {editData.screenshots?.website?.after && (
                      <img
                        src={editData.screenshots.website.after}
                        alt="Website After"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.website?.after ? (
                  <img
                    src={baseline.screenshots.website.after}
                    alt="Website After"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">Analytics Dashboard</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">Before</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('analytics', 'before', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editData.screenshots?.analytics?.before && (
                      <img
                        src={editData.screenshots.analytics.before}
                        alt="Analytics Before"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.analytics?.before ? (
                  <img
                    src={baseline.screenshots.analytics.before}
                    alt="Analytics Before"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">After</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('analytics', 'after', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {editData.screenshots?.analytics?.after && (
                      <img
                        src={editData.screenshots.analytics.after}
                        alt="Analytics After"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.analytics?.after ? (
                  <img
                    src={baseline.screenshots.analytics.after}
                    alt="Analytics After"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">Social Media</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">Before</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('socialMedia', 'before', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editData.screenshots?.socialMedia?.before && (
                      <img
                        src={editData.screenshots.socialMedia.before}
                        alt="Social Media Before"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.socialMedia?.before ? (
                  <img
                    src={baseline.screenshots.socialMedia.before}
                    alt="Social Media Before"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">After</label>
                {isEditing ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload('socialMedia', 'after', file);
                      }}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {editData.screenshots?.socialMedia?.after && (
                      <img
                        src={editData.screenshots.socialMedia.after}
                        alt="Social Media After"
                        className="mt-2 w-full h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                ) : baseline.screenshots?.socialMedia?.after ? (
                  <img
                    src={baseline.screenshots.socialMedia.after}
                    alt="Social Media After"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center text-slate-500">
                    No screenshot
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Baseline Info */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
        <h4 className="font-medium text-slate-900 dark:text-slate-100">Additional Context</h4>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Marketing Channels
          </label>
          {isEditing ? (
            <textarea
              value={editData.marketingChannels.join('\n')}
              onChange={(e) => setEditData({ 
                ...editData, 
                marketingChannels: e.target.value.split('\n').filter(channel => channel.trim())
              })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="One channel per line (e.g., Word of mouth, Yelp, Social media)"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {baseline.marketingChannels.length > 0 ? (
                baseline.marketingChannels.map((channel, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                    {channel}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No channels specified</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Main Challenges
          </label>
          {isEditing ? (
            <textarea
              value={editData.mainChallenges.join('\n')}
              onChange={(e) => setEditData({ 
                ...editData, 
                mainChallenges: e.target.value.split('\n').filter(challenge => challenge.trim())
              })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="One challenge per line"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {baseline.mainChallenges.length > 0 ? (
                baseline.mainChallenges.map((challenge, index) => (
                  <span key={index} className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm">
                    {challenge}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">No challenges specified</p>
              )}
            </div>
          )}
        </div>
      </div>
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
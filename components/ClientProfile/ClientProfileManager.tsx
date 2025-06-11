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
  averageOrderValue: string;
  customerCount: string;
  onlinePresence: {
    googleReviews: string;
    websiteTraffic: string;
    socialFollowing: string;
  };
  marketingChannels: string[];
  mainChallenges: string[];
  currentTools: string[];
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
          setProfile(profileData);
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
        setProfile(localProfile);
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
        averageOrderValue: '',
        customerCount: '',
        onlinePresence: {
          googleReviews: '',
          websiteTraffic: '',
          socialFollowing: ''
        },
        marketingChannels: [],
        mainChallenges: [],
        currentTools: []
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
    stage: 'prospect'
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
    onAdd(newConversation);
    setNewConversation({
      date: new Date().toISOString().split('T')[0],
      type: 'call',
      summary: '',
      keyPoints: [''],
      nextSteps: [''],
      participants: [''],
      sentiment: 'positive',
      stage: 'prospect'
    });
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
          Conversation History
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
          className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg space-y-4"
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
                Stage
              </label>
              <select
                value={newConversation.stage}
                onChange={(e) => setNewConversation({ ...newConversation, stage: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="prospect">Prospect</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed">Closed</option>
                <option value="onboarding">Onboarding</option>
                <option value="active">Active Client</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Summary
            </label>
            <textarea
              value={newConversation.summary}
              onChange={(e) => setNewConversation({ ...newConversation, summary: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Brief summary of the conversation..."
              required
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Conversation
            </button>
          </div>
        </motion.form>
      )}

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>No conversations recorded yet</p>
            <p className="text-sm">Add your first conversation to start tracking the client journey</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {new Date(conversation.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(conversation.stage)}`}>
                    {conversation.stage}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(conversation.sentiment)}`}>
                    {conversation.sentiment}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {conversation.type}
                </span>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                {conversation.summary}
              </p>
              
              {conversation.keyPoints.length > 0 && conversation.keyPoints[0] && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Key Points:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {conversation.keyPoints.filter(point => point.trim()).map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {conversation.nextSteps.length > 0 && conversation.nextSteps[0] && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Next Steps:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {conversation.nextSteps.filter(step => step.trim()).map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Starting Baseline Metrics
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Core Business Metrics</h4>
          
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
              Average Order Value
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.averageOrderValue}
                onChange={(e) => setEditData({ ...editData, averageOrderValue: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., $28"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.averageOrderValue || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly Customer Count
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.customerCount}
                onChange={(e) => setEditData({ ...editData, customerCount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., 1,600"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.customerCount || 'Not set'}</p>
            )}
          </div>
        </div>

        {/* Online Presence */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Online Presence</h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google Reviews (Count & Rating)
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
                placeholder="e.g., 127 reviews, 4.2 stars"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.onlinePresence.googleReviews || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly Website Traffic
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
                placeholder="e.g., 2,500 visitors"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.onlinePresence.websiteTraffic || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Social Media Following
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
                placeholder="e.g., FB: 850, IG: 1.2k"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100">{baseline.onlinePresence.socialFollowing || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Context */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Current Marketing Channels
          </label>
          {isEditing ? (
            <textarea
              value={editData.marketingChannels.join('\n')}
              onChange={(e) => setEditData({ 
                ...editData, 
                marketingChannels: e.target.value.split('\n').filter(item => item.trim())
              })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="One channel per line (e.g., Word of mouth, Google Ads, Social media)"
            />
          ) : (
            <div className="space-y-1">
              {baseline.marketingChannels.length > 0 ? (
                baseline.marketingChannels.map((channel, index) => (
                  <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm mr-2 mb-1">
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Main Challenges
          </label>
          {isEditing ? (
            <textarea
              value={editData.mainChallenges.join('\n')}
              onChange={(e) => setEditData({ 
                ...editData, 
                mainChallenges: e.target.value.split('\n').filter(item => item.trim())
              })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
              placeholder="One challenge per line"
            />
          ) : (
            <div className="space-y-1">
              {baseline.mainChallenges.length > 0 ? (
                baseline.mainChallenges.map((challenge, index) => (
                  <span key={index} className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm mr-2 mb-1">
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
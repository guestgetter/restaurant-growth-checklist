'use client';

import React, { useState, useEffect, useRef, ClipboardEvent } from 'react';
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
  Share2,
  Camera,
  Users,
  Briefcase
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

interface ClientContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface ClientProfileHeader {
  profilePhoto?: string; // Base64 image
  primaryContact: ClientContact;
  secondaryContacts: ClientContact[];
  quickContext: {
    priorities: string[];
    preferences: string[];
    keyNotes: string;
    communicationStyle: 'formal' | 'casual' | 'direct' | 'relationship-focused';
    bestContactMethod: 'email' | 'phone' | 'text' | 'in-person';
    timezone: string;
  };
}

interface ClientProfileData {
  id: string;
  conversations: ConversationNote[];
  baseline: BaselineMetrics;
  dreamCaseStudy: DreamCaseStudy;
  profileHeader: ClientProfileHeader;
  lastUpdated: string;
}

// Add this helper function near the top of the file, after the interfaces
const handleClipboardPaste = async (
  e: ClipboardEvent, 
  onImagePaste: (file: File) => void
) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        // Create a more descriptive filename
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const fileType = file.type.split('/')[1] || 'png';
        const renamedFile = new File([file], `screenshot-${timestamp}.${fileType}`, {
          type: file.type
        });
        onImagePaste(renamedFile);
        e.preventDefault();
        break;
      }
    }
  }
};

export default function ClientProfileManager({ clientId }: { clientId: string }) {
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'header' | 'conversations' | 'baseline' | 'dream'>('header');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddConversation, setShowAddConversation] = useState(false);
  const [showModal, setShowModal] = useState<ScreenshotEntry | null>(null);
  const [viewMode, setViewMode] = useState<'upload' | 'progression'>('upload');
  const [clipboardHint, setClipboardHint] = useState(false);

  // Show clipboard hint when user copies something
  useEffect(() => {
    const handleCopy = () => {
      setClipboardHint(true);
      setTimeout(() => setClipboardHint(false), 3000);
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  useEffect(() => {
    loadClientProfile().catch(console.error);
  }, [clientId]);

  const loadClientProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clients/${clientId}/profile`);
      
      if (response.ok) {
        const data = await response.json();
        const contextualizedProfile = ensureClientContext(data);
        setProfile(contextualizedProfile);
      } else {
        // Create new profile
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
          profileHeader: {
            primaryContact: {
              name: '',
              role: '',
              email: '',
              phone: ''
            },
            secondaryContacts: [],
            quickContext: {
              priorities: [],
              preferences: [],
              keyNotes: '',
              communicationStyle: 'relationship-focused',
              bestContactMethod: 'email',
              timezone: 'America/New_York'
            }
          },
          lastUpdated: new Date().toISOString()
        };
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading client profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const ensureClientContext = (profile: any): ClientProfileData => {
    // Handle profile header
    if (!profile.profileHeader) {
      profile.profileHeader = {
        primaryContact: {
          name: '',
          role: '',
          email: '',
          phone: ''
        },
        secondaryContacts: [],
        quickContext: {
          priorities: [],
          preferences: [],
          keyNotes: '',
          communicationStyle: 'relationship-focused',
          bestContactMethod: 'email',
          timezone: 'America/New_York'
        }
      };
    }

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

  const updateProfileHeader = (profileHeader: ClientProfileHeader) => {
    if (!profile) return;
    saveProfile({ ...profile, profileHeader });
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
                Account Manager Command Center
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Complete client profile and relationship management
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
            onClick={() => setActiveTab('header')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'header'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={16} />
              Client Profile
            </div>
          </button>
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
              Starting Baseline & Case Study Assets
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
          {activeTab === 'header' && (
            <ClientProfileHeaderTab
              profileHeader={profile.profileHeader}
              onUpdate={updateProfileHeader}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
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
              clipboardHint={clipboardHint}
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
  setViewMode,
  clipboardHint
}: {
  baseline: BaselineMetrics;
  onUpdate: (baseline: BaselineMetrics) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  showModal: ScreenshotEntry | null;
  setShowModal: (screenshot: ScreenshotEntry | null) => void;
  viewMode: 'upload' | 'progression';
  setViewMode: (mode: 'upload' | 'progression') => void;
  clipboardHint: boolean;
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
    console.log('handleDeleteScreenshot called with ID:', screenshotId);
    const updatedProfile = {
      ...baseline,
      screenshots: (Array.isArray(baseline.screenshots) ? baseline.screenshots : []).filter(s => s.id !== screenshotId)
    };
    console.log('Updated profile screenshots:', updatedProfile.screenshots.length);
    onUpdate(updatedProfile);
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
                        <div 
                          className={`block w-full border-2 border-dashed rounded-lg p-4 text-center transition-all relative ${
                            clipboardHint 
                              ? 'border-green-400 bg-green-50 animate-pulse' 
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                          onPaste={(e) => handleClipboardPaste(e as any, (file) => handleScreenshotUpload([file] as any, category.key, type as ScreenshotEntry['type']))}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                              // Focus the element to ensure paste event fires
                              e.currentTarget.focus();
                            }
                          }}
                          onClick={(e) => {
                            // Only focus for paste, don't open file browser
                            e.currentTarget.focus();
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                            if (e.dataTransfer?.files) {
                              handleScreenshotUpload(e.dataTransfer.files, category.key, type as ScreenshotEntry['type']);
                            }
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const input = e.currentTarget.parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
                              input?.click();
                            }}
                            className="mx-auto mb-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Upload className="h-6 w-6 text-gray-400" />
                          </button>
                          <div className="text-sm text-gray-600">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const input = e.currentTarget.parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
                                input?.click();
                              }}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Click to browse files
                            </button>
                            <span className="text-gray-500"> or drag & drop</span>
                          </div>
                          <div className={`text-xs mt-1 transition-colors ${
                            clipboardHint ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            {clipboardHint ? '📋 Ready to paste! Press ⌘V / Ctrl+V' : 'Click here and paste screenshot (⌘V / Ctrl+V)'}
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleScreenshotUpload(e.target.files, category.key, type as ScreenshotEntry['type'])}
                          />
                        </div>

                        {/* Uploaded Screenshots */}
                        <div className="mt-3 space-y-2">
                          {(Array.isArray(baseline.screenshots) ? baseline.screenshots : [])
                            .filter(s => s.category === category.key && s.type === type)
                            .map(screenshot => (
                              <div key={screenshot.id} className="group relative bg-gray-100 rounded-lg overflow-hidden">
                                {/* Large thumbnail preview */}
                                <div 
                                  className="w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all relative"
                                  onClick={() => {
                                    console.log('Thumbnail clicked, opening modal for:', screenshot.name);
                                    setShowModal(screenshot);
                                  }}
                                >
                                  <img 
                                    src={screenshot.data} 
                                    alt={screenshot.name}
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {/* Hover overlay for "click to view" */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                    <div className="bg-white/90 px-3 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                      Click to view full size
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Bottom overlay with filename and delete */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white text-xs truncate flex-1 mr-2">
                                      {screenshot.name}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Delete button clicked for:', screenshot.name);
                                        handleDeleteScreenshot(screenshot.id);
                                      }}
                                      className="text-white hover:text-red-300 transition-colors p-1 flex-shrink-0"
                                      title="Delete screenshot"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
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
          onDelete={() => {
            handleDeleteScreenshot(showModal.id);
            setShowModal(null);
          }}
          onReplace={(newData) => {
            handleReplaceScreenshot(showModal.id, newData);
            setShowModal(null);
          }}
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
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
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
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delete button clicked in modal');
                onDelete();
              }}
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

// New Client Profile Header Tab Component
function ClientProfileHeaderTab({
  profileHeader,
  onUpdate,
  isEditing,
  setIsEditing
}: {
  profileHeader: ClientProfileHeader;
  onUpdate: (profileHeader: ClientProfileHeader) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}) {
  const [editData, setEditData] = useState(profileHeader);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileHeader);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData({
          ...editData,
          profilePhoto: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSecondaryContact = () => {
    setEditData({
      ...editData,
      secondaryContacts: [
        ...editData.secondaryContacts,
        { name: '', role: '', email: '', phone: '' }
      ]
    });
  };

  const updateSecondaryContact = (index: number, field: keyof ClientContact, value: string) => {
    const updated = [...editData.secondaryContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEditData({ ...editData, secondaryContacts: updated });
  };

  const removeSecondaryContact = (index: number) => {
    const updated = editData.secondaryContacts.filter((_, i) => i !== index);
    setEditData({ ...editData, secondaryContacts: updated });
  };

  const addPriority = () => {
    setEditData({
      ...editData,
      quickContext: {
        ...editData.quickContext,
        priorities: [...editData.quickContext.priorities, '']
      }
    });
  };

  const updatePriority = (index: number, value: string) => {
    const updated = [...editData.quickContext.priorities];
    updated[index] = value;
    setEditData({
      ...editData,
      quickContext: { ...editData.quickContext, priorities: updated }
    });
  };

  const removePriority = (index: number) => {
    const updated = editData.quickContext.priorities.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      quickContext: { ...editData.quickContext, priorities: updated }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Client Profile & Quick Context
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
            Edit Profile
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
              Save Profile
            </button>
          </div>
        )}
      </div>

      {/* Profile Photo & Primary Contact */}
      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
        <div className="flex items-start gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div 
                className="w-24 h-24 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  if (isEditing) {
                    e.currentTarget.focus();
                  }
                }}
                onPaste={(e) => isEditing && handleClipboardPaste(e as any, (file) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const result = e.target?.result as string;
                    setEditData({
                      ...editData,
                      profilePhoto: result
                    });
                  };
                  reader.readAsDataURL(file);
                })}
                tabIndex={isEditing ? 0 : -1}
                onKeyDown={(e) => {
                  if (isEditing && (e.metaKey || e.ctrlKey) && e.key === 'v') {
                    e.currentTarget.focus();
                  }
                }}
              >
                {(editData.profilePhoto || profileHeader.profilePhoto) ? (
                  <img
                    src={editData.profilePhoto || profileHeader.profilePhoto}
                    alt="Client profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-slate-400" />
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="text-white text-xs opacity-0 hover:opacity-100 transition-opacity text-center">
                      <Camera className="h-4 w-4 mx-auto mb-1" />
                      <div>Click or paste</div>
                    </div>
                  </div>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                  title="Upload photo or paste from clipboard"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Primary Contact Info */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Primary Contact Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.primaryContact.name}
                    onChange={(e) => setEditData({
                      ...editData,
                      primaryContact: { ...editData.primaryContact, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="e.g., Sarah Johnson"
                  />
                ) : (
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    {profileHeader.primaryContact.name || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Role/Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.primaryContact.role}
                    onChange={(e) => setEditData({
                      ...editData,
                      primaryContact: { ...editData.primaryContact, role: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="e.g., Owner, GM, Marketing Director"
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">{profileHeader.primaryContact.role || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.primaryContact.email}
                    onChange={(e) => setEditData({
                      ...editData,
                      primaryContact: { ...editData.primaryContact, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="sarah@restaurant.com"
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">{profileHeader.primaryContact.email || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.primaryContact.phone}
                    onChange={(e) => setEditData({
                      ...editData,
                      primaryContact: { ...editData.primaryContact, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">{profileHeader.primaryContact.phone || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priorities & Preferences */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">What's Important to Them</h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Key Priorities
            </label>
            {isEditing ? (
              <div className="space-y-2">
                {editData.quickContext.priorities.map((priority, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={priority}
                      onChange={(e) => updatePriority(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                      placeholder="e.g., Increase weekend sales, Better online reviews"
                    />
                    <button
                      onClick={() => removePriority(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addPriority}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Priority
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileHeader.quickContext.priorities.length > 0 ? (
                  profileHeader.quickContext.priorities.map((priority, index) => (
                    <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                      {priority}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">No priorities set</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Communication Style</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Communication Style
              </label>
              {isEditing ? (
                <select
                  value={editData.quickContext.communicationStyle}
                  onChange={(e) => setEditData({
                    ...editData,
                    quickContext: {
                      ...editData.quickContext,
                      communicationStyle: e.target.value as ClientProfileHeader['quickContext']['communicationStyle']
                    }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="direct">Direct</option>
                  <option value="relationship-focused">Relationship-focused</option>
                </select>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 capitalize">
                  {profileHeader.quickContext.communicationStyle.replace('-', ' ')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Best Contact Method
              </label>
              {isEditing ? (
                <select
                  value={editData.quickContext.bestContactMethod}
                  onChange={(e) => setEditData({
                    ...editData,
                    quickContext: {
                      ...editData.quickContext,
                      bestContactMethod: e.target.value as ClientProfileHeader['quickContext']['bestContactMethod']
                    }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text</option>
                  <option value="in-person">In-person</option>
                </select>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 capitalize">
                  {profileHeader.quickContext.bestContactMethod.replace('-', ' ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Key Notes & Context
        </label>
        {isEditing ? (
          <textarea
            value={editData.quickContext.keyNotes}
            onChange={(e) => setEditData({
              ...editData,
              quickContext: { ...editData.quickContext, keyNotes: e.target.value }
            })}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Important context, preferences, things to remember about this client..."
          />
        ) : (
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {profileHeader.quickContext.keyNotes || 'No notes added yet'}
            </p>
          </div>
        )}
      </div>

      {/* Secondary Contacts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Additional Contacts</h4>
          {isEditing && (
            <button
              onClick={addSecondaryContact}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Contact
            </button>
          )}
        </div>

        <div className="space-y-4">
          {(isEditing ? editData.secondaryContacts : profileHeader.secondaryContacts).map((contact, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateSecondaryContact(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400">{contact.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Role
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={contact.role}
                      onChange={(e) => updateSecondaryContact(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400">{contact.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => updateSecondaryContact(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400">{contact.email}</p>
                  )}
                </div>
                <div className="flex items-end">
                  {isEditing ? (
                    <div className="w-full flex gap-2">
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateSecondaryContact(index, 'phone', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100"
                        placeholder="Phone"
                      />
                      <button
                        onClick={() => removeSecondaryContact(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400">{contact.phone}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {!isEditing && profileHeader.secondaryContacts.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              No additional contacts added
            </p>
          )}
        </div>
      </div>

      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </motion.div>
  );
} 
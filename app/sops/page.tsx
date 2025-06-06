'use client';

import { useState } from 'react';
import { 
  FileText,
  Lock,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface SOPItem {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'data-setup' | 'reporting' | 'troubleshooting' | 'client-management';
  lastUpdated: string;
  updatedBy: string;
  content: string;
  steps: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export default function SOPsPage() {
  const [expandedSOPs, setExpandedSOPs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: session } = useSession();

  // Redirect non-team members
  if (session && session.user?.role !== 'team') {
    redirect('/dashboard');
  }

  const toggleSOP = (sopId: string) => {
    const newExpanded = new Set(expandedSOPs);
    if (newExpanded.has(sopId)) {
      newExpanded.delete(sopId);
    } else {
      newExpanded.add(sopId);
    }
    setExpandedSOPs(newExpanded);
  };

  // Standard Operating Procedures
  const sops: SOPItem[] = [
    {
      id: 'client-onboarding',
      title: 'New Client Onboarding Checklist',
      description: 'Complete step-by-step process for onboarding new restaurant clients including data setup, integrations, and initial reporting.',
      category: 'onboarding',
      lastUpdated: '2025-01-06',
      updatedBy: 'Kyle Guilfoyle',
      estimatedTime: '2-3 hours',
      difficulty: 'intermediate',
      content: 'Comprehensive onboarding process to ensure new restaurant clients are set up for success with all necessary integrations and baseline reporting.',
      steps: [
        'Initial client discovery call and needs assessment',
        'Set up client account in Growth OS system',
        'Configure Google Ads API access with proper permissions',
        'Set up Meta Ads integration and pixel verification',
        'Connect POS system integration (Square, Toast, Clover)',
        'Establish baseline metrics and historical data import',
        'Configure email marketing integrations',
        'Set up client dashboard with appropriate access levels',
        'Schedule training session with client team',
        'Deliver initial performance audit and recommendations'
      ]
    },
    {
      id: 'google-ads-setup',
      title: 'Google Ads API Configuration',
      description: 'Process for setting up Google Ads API access, manager account linking, and troubleshooting common permission issues.',
      category: 'data-setup',
      lastUpdated: '2025-01-05',
      updatedBy: 'Technical Team',
      estimatedTime: '30-45 minutes',
      difficulty: 'advanced',
      content: 'Technical setup process for Google Ads API integration including manager account configuration and troubleshooting.',
      steps: [
        'Verify manager account (6738087852) has proper access',
        'Add client customer ID to authorized accounts',
        'Configure login-customer-id header in API calls',
        'Test basic campaign and keyword data retrieval',
        'Verify conversion tracking setup',
        'Set up proper error handling and fallback mechanisms',
        'Document client-specific API configuration',
        'Schedule regular API health checks'
      ]
    },
    {
      id: 'pos-integration',
      title: 'POS System Integration Guide',
      description: 'Standard procedures for connecting various POS systems (Square, Toast, Clover) and ensuring proper data flow.',
      category: 'data-setup',
      lastUpdated: '2025-01-04',
      updatedBy: 'Kyle Guilfoyle',
      estimatedTime: '1-2 hours',
      difficulty: 'intermediate',
      content: 'Integration guide for major POS systems to ensure accurate transaction and customer data collection.',
      steps: [
        'Identify client POS system and current capabilities',
        'Request API credentials from client IT/manager',
        'Set up webhook endpoints for real-time data sync',
        'Configure customer identification mapping',
        'Test transaction data flow and accuracy',
        'Set up automated data quality monitoring',
        'Create client-specific reporting views',
        'Provide client team with integration documentation'
      ]
    },
    {
      id: 'monthly-reporting',
      title: 'Monthly Client Reporting Process',
      description: 'Template and process for generating monthly performance reports, including data validation and client presentation format.',
      category: 'reporting',
      lastUpdated: '2025-01-03',
      updatedBy: 'Account Management',
      estimatedTime: '45-60 minutes',
      difficulty: 'beginner',
      content: 'Standardized monthly reporting process to ensure consistent, high-quality client deliverables.',
      steps: [
        'Pull performance data from all integrated sources',
        'Validate data accuracy and flag any anomalies',
        'Generate industry benchmark comparisons',
        'Create executive summary with key insights',
        'Prepare action items and recommendations',
        'Format report using client-specific branding',
        'Schedule and conduct client review meeting',
        'Follow up on action items and next steps'
      ]
    },
    {
      id: 'data-quality-troubleshooting',
      title: 'Data Quality Issue Resolution',
      description: 'Common data quality issues and their solutions, including missing conversion tracking, attribution problems, and data gaps.',
      category: 'troubleshooting',
      lastUpdated: '2025-01-02',
      updatedBy: 'Technical Team',
      estimatedTime: '20-30 minutes',
      difficulty: 'advanced',
      content: 'Troubleshooting guide for common data quality issues and their resolution.',
      steps: [
        'Identify data quality issue type and scope',
        'Check API connection status and error logs',
        'Verify pixel installation and firing correctly',
        'Review attribution model configuration',
        'Check for duplicate or missing conversion events',
        'Validate customer ID mapping across systems',
        'Implement data backfill if necessary',
        'Update monitoring alerts to prevent recurrence'
      ]
    },
    {
      id: 'client-access-setup',
      title: 'Client Sub-Account Access Configuration',
      description: 'Process for setting up client-specific access levels, hiding internal sections, and configuring role-based permissions.',
      category: 'client-management',
      lastUpdated: '2025-01-01',
      updatedBy: 'Kyle Guilfoyle',
      estimatedTime: '15-20 minutes',
      difficulty: 'beginner',
      content: 'Guide for configuring client access to their dashboard while maintaining internal security.',
      steps: [
        'Create client-specific login credentials',
        'Set user role to "client" in authentication system',
        'Configure client-specific data filtering',
        'Hide team-only sections (SOPs, internal tools)',
        'Set up client-specific branding if applicable',
        'Test client access and functionality',
        'Provide login instructions to client',
        'Schedule client training session'
      ]
    },
    {
      id: 'manual-data-entry',
      title: 'Manual Data Entry Procedures',
      description: 'Process for manually updating dashboard metrics when API integrations are not yet available.',
      category: 'data-setup',
      lastUpdated: '2025-01-06',
      updatedBy: 'Account Management',
      estimatedTime: '10-15 minutes',
      difficulty: 'beginner',
      content: 'Standard process for maintaining accurate dashboard data through manual entry during integration gaps.',
      steps: [
        'Access admin data entry interface',
        'Gather current metrics from client sources',
        'Enter data with proper date timestamps',
        'Verify calculations and benchmark assessments',
        'Add notes about data source and methodology',
        'Update trend indicators based on previous periods',
        'Schedule next manual update reminder',
        'Document when full automation will be available'
      ]
    },
    {
      id: 'historical-data-import',
      title: 'Historical Data Import Process',
      description: 'Procedures for importing and organizing historical client data to establish baseline trends.',
      category: 'data-setup',
      lastUpdated: '2025-01-06',
      updatedBy: 'Technical Team',
      estimatedTime: '1-2 hours',
      difficulty: 'intermediate',
      content: 'Process for importing historical data to provide context and trend analysis for new clients.',
      steps: [
        'Request historical data from client (12+ months preferred)',
        'Clean and standardize data format',
        'Map client data fields to Growth OS schema',
        'Import data with proper date attribution',
        'Validate imported data accuracy',
        'Calculate historical trend indicators',
        'Set baseline benchmarks for client',
        'Generate initial trend visualizations'
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'onboarding': return 'text-blue-700 bg-blue-100';
      case 'data-setup': return 'text-purple-700 bg-purple-100';
      case 'reporting': return 'text-green-700 bg-green-100';
      case 'troubleshooting': return 'text-orange-700 bg-orange-100';
      case 'client-management': return 'text-indigo-700 bg-indigo-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-700 bg-green-100';
      case 'intermediate': return 'text-yellow-700 bg-yellow-100';
      case 'advanced': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'onboarding', 'data-setup', 'reporting', 'troubleshooting', 'client-management'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <FileText className="text-red-600" size={32} />
            Standard Operating Procedures
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Lock className="text-red-600" size={16} />
            <p className="text-slate-600 dark:text-slate-400">
              Internal documentation and processes for team members
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Add New SOP
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search SOPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400" size={16} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SOPs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSOPs.map((sop) => {
          const isExpanded = expandedSOPs.has(sop.id);
          
          return (
            <div key={sop.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                onClick={() => toggleSOP(sop.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {sop.title}
                  </h3>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(sop.category)}`}>
                    {sop.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(sop.difficulty)}`}>
                    {sop.difficulty.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {sop.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    {sop.updatedBy}
                  </div>
                </div>

                {!isExpanded && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {sop.description}
                  </p>
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {sop.content}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2 text-sm">Steps:</h4>
                    <ol className="space-y-2">
                      {sop.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Last updated: {sop.lastUpdated}</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View Full Documentation →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredSOPs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">No SOPs found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
} 
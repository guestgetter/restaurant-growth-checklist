import { Target, TrendingUp, Users, Zap, ArrowRight, Lightbulb } from 'lucide-react';

export default function LeveragePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Leverage
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Amplify your restaurant's growth with strategic leverage points
          </p>
        </div>
      </div>

      {/* Coming Soon Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/20 rounded-lg">
            <Target size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Leverage Hub</h2>
            <p className="text-orange-100">
              Identify and maximize your restaurant's growth multipliers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap size={20} />
              Growth Multipliers
            </h3>
            <p className="text-orange-100 text-sm mb-4">
              Identify the 20% of efforts that drive 80% of your results
            </p>
            <div className="text-xs bg-white/20 rounded p-2 font-mono">
              Strategic Focus Areas
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={20} />
              Leverage Points
            </h3>
            <p className="text-orange-100 text-sm mb-4">
              Systems and processes that scale your impact
            </p>
            <div className="text-xs bg-white/20 rounded p-2 font-mono">
              Scalable Systems
            </div>
          </div>
        </div>
      </div>

      {/* Leverage Concepts Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Team Leverage</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Multiply through people</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Train and empower your team to execute your vision without constant oversight.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <span>Explore strategies</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Zap className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">System Leverage</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automate and optimize</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Build systems that work 24/7 to drive customer acquisition and retention.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <span>Build systems</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Market Leverage</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Amplify your reach</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Use partnerships, technology, and strategic positioning to expand your market presence.
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
            <span>Scale reach</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Leverage Framework Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Lightbulb size={24} />
          Leverage Framework
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
              High-Impact Activities
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Staff Training Programs</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Train once, benefit continuously</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Customer Retention Systems</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated loyalty and engagement</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Strategic Partnerships</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Shared resources, expanded reach</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Force Multipliers
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Technology Integration</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">3x ROI</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Content Marketing</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">5x Reach</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Process Optimization</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">2x Efficiency</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Ready to maximize your leverage?
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              The Leverage Hub will help you identify and scale your highest-impact growth strategies
            </p>
          </div>
          <ArrowRight className="text-orange-600 dark:text-orange-400" size={24} />
        </div>
      </div>
    </div>
  );
} 
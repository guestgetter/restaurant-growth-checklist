import ClientManagement from '../../components/Settings/ClientManagement';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage clients, branding, and platform configuration
          </p>
        </div>
      </div>

      <ClientManagement />
    </div>
  );
} 
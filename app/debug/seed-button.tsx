'use client';

import { useState } from 'react';

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const seedDatabase = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();
      
      if (data.success) {
        setResult('✅ Database seeded successfully!');
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Database Management</h3>
      
      <button
        onClick={seedDatabase}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Seeding...' : 'Seed Database'}
      </button>
      
      {result && (
        <p className="mt-4 text-sm">{result}</p>
      )}
      
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        This initializes the database with checklist sections and creates a demo client if none exist.
      </p>
    </div>
  );
} 
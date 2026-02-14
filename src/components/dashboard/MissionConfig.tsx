import React, { useState } from 'react';
import { useAgentStore } from '../../stores/useAgentStore';

interface MissionConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MissionConfig({ isOpen, onClose }: MissionConfigProps) {
  const [goal, setGoal] = useState('');
  const [depth, setDepth] = useState<'quick' | 'deep'>('quick');
  const [outputFormat, setOutputFormat] = useState<'new' | 'append'>('new');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setAgentStatus = useAgentStore((state) => state.setStatus);
  const addLog = useAgentStore((state) => state.addLog);

  if (!isOpen) return null;

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Stub for Tauri command or HTTP request
      const response = await fetch('http://localhost:8000/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal,
          depth,
          output_format: outputFormat,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start mission: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Mission started:', data);
      
      // Update store state
      setAgentStatus('running');
      addLog({ 
        timestamp: new Date().toISOString(), 
        message: `Mission started: ${goal} (${depth})`, 
        type: 'info' 
      });

      onClose();
    } catch (err: any) {
      console.error('Error starting mission:', err);
      setError(err.message || 'Failed to start mission');
      addLog({ 
        timestamp: new Date().toISOString(), 
        message: `Error starting mission: ${err.message}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Start New Mission</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Research Goal
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Analyze the latest trends in quantum computing..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Depth
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value as 'quick' | 'deep')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="quick">Quick (Overview)</option>
                <option value="deep">Deep (Comprehensive)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'new' | 'append')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">New Report</option>
                <option value="append">Append to Existing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!goal.trim() || isLoading}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors ${
              (!goal.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Starting...' : 'Start Mission'}
          </button>
        </div>
      </div>
    </div>
  );
}

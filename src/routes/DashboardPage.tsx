import React, { useState } from 'react';
import MissionConfig from '../components/dashboard/MissionConfig';
import AgentHUD from '../components/agent/AgentHUD';
import { useAgentStore } from '../stores/useAgentStore';

const DashboardPage: React.FC = () => {
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const agentStatus = useAgentStore((state) => state.status);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Research Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage and monitor your autonomous research agents.</p>
        </div>
        <button
          onClick={() => setIsMissionModalOpen(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Mission
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Content Area (e.g. Recent Reports) */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-800 rounded-lg">
            No recent reports found. Start a new mission to generate insights.
          </div>
        </div>

        {/* Agent HUD (Right Sidebar) */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-gray-950/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${agentStatus === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
              Active Agent
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            {agentStatus === 'idle' ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p>Agent is currently idle.</p>
                <button 
                  onClick={() => setIsMissionModalOpen(true)}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Start a task
                </button>
              </div>
            ) : (
              <AgentHUD />
            )}
          </div>
        </div>
      </div>

      <MissionConfig 
        isOpen={isMissionModalOpen} 
        onClose={() => setIsMissionModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardPage;

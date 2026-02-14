import React from 'react';
import StatusTicker from './StatusTicker';
import LiveLog from './LiveLog';
import PlanStepper from './PlanStepper';
import { useAgentStore } from '../../stores/useAgentStore';

export default function AgentHUD() {
  const currentStep = useAgentStore((state) => state.currentStep);
  const status = useAgentStore((state) => state.status);

  // Example "Mission Config" that would be passed to the agent
  // For now, we'll just show what's happening.

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      {/* Header / Status Ticker */}
      <StatusTicker />

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Progress Stepper & Context */}
        <div className="mb-4 bg-gray-800 rounded-lg p-3 shadow-sm">
          <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Current Mission</h3>
          <PlanStepper />
        </div>

        {/* Live Logs */}
        <div className="flex-1 flex flex-col min-h-0">
          <LiveLog />
        </div>
      </div>
      
      {/* Footer Controls (Stop/Pause) - Optional */}
      <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-gray-950">
        <span className="text-xs text-gray-500">Agent: {status}</span>
        {status === 'running' && (
          <button 
            className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-200 text-xs rounded border border-red-800 transition-colors"
            onClick={() => {
              // Stub for stop command
              console.log('Stopping agent...');
              useAgentStore.getState().setStatus('stopped');
            }}
          >
            Stop Agent
          </button>
        )}
      </div>
    </div>
  );
}

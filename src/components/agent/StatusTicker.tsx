import React, { useEffect, useState } from 'react';
import { useAgentStore } from '../../stores/useAgentStore';

export default function StatusTicker() {
  const currentStep = useAgentStore((state) => state.currentStep);
  const status = useAgentStore((state) => state.status);
  
  const [tickerText, setTickerText] = useState('Idle');

  useEffect(() => {
    if (status === 'running' && currentStep) {
      setTickerText(`Processing: ${currentStep}`);
    } else if (status === 'paused') {
      setTickerText('Paused');
    } else if (status === 'completed') {
      setTickerText('Mission Completed');
    } else {
      setTickerText('Waiting for mission...');
    }
  }, [currentStep, status]);

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between text-sm text-gray-300">
      <div className="flex items-center space-x-2">
        <span className={`w-2 h-2 rounded-full ${
          status === 'running' ? 'bg-green-500 animate-pulse' :
          status === 'paused' ? 'bg-yellow-500' :
          status === 'completed' ? 'bg-blue-500' :
          'bg-gray-500'
        }`} />
        <span className="font-mono">{tickerText}</span>
      </div>
      
      {/* Optional: Add a simple progress indicator or icon */}
      <div className="text-xs text-gray-500">
        Agent Status: {status.toUpperCase()}
      </div>
    </div>
  );
}

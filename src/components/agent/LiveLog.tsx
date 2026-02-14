import React, { useEffect, useRef } from 'react';
import { useAgentStore } from '../../stores/useAgentStore';

export default function LiveLog() {
  const logs = useAgentStore((state) => state.logs);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex-1 overflow-hidden relative border border-gray-700 rounded-lg bg-gray-950">
      <div className="absolute inset-x-0 top-0 bg-gray-800 p-2 text-xs text-gray-400 border-b border-gray-700 flex justify-between">
        <span>MISSION LOGS</span>
        <button 
          onClick={() => useAgentStore.getState().clearLogs()}
          className="hover:text-red-400 transition-colors"
        >
          Clear
        </button>
      </div>

      <div 
        ref={logContainerRef}
        className="h-full overflow-y-auto p-4 pt-10 font-mono text-sm space-y-1"
      >
        {logs.length === 0 && (
          <div className="text-gray-600 text-center italic mt-10">
            No logs recorded yet. Start a mission to see activity.
          </div>
        )}

        {logs.map((log, index) => (
          <div key={index} className="flex gap-3 animate-fade-in-up">
            <span className="text-gray-600 shrink-0 select-none">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`break-words ${
              log.type === 'error' ? 'text-red-400' :
              log.type === 'success' ? 'text-green-400' :
              log.type === 'warning' ? 'text-yellow-400' :
              'text-gray-300'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

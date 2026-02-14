import React from 'react';
import { useAgentStore } from '../../stores/useAgentStore';

const steps = [
  { id: 'plan', label: 'Plan', desc: 'Analyzing the goal...' },
  { id: 'research', label: 'Research', desc: 'Gathering information...' },
  { id: 'write', label: 'Write', desc: 'Synthesizing report...' }
];

export default function PlanStepper() {
  const currentStep = useAgentStore((state) => state.currentStep);
  // Assuming currentStep is a string like "plan: step 1", we can parse it
  // Or, we can use a simpler approach by mapping known steps to an index
  
  const activeStepIndex = steps.findIndex(step => 
    currentStep?.toLowerCase().includes(step.id)
  ) ?? -1;

  return (
    <div className="flex flex-col space-y-4 mb-4">
      {steps.map((step, index) => {
        const isActive = activeStepIndex === index;
        const isCompleted = activeStepIndex > index;
        
        return (
          <div key={step.id} className="relative flex items-center">
            {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div className={`absolute left-3 top-6 h-full w-0.5 ml-[1px] ${
                isCompleted ? 'bg-blue-600' : 'bg-gray-700'
              }`} />
            )}
            
            <div className={`
              z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 
              ${isActive ? 'border-blue-500 bg-blue-900 text-blue-200' :
                isCompleted ? 'border-blue-600 bg-blue-600 text-white' : 
                'border-gray-600 bg-gray-800 text-gray-500'}
            `}>
              {isCompleted ? (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )}
            </div>
            
            <div className="ml-4 flex flex-col">
              <span className={`text-sm font-medium ${
                isActive ? 'text-blue-400' : isCompleted ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              <span className="text-xs text-gray-500">
                {step.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { create } from 'zustand';

export interface AgentLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export type AgentStatus = 'idle' | 'running' | 'paused' | 'completed' | 'stopped';

interface AgentState {
  status: AgentStatus;
  currentStep: string | null;
  logs: AgentLog[];
  
  setStatus: (status: AgentStatus) => void;
  setCurrentStep: (step: string | null) => void;
  addLog: (log: AgentLog) => void;
  clearLogs: () => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  status: 'idle',
  currentStep: null,
  logs: [],

  setStatus: (status) => set({ status }),
  setCurrentStep: (step) => set({ currentStep: step }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),
  reset: () => set({ status: 'idle', currentStep: null, logs: [] }),
}));

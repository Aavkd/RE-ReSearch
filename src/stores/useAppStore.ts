import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LLMConfig {
  provider: 'ollama' | 'gemini' | 'openai';
  ollamaUrl: string;
  geminiKey: string;
  openaiKey: string;
}

interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // LLM Config
  llmConfig: LLMConfig;

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setLLMConfig: (config: Partial<LLMConfig>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      
      llmConfig: {
        provider: 'ollama',
        ollamaUrl: 'http://localhost:11434',
        geminiKey: '',
        openaiKey: '',
      },

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setLLMConfig: (config) =>
        set((state) => ({
          llmConfig: { ...state.llmConfig, ...config },
        })),
    }),
    {
      name: 'app-storage', // name of the item in the storage (must be unique)
    }
  )
);

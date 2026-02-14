import React from 'react';
import { useAppStore } from '../stores/useAppStore';

const SettingsPage: React.FC = () => {
  const { llmConfig, setLLMConfig } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-white mb-4">LLM Configuration</h2>
        
        <div className="space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['ollama', 'gemini', 'openai'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => setLLMConfig({ provider: provider as any })}
                  className={`px-4 py-3 rounded-lg border text-left transition-all ${
                    llmConfig.provider === provider
                      ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium text-white">{provider}</span>
                    {llmConfig.provider === provider && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Inputs */}
          <div className="pt-4 border-t border-gray-800">
            {llmConfig.provider === 'ollama' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Ollama URL
                </label>
                <input
                  type="text"
                  value={llmConfig.ollamaUrl}
                  onChange={(e) => setLLMConfig({ ollamaUrl: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Ensure Ollama is running and accessible.
                </p>
              </div>
            )}

            {llmConfig.provider === 'gemini' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={llmConfig.geminiKey}
                  onChange={(e) => setLLMConfig({ geminiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {llmConfig.provider === 'openai' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={llmConfig.openaiKey}
                  onChange={(e) => setLLMConfig({ openaiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

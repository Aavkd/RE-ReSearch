import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { LayoutDashboard, Folder, Settings, Menu, ChevronLeft, PlusCircle } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { cn } from '../../lib/utils'; 

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [showIngest, setShowIngest] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/project/1', icon: Folder, label: 'Project' }, // Hardcoded project ID for now
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={`bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {sidebarOpen && <span className="font-bold text-lg text-gray-800 dark:text-gray-100">RE_ReSearch</span>}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setShowIngest(true)}
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 w-full transition-colors ${!sidebarOpen && 'justify-center'}`}
          title="Add New Source"
        >
          <PlusCircle size={20} />
          {sidebarOpen && <span>Add Source</span>}
        </button>
      </div>

      {showIngest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowIngest(false)}>
           <div 
             onClick={e => e.stopPropagation()} 
             className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 w-96 relative"
           >
              <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">Add Source</h3>
              <input 
                className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded mb-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="https://example.com"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const target = e.currentTarget;
                    const url = target.value;
                    if (!url) return;
                    
                    try {
                      target.disabled = true;
                      await invoke('ingest_url', { url, provider: 'ollama', apiKey: null });
                      setShowIngest(false);
                      // Simple notification (ideally use a toast)
                      alert('Successfully ingested URL!');
                    } catch (err) {
                      alert('Ingest failed: ' + err);
                      target.disabled = false;
                      target.focus();
                    }
                  }
                }}
                autoFocus
              />
              <p className="text-xs text-zinc-500">Press Enter to ingest. Ensure Ollama is running.</p>
           </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

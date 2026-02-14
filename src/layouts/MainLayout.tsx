import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import { SearchDialog } from '../components/ui/SearchDialog';
import { ChatPanel } from '../components/chat/ChatPanel';
import { MessageSquare } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

const MainLayout: React.FC = () => {
  const { theme } = useAppStore();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Apply dark mode class to root html/body or layout wrapper
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans antialiased relative">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Outlet />
      </main>
      
      <SearchDialog />
      
      {/* Chat Panel & Trigger */}
      <div className={`fixed right-0 top-0 h-full transition-transform duration-300 z-50 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 z-40"
          title="Open AI Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MainLayout;

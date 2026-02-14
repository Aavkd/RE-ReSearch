import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { LayoutDashboard, Folder, Settings, Menu, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming cn utility exists, usually does in shadcn/ui setups or I'll create it if needed.

// Wait, I don't know if `lib/utils` exists. I'll check first or just implement inline class names.
// I'll stick to inline template literals for now to be safe.

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/project', icon: Folder, label: 'Project' },
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
      
      {/* Footer or bottom actions could go here */}
    </aside>
  );
};

export default Sidebar;

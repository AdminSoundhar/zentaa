import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Contact, 
  BarChart3, 
  Settings, 
  LogOut,
  Hexagon
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'contacts', label: 'Contacts', icon: Contact },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar text-white transition-all duration-300 z-20 flex flex-col shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <Hexagon className="w-8 h-8 text-blue-500 mr-3 fill-current" />
        <span className="text-xl font-bold tracking-tight">Zenta CRM</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewState)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mt-1"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
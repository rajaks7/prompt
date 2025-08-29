import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, PlusSquare, Settings, Brain, Star, Zap } from 'lucide-react';

// Enhanced Logo Component
const Logo = () => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-white rounded-sm opacity-90"></div>
          <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
        </div>
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
    </div>
    <div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Prompt Manager
      </h1>
      <p className="text-xs text-gray-500 -mt-1">AI-Powered</p>
    </div>
  </div>
);

const navigationItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'library', 
    label: 'Library', 
    path: '/library', 
    icon: Library,
    color: 'from-purple-500 to-purple-600'
  },
  { 
    id: 'create', 
    label: 'Create', 
    path: '/create', 
    icon: PlusSquare,
    color: 'from-green-500 to-green-600'
  },
  { 
    id: 'admin', 
    label: 'Admin', 
    path: '/admin', 
    icon: Settings,
    color: 'from-orange-500 to-orange-600'
  },
];

const NavItem = ({ item, isActive, onSetActive }) => {
  return (
    <div
      className={`group relative mb-2 transition-all duration-200 ${
        isActive ? 'scale-105' : 'hover:scale-102'
      }`}
    >
      <NavLink
        to={item.path}
        end={item.path === '/dashboard'}
        onClick={() => onSetActive(item.id)}
        className={({ isActive: linkIsActive }) => {
          const active = linkIsActive || isActive;
          return `w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
            active
              ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }`;
        }}
      >
        <div className="flex-shrink-0">
          <item.icon size={20} />
        </div>
        <span className="font-medium">{item.label}</span>
      </NavLink>
      
      {/* Active indicator */}
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

const SidebarNavigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPrompts: 0,
    avgRating: 0,
    weekPrompts: 0
  });

  // Fetch real stats for sidebar
  useEffect(() => {
    const fetchSidebarStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        const data = await response.json();
        setStats({
          totalPrompts: data.totalPrompts || 0,
          avgRating: data.avgRating || 0,
          weekPrompts: data.weekPrompts || 0
        });
      } catch (err) {
        console.error('Failed to fetch sidebar stats:', err);
        // Keep default values if fetch fails
      }
    };

    fetchSidebarStats();
  }, []);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 shadow-sm flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={activeTab === item.id}
              onSetActive={setActiveTab}
            />
          ))}
        </div>

        {/* Real Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain size={14} className="text-blue-500" />
                <span className="text-xs text-gray-600">Total Prompts</span>
              </div>
              <span className="text-xs font-semibold text-gray-800">
                {stats.totalPrompts.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs text-gray-600">Avg Rating</span>
              </div>
              <span className="text-xs font-semibold text-gray-800">
                {stats.avgRating > 0 ? `${stats.avgRating}★` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap size={14} className="text-purple-500" />
                <span className="text-xs text-gray-600">This Week</span>
              </div>
              <span className="text-xs font-semibold text-gray-800">
                +{stats.weekPrompts}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default SidebarNavigation;
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNavigation from 'components/ui/SidebarNavigation';
import Header from 'components/ui/Header';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('promptManagerUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle user login
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('promptManagerUser', JSON.stringify(userData));
    console.log('User logged in:', userData);
  };

  // Handle user logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('promptManagerUser');
    console.log('User logged out');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Only show sidebar if user is logged in */}
      {currentUser && (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <SidebarNavigation />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed inset-y-0 left-0 z-50 md:hidden"
                >
                  <SidebarNavigation />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header - only show if logged in */}
        {currentUser && (
          <div className="md:hidden p-4 bg-white border-b flex items-center justify-between">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {/* Mobile Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span className="font-bold text-gray-800">Prompt Manager</span>
            </div>
            
            {/* Mobile User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Header - always show */}
        <Header 
          user={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        {/* Main Content - only show if logged in */}
        <div className="flex-1 overflow-y-auto">
          {currentUser ? (
            <Outlet />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mx-auto mb-8 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">R</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Prompt Manager
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Your AI-powered prompt library awaits. Please log in to get started.
                </p>
                <div className="text-sm text-gray-500">
                  Select a user from the dropdown above to continue
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
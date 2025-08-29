import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Plus, X, Trash2, Edit3 } from 'lucide-react';
import userManager from '../../utils/userManager'; // You'll need to create this file

const Header = ({ user, onLogin, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showManageUsersModal, setShowManageUsersModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [error, setError] = useState('');

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      setAvailableUsers(userManager.getAllUsers());
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      userManager.addUser(newUser);
      setNewUser({ name: '', email: '', role: 'user' });
      setShowAddUserModal(false);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        userManager.deleteUser(userId);
        loadUsers();
      } catch (err) {
        alert('Failed to delete user: ' + err.message);
      }
    }
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false); // Close dropdown first
    if (onLogout) {
      onLogout();
    }
  };

  // If no user is logged in, show login page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          {/* Centered Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-white rounded-lg opacity-90"></div>
                  <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">R</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-4">
              Prompt Manager
            </h1>
            <p className="text-gray-500 mt-2">AI-Powered Prompt Library</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Select your account to continue</p>
            </div>

            {/* User Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose User Account
                </label>
                <select 
                  onChange={(e) => {
                    if (e.target.value && onLogin) {
                      const userData = JSON.parse(e.target.value);
                      onLogin(userData);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                >
                  <option value="">Select a user...</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={JSON.stringify(user)}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add User
                </button>
                <button
                  onClick={() => setShowManageUsersModal(true)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit3 size={16} className="mr-2" />
                  Manage Users
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            Secure • Fast • AI-Powered
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                  <button 
                    onClick={() => {
                      setShowAddUserModal(false);
                      setError('');
                      setNewUser({ name: '', email: '', role: 'user' });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddUser} className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setError('');
                      setNewUser({ name: '', email: '', role: 'user' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Users Modal */}
        {showManageUsersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
                  <button 
                    onClick={() => setShowManageUsersModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="space-y-3">
                  {availableUsers.map(userItem => (
                    <div key={userItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${userItem.avatar}`}>
                          {userItem.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{userItem.name}</p>
                          <p className="text-sm text-gray-500">{userItem.email}</p>
                          <p className="text-xs text-blue-600 capitalize">{userItem.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(userItem.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If user is logged in, show dashboard header
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Personalized Welcome */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="mt-1 text-gray-500">
              {getWelcomeMessage()} Ready to create something amazing?
            </p>
          </div>

          {/* Simple User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${user.avatar || 'bg-purple-500'}`}>
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Simple Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${user.avatar || 'bg-purple-500'}`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-blue-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper function for dynamic welcome messages
const getWelcomeMessage = () => {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  
  if (hour < 12) return "Good morning!";
  if (hour < 17) return "Good afternoon!";
  if (day === 5) return "Happy Friday evening!";
  if (day === 0 || day === 6) return "Hope you're having a great weekend!";
  return "Good evening!";
};

export default Header;
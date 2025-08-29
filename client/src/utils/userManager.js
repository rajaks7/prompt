// src/utils/userManager.js
// This file manages all user operations

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Sarah Wilson",
    role: "admin",
    email: "sarah@company.com",
    avatar: "bg-purple-500",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Mike Johnson", 
    role: "user",
    email: "mike@company.com",
    avatar: "bg-blue-500",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Lisa Wang",
    role: "editor", 
    email: "lisa@company.com",
    avatar: "bg-green-500",
    createdAt: new Date().toISOString()
  }
];

// Avatar colors for new users
const AVATAR_COLORS = [
  'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500',
  'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500'
];

class UserManager {
  constructor() {
    this.initializeUsers();
  }

  // Initialize users in localStorage if not exists
  initializeUsers() {
    const existingUsers = localStorage.getItem('promptManagerUsers');
    if (!existingUsers) {
      localStorage.setItem('promptManagerUsers', JSON.stringify(DEFAULT_USERS));
    }
  }

  // Get all users
  getAllUsers() {
    const users = localStorage.getItem('promptManagerUsers');
    return users ? JSON.parse(users) : DEFAULT_USERS;
  }

  // Add new user
  addUser(userData) {
    const users = this.getAllUsers();
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: userData.name.trim(),
      role: userData.role || 'user',
      email: userData.email.trim().toLowerCase(),
      avatar: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
      createdAt: new Date().toISOString()
    };

    // Check if email already exists
    if (users.some(u => u.email === newUser.email)) {
      throw new Error('Email already exists');
    }

    users.push(newUser);
    localStorage.setItem('promptManagerUsers', JSON.stringify(users));
    return newUser;
  }

  // Update user
  updateUser(userId, updates) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== users[userIndex].email) {
      if (users.some(u => u.email === updates.email.toLowerCase() && u.id !== userId)) {
        throw new Error('Email already exists');
      }
    }

    users[userIndex] = { 
      ...users[userIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    localStorage.setItem('promptManagerUsers', JSON.stringify(users));
    return users[userIndex];
  }

  // Delete user
  deleteUser(userId) {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }

    localStorage.setItem('promptManagerUsers', JSON.stringify(filteredUsers));
    return true;
  }

  // Get user by ID
  getUserById(userId) {
    const users = this.getAllUsers();
    return users.find(u => u.id === userId);
  }

  // Get user by email
  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(u => u.email === email.toLowerCase());
  }

  // Get random user (for activity simulation)
  getRandomUser() {
    const users = this.getAllUsers();
    return users[Math.floor(Math.random() * users.length)];
  }

  // Get users for dropdown (formatted for select)
  getUsersForDropdown() {
    const users = this.getAllUsers();
    return users.map(user => ({
      value: JSON.stringify(user),
      label: `${user.name} (${user.role})`,
      user: user
    }));
  }
}

// Create and export singleton instance
const userManager = new UserManager();
export default userManager;
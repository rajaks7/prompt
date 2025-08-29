import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ 
  currentUser = { role: 'user', name: 'User' },
  onSearch,
  showSearch = true 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const primaryNavItems = [
    {
      label: 'Dashboard',
      path: '/prompt-library-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Create',
      path: '/prompt-creation-editing-interface',
      icon: 'Plus'
    },
    {
      label: 'Search',
      path: '/advanced-search-filter-management',
      icon: 'Search'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Administration',
      path: '/system-administration-configuration',
      icon: 'Settings',
      requiredRole: 'admin'
    }
  ];

  const filteredSecondaryItems = secondaryNavItems?.filter(item => 
    !item?.requiredRole || currentUser?.role === item?.requiredRole
  );

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (onSearch && searchQuery?.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleCommandPalette = () => {
    setIsCommandPaletteOpen(true);
    // Command palette implementation would go here
  };

  // Keyboard shortcut for command palette
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e?.metaKey || e?.ctrlKey) && e?.key === 'k') {
        e?.preventDefault();
        handleCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-lg">
              Prompt Manager
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={location?.pathname === item?.path ? 'default' : 'ghost'}
              size="sm"
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              onClick={() => handleNavigation(item?.path)}
              className="px-3"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          {showSearch && (
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search prompts... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-64 px-3 py-2 pl-10 text-sm bg-muted border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                           placeholder:text-muted-foreground"
                />
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </form>
            </div>
          )}

          {/* Command Palette Trigger */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Command"
            onClick={handleCommandPalette}
            className="hidden md:flex"
            title="Command Palette (⌘K)"
          />

          {/* More Menu */}
          {filteredSecondaryItems?.length > 0 && (
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                className="md:flex"
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-150 ease-smooth z-50">
                <div className="py-2">
                  {filteredSecondaryItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground
                               hover:bg-muted transition-colors duration-150"
                    >
                      <Icon name={item?.icon} size={16} className="mr-3 text-muted-foreground" />
                      {item?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted
                             transition-colors duration-150">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-muted-foreground" />
              </div>
              <span className="hidden md:block text-sm font-medium text-foreground">
                {currentUser?.name}
              </span>
              <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
            </button>

            {/* User Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible
                          transition-all duration-150 ease-smooth z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground">
                    {currentUser?.name}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {currentUser?.role}
                  </div>
                </div>
                <button className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground
                                 hover:bg-muted transition-colors duration-150">
                  <Icon name="User" size={16} className="mr-3 text-muted-foreground" />
                  Profile
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground
                                 hover:bg-muted transition-colors duration-150">
                  <Icon name="Settings" size={16} className="mr-3 text-muted-foreground" />
                  Preferences
                </button>
                <div className="border-t border-border mt-2 pt-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground
                                   hover:bg-muted transition-colors duration-150">
                    <Icon name="LogOut" size={16} className="mr-3 text-muted-foreground" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
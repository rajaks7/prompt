import React from 'react';
import Icon from '../AppIcon';

const UserRoleIndicator = ({ 
  user = { role: 'user', name: 'User' }, 
  isCollapsed = false 
}) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return 'Shield';
      case 'manager':
        return 'Users';
      case 'editor':
        return 'Edit';
      default:
        return 'User';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      case 'editor':
        return 'Editor';
      default:
        return 'User';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-error text-error-foreground';
      case 'manager':
        return 'bg-warning text-warning-foreground';
      case 'editor':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isCollapsed) {
    return (
      <div className="group relative flex justify-center">
        <div className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-150">
          <Icon 
            name={getRoleIcon(user?.role)} 
            size={16} 
            className="text-muted-foreground"
          />
        </div>
        {/* Tooltip */}
        <div className="
          absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground
          text-xs rounded-md shadow-modal border border-border
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity duration-150 ease-smooth
          whitespace-nowrap z-50
        ">
          <div className="font-medium">{user?.name}</div>
          <div className="text-muted-foreground">{getRoleLabel(user?.role)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* User Avatar */}
      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
        <Icon 
          name={getRoleIcon(user?.role)} 
          size={16} 
          className="text-muted-foreground"
        />
      </div>
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground truncate">
            {user?.name}
          </span>
          <span className={`
            px-1.5 py-0.5 text-xs font-medium rounded-md
            ${getRoleBadgeColor(user?.role)}
          `}>
            {getRoleLabel(user?.role)}
          </span>
        </div>
        
        {/* Role Permissions Indicator */}
        {user?.role === 'admin' && (
          <div className="flex items-center space-x-1 mt-1">
            <Icon name="Key" size={10} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Full Access
            </span>
          </div>
        )}
        
        {user?.role === 'manager' && (
          <div className="flex items-center space-x-1 mt-1">
            <Icon name="Users" size={10} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Team Access
            </span>
          </div>
        )}
        
        {user?.role === 'user' && (
          <div className="flex items-center space-x-1 mt-1">
            <Icon name="Eye" size={10} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              View Only
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleIndicator;
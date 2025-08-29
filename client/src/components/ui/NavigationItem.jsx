import React from 'react';
import Icon from '../AppIcon';

const NavigationItem = ({ 
  item, 
  isActive = false, 
  isCollapsed = false, 
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' || e?.key === ' ') {
      e?.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        group relative flex items-center px-3 py-2.5 rounded-lg cursor-pointer
        transition-all duration-150 ease-smooth
        ${isActive 
          ? 'bg-primary text-primary-foreground shadow-sm' 
          : 'text-foreground hover:bg-muted hover:text-foreground'
        }
        ${isCollapsed ? 'justify-center' : 'justify-start'}
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      `}
      aria-label={item?.tooltip || item?.label}
      title={isCollapsed ? item?.label : item?.tooltip}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon 
          name={item?.icon} 
          size={20} 
          className={`
            transition-colors duration-150
            ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
          `}
        />
      </div>
      {/* Label */}
      {!isCollapsed && (
        <span className={`
          ml-3 font-medium text-sm truncate
          transition-colors duration-150
          ${isActive ? 'text-primary-foreground' : 'text-foreground'}
        `}>
          {item?.label}
        </span>
      )}
      {/* Active Indicator */}
      {isActive && !isCollapsed && (
        <div className="ml-auto w-1.5 h-1.5 bg-primary-foreground rounded-full opacity-75" />
      )}
      {/* Tooltip for Collapsed State */}
      {isCollapsed && (
        <div className="
          absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground
          text-xs rounded-md shadow-modal border border-border
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity duration-150 ease-smooth
          whitespace-nowrap z-50
        ">
          {item?.label}
        </div>
      )}
    </div>
  );
};

export default NavigationItem;
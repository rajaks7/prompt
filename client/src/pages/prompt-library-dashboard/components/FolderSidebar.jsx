import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FolderSidebar = ({ 
  folders = [], 
  selectedFolder = null, 
  onFolderSelect,
  recentActivity = [],
  quickFilters = []
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  const mockFolders = [
    {
      id: 'root',
      name: 'All Prompts',
      count: 1247,
      children: [
        { id: 'chatgpt', name: 'ChatGPT', count: 456, icon: 'MessageSquare' },
        { id: 'claude', name: 'Claude', count: 234, icon: 'Brain' },
        { id: 'midjourney', name: 'Midjourney', count: 189, icon: 'Image' },
        { id: 'copilot', name: 'GitHub Copilot', count: 156, icon: 'Code' },
        { id: 'gemini', name: 'Gemini', count: 212, icon: 'Sparkles' }
      ]
    },
    {
      id: 'categories',
      name: 'Categories',
      count: 1247,
      children: [
        { id: 'content', name: 'Content Creation', count: 345, icon: 'FileText' },
        { id: 'code', name: 'Code Generation', count: 289, icon: 'Code2' },
        { id: 'analysis', name: 'Data Analysis', count: 178, icon: 'BarChart3' },
        { id: 'creative', name: 'Creative Writing', count: 234, icon: 'Feather' },
        { id: 'research', name: 'Research', count: 201, icon: 'Search' }
      ]
    },
    {
      id: 'performance',
      name: 'Performance',
      count: 1247,
      children: [
        { id: 'excellent', name: 'Excellent (4.5+)', count: 234, icon: 'Star' },
        { id: 'good', name: 'Good (3.5-4.4)', count: 456, icon: 'ThumbsUp' },
        { id: 'average', name: 'Average (2.5-3.4)', count: 345, icon: 'Minus' },
        { id: 'needs-work', name: 'Needs Work (<2.5)', count: 212, icon: 'AlertTriangle' }
      ]
    }
  ];

  const mockRecentActivity = [
    {
      id: 1,
      type: 'created',
      title: 'Blog Post Generator',
      user: 'Sarah Chen',
      timestamp: '2 minutes ago',
      icon: 'Plus'
    },
    {
      id: 2,
      type: 'modified',
      title: 'Code Review Assistant',
      user: 'Mike Johnson',
      timestamp: '15 minutes ago',
      icon: 'Edit'
    },
    {
      id: 3,
      type: 'shared',
      title: 'Marketing Copy Template',
      user: 'Lisa Wang',
      timestamp: '1 hour ago',
      icon: 'Share'
    },
    {
      id: 4,
      type: 'rated',
      title: 'Data Visualization Prompt',
      user: 'Alex Rodriguez',
      timestamp: '2 hours ago',
      icon: 'Star'
    }
  ];

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded?.has(folderId)) {
      newExpanded?.delete(folderId);
    } else {
      newExpanded?.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderClick = (folder) => {
    if (onFolderSelect) {
      onFolderSelect(folder);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'created': return 'Plus';
      case 'modified': return 'Edit';
      case 'shared': return 'Share';
      case 'rated': return 'Star';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'created': return 'text-success';
      case 'modified': return 'text-accent';
      case 'shared': return 'text-primary';
      case 'rated': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="w-full h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Library</h2>
        <div className="text-sm text-muted-foreground">
          1,247 total prompts
        </div>
      </div>
      {/* Folder Structure */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
            Organization
          </h3>
          
          {mockFolders?.map((folder) => (
            <div key={folder?.id} className="mb-2">
              <button
                onClick={() => toggleFolder(folder?.id)}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm
                          hover:bg-muted transition-colors duration-150
                          ${selectedFolder?.id === folder?.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={expandedFolders?.has(folder?.id) ? 'ChevronDown' : 'ChevronRight'} 
                    size={14} 
                  />
                  <span className="font-medium">{folder?.name}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {folder?.count}
                </span>
              </button>

              {expandedFolders?.has(folder?.id) && folder?.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {folder?.children?.map((child) => (
                    <button
                      key={child?.id}
                      onClick={() => handleFolderClick(child)}
                      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm
                                hover:bg-muted transition-colors duration-150
                                ${selectedFolder?.id === child?.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name={child?.icon} size={14} />
                        <span>{child?.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {child?.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="p-2 border-t border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
            Recent Activity
          </h3>
          
          <div className="space-y-2">
            {mockRecentActivity?.map((activity) => (
              <div key={activity?.id} className="px-2 py-2 rounded-lg hover:bg-muted transition-colors duration-150">
                <div className="flex items-start space-x-2">
                  <div className={`p-1 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
                    <Icon name={getActivityIcon(activity?.type)} size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {activity?.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity?.user} • {activity?.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderSidebar;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PromptTable = ({ 
  prompts = [],
  selectedPrompts = [],
  onSelectPrompt,
  onSelectAll,
  onSort,
  sortConfig = { key: null, direction: 'asc' },
  onEdit,
  onDelete,
  onCopy,
  onShare
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const mockPrompts = [
    {
      id: 1,
      title: "Blog Post Generator",
      tool: "ChatGPT",
      category: "Content Creation",
      rating: 4.8,
      usageCount: 156,
      lastModified: "2025-08-27T14:30:00Z",
      creator: "Sarah Chen",
      status: "active",
      isShared: true,
      tags: ["SEO", "Marketing", "Writing"],
      content: "Generate engaging blog posts with SEO optimization...",
      performance: { successRate: 92, avgResponseTime: "2.3s" }
    },
    {
      id: 2,
      title: "Code Review Assistant",
      tool: "GitHub Copilot",
      category: "Code Generation",
      rating: 4.6,
      usageCount: 89,
      lastModified: "2025-08-27T10:15:00Z",
      creator: "Mike Johnson",
      status: "active",
      isShared: false,
      tags: ["Code", "Review", "Quality"],
      content: "Analyze code for best practices and potential issues...",
      performance: { successRate: 88, avgResponseTime: "1.8s" }
    },
    {
      id: 3,
      title: "Data Visualization Prompt",
      tool: "Claude",
      category: "Data Analysis",
      rating: 4.9,
      usageCount: 234,
      lastModified: "2025-08-26T16:45:00Z",
      creator: "Alex Rodriguez",
      status: "active",
      isShared: true,
      tags: ["Data", "Charts", "Analysis"],
      content: "Create comprehensive data visualizations and insights...",
      performance: { successRate: 95, avgResponseTime: "3.1s" }
    },
    {
      id: 4,
      title: "Creative Writing Assistant",
      tool: "Claude",
      category: "Creative Writing",
      rating: 4.4,
      usageCount: 67,
      lastModified: "2025-08-26T09:20:00Z",
      creator: "Lisa Wang",
      status: "draft",
      isShared: false,
      tags: ["Creative", "Story", "Fiction"],
      content: "Help develop compelling narratives and characters...",
      performance: { successRate: 85, avgResponseTime: "2.7s" }
    },
    {
      id: 5,
      title: "Marketing Copy Generator",
      tool: "ChatGPT",
      category: "Content Creation",
      rating: 4.7,
      usageCount: 198,
      lastModified: "2025-08-25T13:10:00Z",
      creator: "David Kim",
      status: "active",
      isShared: true,
      tags: ["Marketing", "Copy", "Sales"],
      content: "Create persuasive marketing copy for various channels...",
      performance: { successRate: 91, avgResponseTime: "2.1s" }
    }
  ];

  const currentPrompts = prompts?.length > 0 ? prompts : mockPrompts;

  const getToolIcon = (tool) => {
    switch (tool?.toLowerCase()) {
      case 'chatgpt': return 'MessageSquare';
      case 'claude': return 'Brain';
      case 'midjourney': return 'Image';
      case 'github copilot': return 'Code';
      case 'gemini': return 'Sparkles';
      default: return 'Bot';
    }
  };

  const getToolColor = (tool) => {
    switch (tool?.toLowerCase()) {
      case 'chatgpt': return 'text-green-600';
      case 'claude': return 'text-orange-600';
      case 'midjourney': return 'text-purple-600';
      case 'github copilot': return 'text-blue-600';
      case 'gemini': return 'text-indigo-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'draft': return 'bg-warning/10 text-warning';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date?.toLocaleDateString();
  };

  const handleSort = (key) => {
    if (onSort) {
      const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
      onSort({ key, direction });
    }
  };

  const toggleRowExpansion = (promptId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(promptId)) {
      newExpanded?.delete(promptId);
    } else {
      newExpanded?.add(promptId);
    }
    setExpandedRows(newExpanded);
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard?.writeText(content);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={12} className="text-warning fill-current" />
      );
    }

    return (
      <div className="flex items-center space-x-0.5">
        {stars}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider
                 cursor-pointer hover:bg-muted/50 transition-colors duration-150 ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig?.key === sortKey && (
          <Icon 
            name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            size={14} 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedPrompts?.length === currentPrompts?.length}
                  onChange={(e) => onSelectAll && onSelectAll(e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </th>
              <SortableHeader sortKey="title" className="min-w-[200px]">
                Title
              </SortableHeader>
              <SortableHeader sortKey="tool" className="min-w-[120px]">
                Tool
              </SortableHeader>
              <SortableHeader sortKey="category" className="min-w-[140px]">
                Category
              </SortableHeader>
              <SortableHeader sortKey="rating" className="min-w-[100px]">
                Rating
              </SortableHeader>
              <SortableHeader sortKey="usageCount" className="min-w-[80px]">
                Usage
              </SortableHeader>
              <SortableHeader sortKey="lastModified" className="min-w-[120px]">
                Modified
              </SortableHeader>
              <SortableHeader sortKey="creator" className="min-w-[120px]">
                Creator
              </SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentPrompts?.map((prompt) => (
              <React.Fragment key={prompt?.id}>
                <tr className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPrompts?.includes(prompt?.id)}
                      onChange={(e) => onSelectPrompt && onSelectPrompt(prompt?.id, e?.target?.checked)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRowExpansion(prompt?.id)}
                        className="p-1 hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon 
                          name={expandedRows?.has(prompt?.id) ? 'ChevronDown' : 'ChevronRight'} 
                          size={14} 
                          className="text-muted-foreground"
                        />
                      </button>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          {prompt?.title}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {prompt?.tags?.slice(0, 2)?.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {prompt?.isShared && (
                            <Icon name="Users" size={10} className="text-accent" />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getToolIcon(prompt?.tool)} 
                        size={16} 
                        className={getToolColor(prompt?.tool)}
                      />
                      <span className="text-sm text-foreground">{prompt?.tool}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{prompt?.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    {renderStars(prompt?.rating)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="BarChart3" size={12} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{prompt?.usageCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(prompt?.lastModified)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{prompt?.creator}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(prompt?.status)}`}>
                      {prompt?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Copy"
                        onClick={() => handleCopy(prompt?.content)}
                        className="p-1 h-6 w-6"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onEdit && onEdit(prompt?.id)}
                        className="p-1 h-6 w-6"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Share"
                        onClick={() => onShare && onShare(prompt?.id)}
                        className="p-1 h-6 w-6"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreVertical"
                        className="p-1 h-6 w-6"
                      />
                    </div>
                  </td>
                </tr>

                {/* Expanded Row Content */}
                {expandedRows?.has(prompt?.id) && (
                  <tr>
                    <td colSpan="10" className="px-4 py-3 bg-muted/20">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Prompt Content</h4>
                          <div className="p-3 bg-card border border-border rounded-md">
                            <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap line-clamp-6">
                              {prompt?.content}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Performance Metrics</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-card border border-border rounded-md">
                              <div className="text-xs text-muted-foreground">Success Rate</div>
                              <div className="text-lg font-semibold text-success">
                                {prompt?.performance?.successRate}%
                              </div>
                            </div>
                            <div className="p-3 bg-card border border-border rounded-md">
                              <div className="text-xs text-muted-foreground">Avg Response Time</div>
                              <div className="text-lg font-semibold text-foreground">
                                {prompt?.performance?.avgResponseTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromptTable;
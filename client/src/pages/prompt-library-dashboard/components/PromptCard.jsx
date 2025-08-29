import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PromptCard = ({ 
  prompt,
  onEdit,
  onDelete,
  onCopy,
  onRate,
  onShare,
  isSelected = false,
  onSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const mockPrompt = {
    id: 1,
    title: "Blog Post Generator",
    description: "Generate engaging blog posts with SEO optimization and compelling headlines",
    tool: "ChatGPT",
    category: "Content Creation",
    tags: ["SEO", "Marketing", "Writing"],
    rating: 4.8,
    usageCount: 156,
    lastModified: "2025-08-27T14:30:00Z",
    creator: "Sarah Chen",
    isShared: true,
    isFavorite: false,
    content: `Create a comprehensive blog post about [TOPIC] that includes:\n\n1. An attention-grabbing headline\n2. SEO-optimized introduction with target keywords\n3. Well-structured body with subheadings\n4. Actionable insights and examples\n5. Compelling conclusion with call-to-action\n\nTarget audience: [AUDIENCE]\nTone: [TONE]\nWord count: [WORD_COUNT]`,
    output: "Generated a 1,200-word blog post about 'AI in Healthcare' with 5 optimized subheadings, 3 case studies, and strong SEO performance metrics.",
    performance: {
      successRate: 92,
      avgRating: 4.8,
      totalUses: 156
    }
  };

  const currentPrompt = prompt || mockPrompt;

  const getToolIcon = (tool) => {
    switch (tool?.toLowerCase()) {
      case 'chatgpt': return 'MessageSquare';
      case 'claude': return 'Brain';
      case 'midjourney': return 'Image';
      case 'copilot': return 'Code';
      case 'gemini': return 'Sparkles';
      default: return 'Bot';
    }
  };

  const getToolColor = (tool) => {
    switch (tool?.toLowerCase()) {
      case 'chatgpt': return 'text-green-600';
      case 'claude': return 'text-orange-600';
      case 'midjourney': return 'text-purple-600';
      case 'copilot': return 'text-blue-600';
      case 'gemini': return 'text-indigo-600';
      default: return 'text-muted-foreground';
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(currentPrompt?.content);
      if (onCopy) onCopy(currentPrompt?.id);
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

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={12} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200
                 ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
                 ${showActions ? 'shadow-lg' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect && onSelect(currentPrompt?.id, e?.target?.checked)}
            className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />

          {/* Tool Icon */}
          <div className={`p-2 rounded-lg bg-muted ${getToolColor(currentPrompt?.tool)}`}>
            <Icon name={getToolIcon(currentPrompt?.tool)} size={16} />
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
              {currentPrompt?.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {currentPrompt?.description}
            </p>
            
            {/* Meta Info */}
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="User" size={10} />
                <span>{currentPrompt?.creator}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={10} />
                <span>{formatDate(currentPrompt?.lastModified)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="BarChart3" size={10} />
                <span>{currentPrompt?.usageCount} uses</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`flex items-center space-x-1 transition-opacity duration-200
                        ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            onClick={handleCopy}
            className="p-1 h-6 w-6"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            onClick={() => onShare && onShare(currentPrompt?.id)}
            className="p-1 h-6 w-6"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            className="p-1 h-6 w-6"
          />
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
          {currentPrompt?.tool}
        </span>
        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md">
          {currentPrompt?.category}
        </span>
        {currentPrompt?.tags?.slice(0, 2)?.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
            {tag}
          </span>
        ))}
        {currentPrompt?.tags?.length > 2 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
            +{currentPrompt?.tags?.length - 2}
          </span>
        )}
      </div>
      {/* Performance Metrics */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          {renderStars(currentPrompt?.rating)}
          <span className="text-xs text-muted-foreground ml-1">
            {currentPrompt?.rating}
          </span>
        </div>
        
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Icon name="TrendingUp" size={10} />
            <span>{currentPrompt?.performance?.successRate}%</span>
          </span>
          {currentPrompt?.isShared && (
            <Icon name="Users" size={10} className="text-accent" />
          )}
          {currentPrompt?.isFavorite && (
            <Icon name="Heart" size={10} className="text-error fill-current" />
          )}
        </div>
      </div>
      {/* Expandable Content Preview */}
      <div className="border-t border-border pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-medium text-foreground">
            Prompt Preview
          </span>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={14} 
            className="text-muted-foreground"
          />
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-2">
            <div className="p-2 bg-muted rounded-md">
              <div className="text-xs font-medium text-foreground mb-1">Content:</div>
              <div className="text-xs text-muted-foreground font-mono whitespace-pre-wrap line-clamp-4">
                {currentPrompt?.content}
              </div>
            </div>
            
            {currentPrompt?.output && (
              <div className="p-2 bg-success/10 rounded-md">
                <div className="text-xs font-medium text-foreground mb-1">Last Output:</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {currentPrompt?.output}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
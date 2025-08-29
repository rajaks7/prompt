import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onResetFilters, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    tools: true,
    contentTypes: true,
    dateRange: true,
    performance: false,
    creators: false,
    tags: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleFilterChange = (category, value, checked) => {
    const currentValues = filters?.[category] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    onFiltersChange({
      ...filters,
      [category]: newValues
    });
  };

  const handleRangeChange = (category, field, value) => {
    onFiltersChange({
      ...filters,
      [category]: {
        ...filters?.[category],
        [field]: value
      }
    });
  };

  // Mock data for filters
  const toolTypes = [
    { id: 'chatgpt', name: 'ChatGPT', count: 1247 },
    { id: 'claude', name: 'Claude', count: 892 },
    { id: 'midjourney', name: 'Midjourney', count: 634 },
    { id: 'gpt4', name: 'GPT-4', count: 567 },
    { id: 'dalle', name: 'DALL-E', count: 423 },
    { id: 'stable-diffusion', name: 'Stable Diffusion', count: 312 }
  ];

  const contentTypes = [
    { id: 'text', name: 'Text Content', count: 2156 },
    { id: 'image', name: 'Image Generation', count: 1834 },
    { id: 'code', name: 'Code Generation', count: 987 },
    { id: 'video', name: 'Video Scripts', count: 456 },
    { id: 'audio', name: 'Audio Content', count: 234 },
    { id: 'app', name: 'App Ideas', count: 189 }
  ];

  const creators = [
    { id: 'john-doe', name: 'John Doe', count: 234 },
    { id: 'jane-smith', name: 'Jane Smith', count: 189 },
    { id: 'mike-johnson', name: 'Mike Johnson', count: 156 },
    { id: 'sarah-wilson', name: 'Sarah Wilson', count: 134 },
    { id: 'alex-brown', name: 'Alex Brown', count: 98 }
  ];

  const popularTags = [
    { id: 'marketing', name: 'Marketing', count: 567 },
    { id: 'creative', name: 'Creative', count: 445 },
    { id: 'technical', name: 'Technical', count: 389 },
    { id: 'business', name: 'Business', count: 334 },
    { id: 'education', name: 'Education', count: 278 },
    { id: 'research', name: 'Research', count: 234 }
  ];

  const FilterSection = ({ title, isExpanded, onToggle, children, count }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors duration-150"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground">{title}</span>
          {count && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground"
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border h-full flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          iconName="SlidersHorizontal"
          onClick={onToggleCollapse}
          className="w-8 h-8 p-0 mb-4"
          title="Expand Filters"
        />
        <div className="flex flex-col space-y-2">
          {Object.keys(filters)?.map(key => {
            const hasActiveFilters = Array.isArray(filters?.[key]) 
              ? filters?.[key]?.length > 0 
              : Object.keys(filters?.[key] || {})?.length > 0;
            
            if (hasActiveFilters) {
              return (
                <div 
                  key={key}
                  className="w-2 h-2 bg-primary rounded-full"
                  title={`Active ${key} filters`}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  const activeFilterCount = Object.values(filters)?.reduce((count, filterValue) => {
    if (Array.isArray(filterValue)) {
      return count + filterValue?.length;
    }
    if (typeof filterValue === 'object' && filterValue !== null) {
      return count + Object.keys(filterValue)?.length;
    }
    return count;
  }, 0);

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="SlidersHorizontal" size={20} className="text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            disabled={activeFilterCount === 0}
            className="text-xs"
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronLeft"
            onClick={onToggleCollapse}
            className="w-8 h-8 p-0"
            title="Collapse Filters"
          />
        </div>
      </div>
      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tool Types */}
        <FilterSection
          title="AI Tools"
          isExpanded={expandedSections?.tools}
          onToggle={() => toggleSection('tools')}
          count={filters?.tools?.length || 0}
        >
          <div className="space-y-2">
            {toolTypes?.map(tool => (
              <div key={tool?.id} className="flex items-center justify-between">
                <Checkbox
                  label={tool?.name}
                  checked={filters?.tools?.includes(tool?.id) || false}
                  onChange={(e) => handleFilterChange('tools', tool?.id, e?.target?.checked)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground ml-2">
                  {tool?.count}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Content Types */}
        <FilterSection
          title="Content Types"
          isExpanded={expandedSections?.contentTypes}
          onToggle={() => toggleSection('contentTypes')}
          count={filters?.contentTypes?.length || 0}
        >
          <div className="space-y-2">
            {contentTypes?.map(type => (
              <div key={type?.id} className="flex items-center justify-between">
                <Checkbox
                  label={type?.name}
                  checked={filters?.contentTypes?.includes(type?.id) || false}
                  onChange={(e) => handleFilterChange('contentTypes', type?.id, e?.target?.checked)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground ml-2">
                  {type?.count}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Date Range */}
        <FilterSection
          title="Date Range"
          isExpanded={expandedSections?.dateRange}
          onToggle={() => toggleSection('dateRange')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={filters?.dateRange?.from || ''}
                  onChange={(e) => handleRangeChange('dateRange', 'from', e?.target?.value)}
                  className="w-full px-2 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={filters?.dateRange?.to || ''}
                  onChange={(e) => handleRangeChange('dateRange', 'to', e?.target?.value)}
                  className="w-full px-2 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {['Today', 'This Week', 'This Month', 'Last 3 Months']?.map(preset => (
                <Button
                  key={preset}
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    const today = new Date();
                    let from = new Date();
                    
                    switch(preset) {
                      case 'Today':
                        from = today;
                        break;
                      case 'This Week':
                        from.setDate(today?.getDate() - 7);
                        break;
                      case 'This Month':
                        from.setMonth(today?.getMonth() - 1);
                        break;
                      case 'Last 3 Months':
                        from.setMonth(today?.getMonth() - 3);
                        break;
                    }
                    
                    onFiltersChange({
                      ...filters,
                      dateRange: {
                        from: from.toISOString()?.split('T')?.[0],
                        to: today?.toISOString()?.split('T')?.[0]
                      }
                    });
                  }}
                  className="text-xs"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Performance Rating */}
        <FilterSection
          title="Performance Rating"
          isExpanded={expandedSections?.performance}
          onToggle={() => toggleSection('performance')}
          count={0}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Minimum Rating: {filters?.performanceRating?.min || 0}/5
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters?.performanceRating?.min || 0}
                onChange={(e) => handleRangeChange('performanceRating', 'min', parseFloat(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                label="Only rated prompts"
                checked={filters?.onlyRated || false}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  onlyRated: e?.target?.checked
                })}
              />
            </div>
          </div>
        </FilterSection>

        {/* Creators */}
        <FilterSection
          title="Creators"
          isExpanded={expandedSections?.creators}
          onToggle={() => toggleSection('creators')}
          count={filters?.creators?.length || 0}
        >
          <div className="space-y-2">
            {creators?.map(creator => (
              <div key={creator?.id} className="flex items-center justify-between">
                <Checkbox
                  label={creator?.name}
                  checked={filters?.creators?.includes(creator?.id) || false}
                  onChange={(e) => handleFilterChange('creators', creator?.id, e?.target?.checked)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground ml-2">
                  {creator?.count}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Tags */}
        <FilterSection
          title="Tags"
          isExpanded={expandedSections?.tags}
          onToggle={() => toggleSection('tags')}
          count={filters?.tags?.length || 0}
        >
          <div className="space-y-2">
            {popularTags?.map(tag => (
              <div key={tag?.id} className="flex items-center justify-between">
                <Checkbox
                  label={tag?.name}
                  checked={filters?.tags?.includes(tag?.id) || false}
                  onChange={(e) => handleFilterChange('tags', tag?.id, e?.target?.checked)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground ml-2">
                  {tag?.count}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterPanel;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterBar = ({ 
  onFilterChange,
  onSearch,
  onViewToggle,
  currentView = 'grid',
  selectedFilters = {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const toolOptions = [
    { value: 'all', label: 'All Tools' },
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'claude', label: 'Claude' },
    { value: 'midjourney', label: 'Midjourney' },
    { value: 'copilot', label: 'GitHub Copilot' },
    { value: 'gemini', label: 'Gemini' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'content', label: 'Content Creation' },
    { value: 'code', label: 'Code Generation' },
    { value: 'analysis', label: 'Data Analysis' },
    { value: 'creative', label: 'Creative Writing' },
    { value: 'research', label: 'Research' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: 'excellent', label: 'Excellent (4.5+)' },
    { value: 'good', label: 'Good (3.5-4.4)' },
    { value: 'average', label: 'Average (2.5-3.4)' },
    { value: 'needs-work', label: 'Needs Work (<2.5)' }
  ];

  const savedFilters = [
    { value: 'recent', label: 'Recently Modified' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'my-prompts', label: 'My Prompts' },
    { value: 'shared', label: 'Shared with Me' },
    { value: 'high-performance', label: 'High Performance' }
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (onFilterChange) {
      onFilterChange({ ...selectedFilters, [filterType]: value });
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const activeFilterCount = Object.keys(selectedFilters)?.filter(
    key => selectedFilters?.[key] && selectedFilters?.[key] !== 'all'
  )?.length;

  return (
    <div className="bg-card border-b border-border">
      {/* Main Filter Bar */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Search and Filters */}
          <div className="flex items-center gap-3 flex-1">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search prompts, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-10"
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </form>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <Select
                options={savedFilters}
                value={selectedFilters?.saved || 'recent'}
                onChange={(value) => handleFilterChange('saved', value)}
                placeholder="Quick Filter"
                className="w-40"
              />

              <Select
                options={toolOptions}
                value={selectedFilters?.tool || 'all'}
                onChange={(value) => handleFilterChange('tool', value)}
                placeholder="Tool"
                className="w-32"
              />

              <Select
                options={categoryOptions}
                value={selectedFilters?.category || 'all'}
                onChange={(value) => handleFilterChange('category', value)}
                placeholder="Category"
                className="w-36"
              />

              <Button
                variant="outline"
                size="sm"
                iconName="Filter"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className={activeFilterCount > 0 ? 'border-primary text-primary' : ''}
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </div>
          </div>

          {/* Right Side - View Toggle and Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => {}}
            >
              Export
            </Button>

            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={currentView === 'grid' ? 'default' : 'ghost'}
                size="sm"
                iconName="Grid3X3"
                onClick={() => onViewToggle && onViewToggle('grid')}
                className="px-3"
              />
              <Button
                variant={currentView === 'table' ? 'default' : 'ghost'}
                size="sm"
                iconName="List"
                onClick={() => onViewToggle && onViewToggle('table')}
                className="px-3"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Performance Rating
              </label>
              <Select
                options={performanceOptions}
                value={selectedFilters?.performance || 'all'}
                onChange={(value) => handleFilterChange('performance', value)}
                placeholder="All Ratings"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range - From
              </label>
              <Input
                type="date"
                value={dateRange?.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e?.target?.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range - To
              </label>
              <Input
                type="date"
                value={dateRange?.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e?.target?.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                onClick={clearAllFilters}
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {Object.entries(selectedFilters)?.map(([key, value]) => {
                if (!value || value === 'all') return null;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    <span>{key}: {value}</span>
                    <button
                      onClick={() => handleFilterChange(key, 'all')}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
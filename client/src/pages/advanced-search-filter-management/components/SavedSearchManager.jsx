import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SavedSearchManager = ({ 
  isOpen, 
  onClose, 
  savedSearches = [], 
  onSaveSearch, 
  onDeleteSearch, 
  onLoadSearch,
  currentQuery = '',
  currentFilters = {} 
}) => {
  const [searchName, setSearchName] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveCurrentSearch = () => {
    if (!searchName?.trim()) return;

    const newSearch = {
      id: Date.now()?.toString(),
      name: searchName,
      description: searchDescription,
      query: currentQuery,
      filters: currentFilters,
      resultCount: Math.floor(Math.random() * 500) + 50, // Mock result count
      createdAt: new Date()?.toLocaleDateString(),
      lastUsed: new Date()?.toLocaleDateString()
    };

    onSaveSearch(newSearch);
    setSearchName('');
    setSearchDescription('');
    setIsCreating(false);
  };

  const handleLoadSearch = (savedSearch) => {
    onLoadSearch(savedSearch);
    onClose();
  };

  const getFilterSummary = (filters) => {
    const activeFilters = [];
    
    if (filters?.tools?.length > 0) {
      activeFilters?.push(`${filters?.tools?.length} tools`);
    }
    if (filters?.contentTypes?.length > 0) {
      activeFilters?.push(`${filters?.contentTypes?.length} content types`);
    }
    if (filters?.dateRange?.from || filters?.dateRange?.to) {
      activeFilters?.push('date range');
    }
    if (filters?.creators?.length > 0) {
      activeFilters?.push(`${filters?.creators?.length} creators`);
    }
    if (filters?.tags?.length > 0) {
      activeFilters?.push(`${filters?.tags?.length} tags`);
    }

    return activeFilters?.length > 0 ? activeFilters?.join(', ') : 'No filters';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-modal border border-border w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Bookmark" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Saved Searches</h2>
              <p className="text-sm text-muted-foreground">
                Manage your saved search queries and filters
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="w-8 h-8 p-0"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Save Current Search */}
          {(currentQuery || Object.keys(currentFilters)?.length > 0) && (
            <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground mb-1">Current Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Save your current search query and filters for future use
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={() => setIsCreating(!isCreating)}
                >
                  {isCreating ? 'Cancel' : 'Save Search'}
                </Button>
              </div>

              {/* Current Search Details */}
              <div className="space-y-2 text-sm">
                {currentQuery && (
                  <div>
                    <span className="font-medium text-foreground">Query: </span>
                    <span className="text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {currentQuery}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-foreground">Filters: </span>
                  <span className="text-muted-foreground">
                    {getFilterSummary(currentFilters)}
                  </span>
                </div>
              </div>

              {/* Save Form */}
              {isCreating && (
                <div className="mt-4 space-y-3">
                  <Input
                    label="Search Name"
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e?.target?.value)}
                    placeholder="Enter a name for this search"
                    required
                  />
                  <Input
                    label="Description (Optional)"
                    type="text"
                    value={searchDescription}
                    onChange={(e) => setSearchDescription(e?.target?.value)}
                    placeholder="Describe what this search is for"
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveCurrentSearch}
                      disabled={!searchName?.trim()}
                    >
                      Save Search
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsCreating(false);
                        setSearchName('');
                        setSearchDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Searches List */}
          <div>
            <h3 className="font-medium text-foreground mb-4">
              Your Saved Searches ({savedSearches?.length})
            </h3>

            {savedSearches?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Bookmark" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium text-foreground mb-2">No saved searches yet</h4>
                <p className="text-sm text-muted-foreground">
                  Save your frequently used searches to access them quickly later
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedSearches?.map((savedSearch) => (
                  <div
                    key={savedSearch?.id}
                    className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-foreground">{savedSearch?.name}</h4>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {savedSearch?.resultCount} results
                          </span>
                        </div>
                        
                        {savedSearch?.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {savedSearch?.description}
                          </p>
                        )}

                        <div className="space-y-1 text-xs text-muted-foreground">
                          {savedSearch?.query && (
                            <div>
                              <span className="font-medium">Query: </span>
                              <span className="font-mono bg-muted px-1 py-0.5 rounded">
                                {savedSearch?.query}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Filters: </span>
                            <span>{getFilterSummary(savedSearch?.filters)}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>Created: {savedSearch?.createdAt}</span>
                            <span>Last used: {savedSearch?.lastUsed}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Play"
                          onClick={() => handleLoadSearch(savedSearch)}
                          className="w-8 h-8 p-0"
                          title="Load search"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Copy"
                          onClick={() => {
                            navigator.clipboard?.writeText(JSON.stringify({
                              query: savedSearch?.query,
                              filters: savedSearch?.filters
                            }, null, 2));
                          }}
                          className="w-8 h-8 p-0"
                          title="Copy search configuration"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={() => onDeleteSearch(savedSearch?.id)}
                          className="w-8 h-8 p-0 text-error hover:text-error hover:bg-error/10"
                          title="Delete search"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            {savedSearches?.length} saved search{savedSearches?.length !== 1 ? 'es' : ''}
          </div>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedSearchManager;
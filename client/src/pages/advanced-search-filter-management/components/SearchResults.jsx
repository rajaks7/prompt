import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';

const SearchResults = ({ 
  results = [], 
  totalResults = 0, 
  searchQuery = '', 
  isLoading = false,
  onSortChange,
  onPromptSelect,
  onCopyPrompt,
  onExportResults 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedPrompts, setSelectedPrompts] = useState([]);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'usage_desc', label: 'Most Used' },
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'title_asc', label: 'Title A-Z' }
  ];

  const handleSelectPrompt = (promptId) => {
    setSelectedPrompts(prev => 
      prev?.includes(promptId) 
        ? prev?.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPrompts?.length === results?.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(results?.map(prompt => prompt?.id));
    }
  };

  const highlightSearchTerms = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text?.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
  };

  const getToolIcon = (tool) => {
    const toolIcons = {
      'ChatGPT': 'MessageSquare',
      'Claude': 'Bot',
      'Midjourney': 'Image',
      'GPT-4': 'Zap',
      'DALL-E': 'Palette',
      'Stable Diffusion': 'Sparkles'
    };
    return toolIcons?.[tool] || 'Tool';
  };

  const getContentTypeColor = (type) => {
    const colors = {
      'text': 'bg-blue-100 text-blue-800',
      'image': 'bg-purple-100 text-purple-800',
      'code': 'bg-green-100 text-green-800',
      'video': 'bg-red-100 text-red-800',
      'audio': 'bg-yellow-100 text-yellow-800',
      'app': 'bg-indigo-100 text-indigo-800'
    };
    return colors?.[type] || 'bg-gray-100 text-gray-800';
  };

  const PromptCard = ({ prompt }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedPrompts?.includes(prompt?.id)}
            onChange={() => handleSelectPrompt(prompt?.id)}
            className="rounded border-border text-primary focus:ring-ring"
          />
          <Icon 
            name={getToolIcon(prompt?.tool)} 
            size={16} 
            className="text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground">{prompt?.tool}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            onClick={() => onCopyPrompt(prompt)}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
            title="Copy prompt"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            onClick={() => onPromptSelect(prompt)}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
            title="View details"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <h3 
          className="font-medium text-foreground mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ 
            __html: highlightSearchTerms(prompt?.title, searchQuery) 
          }}
        />
        <p 
          className="text-sm text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ 
            __html: highlightSearchTerms(prompt?.content, searchQuery) 
          }}
        />
      </div>

      {/* Thumbnail */}
      {prompt?.thumbnail && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <Image
            src={prompt?.thumbnail}
            alt={prompt?.title}
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      {/* Tags */}
      {prompt?.tags && prompt?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt?.tags?.slice(0, 3)?.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
          {prompt?.tags?.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
              +{prompt?.tags?.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-full ${getContentTypeColor(prompt?.contentType)}`}>
            {prompt?.contentType}
          </span>
          {prompt?.rating && (
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-yellow-500 fill-current" />
              <span>{prompt?.rating}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>{prompt?.usageCount} uses</span>
          <span>•</span>
          <span>{prompt?.createdAt}</span>
        </div>
      </div>
    </div>
  );

  const PromptListItem = ({ prompt }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-all duration-200 group">
      <div className="flex items-center space-x-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selectedPrompts?.includes(prompt?.id)}
          onChange={() => handleSelectPrompt(prompt?.id)}
          className="rounded border-border text-primary focus:ring-ring"
        />

        {/* Thumbnail */}
        {prompt?.thumbnail && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={prompt?.thumbnail}
              alt={prompt?.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 
              className="font-medium text-foreground line-clamp-1"
              dangerouslySetInnerHTML={{ 
                __html: highlightSearchTerms(prompt?.title, searchQuery) 
              }}
            />
            <div className="flex items-center space-x-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                iconName="Copy"
                onClick={() => onCopyPrompt(prompt)}
                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                title="Copy prompt"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                onClick={() => onPromptSelect(prompt)}
                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                title="View details"
              />
            </div>
          </div>
          
          <p 
            className="text-sm text-muted-foreground line-clamp-2 mb-2"
            dangerouslySetInnerHTML={{ 
              __html: highlightSearchTerms(prompt?.content, searchQuery) 
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getToolIcon(prompt?.tool)} 
                  size={14} 
                  className="text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">{prompt?.tool}</span>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getContentTypeColor(prompt?.contentType)}`}>
                {prompt?.contentType}
              </span>
              {prompt?.rating && (
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-yellow-500 fill-current" />
                  <span className="text-xs text-muted-foreground">{prompt?.rating}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{prompt?.usageCount} uses</span>
              <span>•</span>
              <span>{prompt?.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="text-muted-foreground animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Searching prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Results Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="font-semibold text-foreground">
              {totalResults?.toLocaleString()} Results
            </h2>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                for "{searchQuery}"
              </p>
            )}
          </div>
          
          {selectedPrompts?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedPrompts?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                onClick={() => {
                  const selectedResults = results?.filter(r => selectedPrompts?.includes(r?.id));
                  selectedResults?.forEach(prompt => onCopyPrompt(prompt));
                }}
              >
                Copy Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => onExportResults(results?.filter(r => selectedPrompts?.includes(r?.id)))}
              >
                Export Selected
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Select All */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-sm"
          >
            {selectedPrompts?.length === results?.length ? 'Deselect All' : 'Select All'}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              iconName="Grid3X3"
              onClick={() => setViewMode('grid')}
              className="w-8 h-8 p-0"
              title="Grid view"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              iconName="List"
              onClick={() => setViewMode('list')}
              className="w-8 h-8 p-0"
              title="List view"
            />
          </div>

          {/* Sort */}
          <Select
            options={sortOptions}
            value="relevance"
            onChange={onSortChange}
            placeholder="Sort by"
            className="w-40"
          />

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => onExportResults(results)}
          >
            Export All
          </Button>
        </div>
      </div>
      {/* Results Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {results?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Clear Filters
              </Button>
              <Button variant="outline" size="sm">
                Browse All Prompts
              </Button>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' :'space-y-3'
          }>
            {results?.map(prompt => 
              viewMode === 'grid' 
                ? <PromptCard key={prompt?.id} prompt={prompt} />
                : <PromptListItem key={prompt?.id} prompt={prompt} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  searchHistory = [],
  savedSearches = [],
  onSelectSavedSearch,
  onClearHistory 
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSavedSearchOpen, setIsSavedSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const historyRef = useRef(null);

  // Mock auto-complete suggestions
  const mockSuggestions = [
    "ChatGPT creative writing prompts",
    "Claude code generation",
    "Midjourney art styles",
    "GPT-4 data analysis",
    "content creation templates",
    "marketing copy prompts",
    "technical documentation",
    "image generation prompts"
  ];

  useEffect(() => {
    if (searchQuery?.length > 2) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef?.current && !historyRef?.current?.contains(event?.target)) {
        setIsHistoryOpen(false);
        setIsSavedSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.key === '/' && !e?.target?.matches('input, textarea')) {
        e?.preventDefault();
        searchInputRef?.current?.focus();
      }
      if (e?.key === 'Escape') {
        setIsHistoryOpen(false);
        setIsSavedSearchOpen(false);
        searchInputRef?.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e) => {
    onSearchChange(e?.target?.value);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearch(searchQuery);
      setIsHistoryOpen(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
  };

  const handleHistoryClick = (query) => {
    onSearchChange(query);
    onSearch(query);
    setIsHistoryOpen(false);
  };

  const handleSavedSearchClick = (savedSearch) => {
    onSelectSavedSearch(savedSearch);
    setIsSavedSearchOpen(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={historyRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search prompts, tools, content types... (Press / to focus)"
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full h-12 pl-12 pr-32 text-base bg-card border-2 border-border rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                       placeholder:text-muted-foreground transition-all duration-200"
            />
            
            {/* Search Actions */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconName="History"
                onClick={() => {
                  setIsHistoryOpen(!isHistoryOpen);
                  setIsSavedSearchOpen(false);
                }}
                className="h-8 w-8 p-0"
                title="Search History"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconName="Bookmark"
                onClick={() => {
                  setIsSavedSearchOpen(!isSavedSearchOpen);
                  setIsHistoryOpen(false);
                }}
                className="h-8 w-8 p-0"
                title="Saved Searches"
              />
              <Button
                type="submit"
                variant="default"
                size="sm"
                iconName="Search"
                className="h-8 px-3"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Auto-complete Suggestions */}
        {suggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-modal z-50">
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Suggestions
              </div>
              {suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center px-3 py-2 text-sm text-popover-foreground
                           hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="Search" size={14} className="mr-3 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search History Dropdown */}
        {isHistoryOpen && searchHistory?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-modal z-50">
            <div className="py-2">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recent Searches
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={onClearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              </div>
              {searchHistory?.slice(0, 8)?.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(query)}
                  className="w-full flex items-center px-3 py-2 text-sm text-popover-foreground
                           hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="Clock" size={14} className="mr-3 text-muted-foreground" />
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saved Searches Dropdown */}
        {isSavedSearchOpen && savedSearches?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-modal z-50">
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Saved Searches
              </div>
              {savedSearches?.map((savedSearch) => (
                <button
                  key={savedSearch?.id}
                  onClick={() => handleSavedSearchClick(savedSearch)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-popover-foreground
                           hover:bg-muted transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <Icon name="Bookmark" size={14} className="mr-3 text-muted-foreground" />
                    <div className="text-left">
                      <div className="font-medium">{savedSearch?.name}</div>
                      <div className="text-xs text-muted-foreground">{savedSearch?.query}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {savedSearch?.resultCount} results
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
      {/* Search Tips */}
      <div className="mt-3 flex items-center justify-center space-x-6 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">/</kbd>
          <span>Focus search</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd>
          <span>Clear focus</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">F</kbd>
          <span>Toggle filters</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
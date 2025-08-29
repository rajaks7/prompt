import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import Header from '../../components/ui/Header';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import AdvancedSearchBuilder from './components/AdvancedSearchBuilder';
import SearchResults from './components/SearchResults';
import SavedSearchManager from './components/SavedSearchManager';
import SearchAnalytics from './components/SearchAnalytics';

const AdvancedSearchFilterManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    tools: [],
    contentTypes: [],
    dateRange: {},
    creators: [],
    tags: [],
    performanceRating: {},
    onlyRated: false
  });
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isSavedSearchOpen, setIsSavedSearchOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    'ChatGPT creative writing prompts',
    'Claude code generation',
    'marketing copy templates',
    'image generation styles',
    'data analysis prompts'
  ]);
  const [savedSearches, setSavedSearches] = useState([
    {
      id: '1',
      name: 'High Performance Creative Prompts',
      description: 'Top-rated creative writing prompts with high usage',
      query: 'creative writing',
      filters: { tools: ['chatgpt'], contentTypes: ['text'], performanceRating: { min: 4 } },
      resultCount: 156,
      createdAt: '2025-08-15',
      lastUsed: '2025-08-28'
    },
    {
      id: '2',
      name: 'Recent Code Generation',
      description: 'Latest code generation prompts from this month',
      query: 'code generation',
      filters: { tools: ['chatgpt', 'claude'], contentTypes: ['code'], dateRange: { from: '2025-08-01' } },
      resultCount: 89,
      createdAt: '2025-08-20',
      lastUsed: '2025-08-27'
    }
  ]);

  // Mock current user
  const currentUser = {
    role: 'admin',
    name: 'Sarah Wilson'
  };

  // Mock search results
  const mockResults = [
    {
      id: '1',
      title: 'Creative Writing Prompt Generator',
      content: `Generate engaging creative writing prompts for fiction authors. Focus on character development, plot twists, and world-building elements that inspire unique storytelling approaches.`,
      tool: 'ChatGPT',
      contentType: 'text',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
      tags: ['creative', 'writing', 'fiction', 'storytelling'],
      rating: 4.8,
      usageCount: 234,
      createdAt: '2025-08-15',
      creator: 'John Doe'
    },
    {
      id: '2',
      title: 'Python Code Documentation Generator',
      content: `Create comprehensive documentation for Python functions and classes. Include parameter descriptions, return values, usage examples, and best practices for maintainable code.`,
      tool: 'Claude',
      contentType: 'code',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
      tags: ['python', 'documentation', 'code', 'technical'],
      rating: 4.6,
      usageCount: 189,
      createdAt: '2025-08-20',
      creator: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Marketing Copy for SaaS Products',
      content: `Develop compelling marketing copy for SaaS products. Focus on value propositions, feature benefits, and customer pain points to drive conversions and engagement.`,
      tool: 'GPT-4',
      contentType: 'text',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      tags: ['marketing', 'saas', 'copywriting', 'business'],
      rating: 4.9,
      usageCount: 156,
      createdAt: '2025-08-18',
      creator: 'Mike Johnson'
    },
    {
      id: '4',
      title: 'Abstract Art Style Prompts',
      content: `Create abstract art prompts for AI image generation. Experiment with color palettes, geometric shapes, and artistic movements to produce unique visual compositions.`,
      tool: 'Midjourney',
      contentType: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      tags: ['art', 'abstract', 'visual', 'creative'],
      rating: 4.7,
      usageCount: 298,
      createdAt: '2025-08-22',
      creator: 'Sarah Wilson'
    },
    {
      id: '5',
      title: 'Data Analysis Report Templates',
      content: `Generate structured templates for data analysis reports. Include executive summaries, methodology sections, key findings, and actionable recommendations for stakeholders.`,
      tool: 'ChatGPT',
      contentType: 'text',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      tags: ['data', 'analysis', 'reports', 'business'],
      rating: 4.5,
      usageCount: 167,
      createdAt: '2025-08-25',
      creator: 'Alex Brown'
    },
    {
      id: '6',
      title: 'Social Media Content Calendar',
      content: `Plan and organize social media content across multiple platforms. Create engaging posts, hashtag strategies, and content themes that align with brand messaging and audience interests.`,
      tool: 'Claude',
      contentType: 'text',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
      tags: ['social media', 'content', 'marketing', 'planning'],
      rating: 4.4,
      usageCount: 203,
      createdAt: '2025-08-26',
      creator: 'Emma Davis'
    }
  ];

  const [searchResults, setSearchResults] = useState(mockResults);
  const [totalResults, setTotalResults] = useState(mockResults?.length);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.key === 'F' && !e?.target?.matches('input, textarea')) {
        e?.preventDefault();
        setIsFilterPanelCollapsed(!isFilterPanelCollapsed);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFilterPanelCollapsed]);

  const handleSearch = (query) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Add to search history
    if (query && !searchHistory?.includes(query)) {
      setSearchHistory(prev => [query, ...prev?.slice(0, 9)]);
    }

    // Simulate search delay
    setTimeout(() => {
      // Filter results based on query and filters
      let filteredResults = mockResults;
      
      if (query) {
        filteredResults = filteredResults?.filter(result =>
          result?.title?.toLowerCase()?.includes(query?.toLowerCase()) ||
          result?.content?.toLowerCase()?.includes(query?.toLowerCase()) ||
          result?.tags?.some(tag => tag?.toLowerCase()?.includes(query?.toLowerCase()))
        );
      }

      // Apply filters
      if (filters?.tools?.length > 0) {
        filteredResults = filteredResults?.filter(result =>
          filters?.tools?.includes(result?.tool?.toLowerCase()?.replace(/[^a-z0-9]/g, ''))
        );
      }

      if (filters?.contentTypes?.length > 0) {
        filteredResults = filteredResults?.filter(result =>
          filters?.contentTypes?.includes(result?.contentType)
        );
      }

      if (filters?.performanceRating?.min) {
        filteredResults = filteredResults?.filter(result =>
          result?.rating >= filters?.performanceRating?.min
        );
      }

      setSearchResults(filteredResults);
      setTotalResults(filteredResults?.length);
      setIsLoading(false);
    }, 800);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Re-run search with new filters
    handleSearch(searchQuery);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      tools: [],
      contentTypes: [],
      dateRange: {},
      creators: [],
      tags: [],
      performanceRating: {},
      onlyRated: false
    };
    setFilters(resetFilters);
    handleSearch(searchQuery);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleSaveSearch = (savedSearch) => {
    setSavedSearches(prev => [savedSearch, ...prev]);
  };

  const handleDeleteSearch = (searchId) => {
    setSavedSearches(prev => prev?.filter(search => search?.id !== searchId));
  };

  const handleLoadSearch = (savedSearch) => {
    setSearchQuery(savedSearch?.query);
    setFilters(savedSearch?.filters);
    handleSearch(savedSearch?.query);
  };

  const handlePromptSelect = (prompt) => {
    // Navigate to prompt details or open modal
    console.log('Selected prompt:', prompt);
  };

  const handleCopyPrompt = (prompt) => {
    navigator.clipboard?.writeText(prompt?.content);
    // Show toast notification
    console.log('Copied prompt:', prompt?.title);
  };

  const handleExportResults = (results) => {
    const exportData = {
      query: searchQuery,
      filters: filters,
      results: results,
      exportedAt: new Date()?.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSortChange = (sortBy) => {
    let sortedResults = [...searchResults];
    
    switch (sortBy) {
      case 'date_desc':
        sortedResults?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date_asc':
        sortedResults?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'usage_desc':
        sortedResults?.sort((a, b) => b?.usageCount - a?.usageCount);
        break;
      case 'rating_desc':
        sortedResults?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'title_asc':
        sortedResults?.sort((a, b) => a?.title?.localeCompare(b?.title));
        break;
      default:
        // Keep relevance order
        break;
    }
    
    setSearchResults(sortedResults);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <SidebarNavigation
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          showSearch={false}
        />

        {/* Page Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Header */}
          <div className="bg-card border-b border-border p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Advanced Search & Filter Management
                  </h1>
                  <p className="text-muted-foreground">
                    Discover and organize your prompt collection with powerful search and filtering capabilities
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="BarChart3"
                    onClick={() => setIsAnalyticsOpen(true)}
                  >
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Settings"
                    onClick={() => setIsAdvancedSearchOpen(true)}
                  >
                    Advanced Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Bookmark"
                    onClick={() => setIsSavedSearchOpen(true)}
                  >
                    Saved Searches
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={handleSearch}
                searchHistory={searchHistory}
                savedSearches={savedSearches}
                onSelectSavedSearch={handleLoadSearch}
                onClearHistory={handleClearHistory}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex">
            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onResetFilters={handleResetFilters}
              isCollapsed={isFilterPanelCollapsed}
              onToggleCollapse={() => setIsFilterPanelCollapsed(!isFilterPanelCollapsed)}
            />

            {/* Search Results */}
            <SearchResults
              results={searchResults}
              totalResults={totalResults}
              searchQuery={searchQuery}
              isLoading={isLoading}
              onSortChange={handleSortChange}
              onPromptSelect={handlePromptSelect}
              onCopyPrompt={handleCopyPrompt}
              onExportResults={handleExportResults}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdvancedSearchBuilder
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApplyQuery={(query) => {
          setSearchQuery(query);
          handleSearch(query);
        }}
        currentQuery={searchQuery}
      />

      <SavedSearchManager
        isOpen={isSavedSearchOpen}
        onClose={() => setIsSavedSearchOpen(false)}
        savedSearches={savedSearches}
        onSaveSearch={handleSaveSearch}
        onDeleteSearch={handleDeleteSearch}
        onLoadSearch={handleLoadSearch}
        currentQuery={searchQuery}
        currentFilters={filters}
      />

      <SearchAnalytics
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
};

export default AdvancedSearchFilterManagement;
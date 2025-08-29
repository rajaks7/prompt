import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Star, Copy, Heart, Grid, List, Filter, Calendar, Zap, Download, ArrowUpDown, Eye, Trash2, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Helper function to get default category image
const getCategoryDefaultImage = (categoryName) => {
  const defaults = {
    'Content Creation': '/images/content-creation.jpg',
    'Code Generation': '/images/code-generation.jpg', 
    'Data Analysis': '/images/data-analysis.jpg',
    'Creative Writing': '/images/creative-writing.jpg',
    'Research': '/images/research.jpg',
    'Marketing': '/images/marketing.jpg',
    'Technical': '/images/technical.jpg',
    'Image': '/images/image-category.jpg',
    'Video': '/images/video-category.jpg',
    'Audio': '/images/audio-category.jpg'
  };
  return defaults[categoryName] || '/images/default-prompt.jpg';
};

// Elegant Filter Chip Component
const FilterChip = ({ label, value, isActive, onClick, color = "blue" }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? `bg-${color}-100 text-${color}-700 border-${color}-200 shadow-sm`
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
    } border hover:shadow-md`}
  >
    {label}
  </button>
);

// Beautiful Prompt Card Component
const PromptCard = ({ prompt, onSelect, onToggleFavorite, onCopy, selected, onToggleSelect }) => {
  const { 
    id, title, tool_name, tool_color, rating, tags, is_favorite, 
    attachment_filename, category_image_url, category_name, prompt_text, 
    usage_count, created_at 
  } = prompt;
  
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt_text);
    onCopy && onCopy();
  };
  
  const handleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(id, !is_favorite);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onToggleSelect(id);
  };

  // Determine image to show
  const displayImage = attachment_filename 
    ? `http://localhost:5000/uploads/${attachment_filename}`
    : category_image_url || getCategoryDefaultImage(category_name);
  
  // Create excerpt (2 lines max)
  const excerpt = prompt_text?.length > 120 ? prompt_text.substring(0, 120) + '...' : prompt_text;
  
  return (
    <div 
      onClick={() => onSelect(id)} 
      className={`group relative bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer overflow-hidden ${
        selected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleSelect}
          className="w-5 h-5 text-blue-600 border-white bg-white/80 backdrop-blur-sm rounded shadow-lg focus:ring-2 focus:ring-blue-500"
          onClick={handleSelect}
        />
      </div>

      {/* Image Section */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = getCategoryDefaultImage(category_name);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <Zap size={32} className="text-blue-500" />
          </div>
        )}
        
        {/* AI Tool Badge */}
        {tool_name && (
          <div 
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: tool_color || '#6B7280' }}
          >
            {tool_name}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
            is_favorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart size={16} className={is_favorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Excerpt - exactly 2 lines */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.5rem'
        }}>
          {excerpt}
        </p>

        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                } mr-1`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-2">({rating}/5)</span>
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{format(new Date(created_at), 'MMM d, yyyy')}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Copy size={12} className="mr-1" />
              {usage_count || 0}
            </span>
            {category_name && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {category_name}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <Copy size={14} />
            <span>Copy</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Share2 size={14} />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Library Component
const LibraryPage = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or table
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    tool: '',
    category: '',
    rating: '',
    favorites: false,
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState('created_at_desc');
  
  // Master data
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [toolsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/ai_tools'),
          axios.get('http://localhost:5000/api/categories')
        ]);
        setTools(toolsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to fetch master data:', err);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchQuery,
          tool: activeFilters.tool,
          category: activeFilters.category,
          rating: activeFilters.rating,
          favoritesOnly: activeFilters.favorites,
          sort: sortBy
        };
        
        const response = await axios.get('http://localhost:5000/api/prompts', { params });
        setPrompts(response.data);
        setFilteredPrompts(response.data);
      } catch (err) {
        console.error('Failed to fetch prompts:', err);
        setPrompts([]);
        setFilteredPrompts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [searchQuery, activeFilters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Toggle favorite
  const handleToggleFavorite = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/prompts/${id}/favorite`, { 
        is_favorite: newStatus 
      });
      
      setPrompts(prev => prev.map(p => 
        p.id === id ? { ...p, is_favorite: newStatus } : p
      ));
      setFilteredPrompts(prev => prev.map(p => 
        p.id === id ? { ...p, is_favorite: newStatus } : p
      ));
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  };

  // Handle selection
  const handleToggleSelect = (id) => {
    setSelectedPrompts(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPrompts.length === filteredPrompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(filteredPrompts.map(p => p.id));
    }
  };

  // Handle copy notification
  const handleCopyNotification = () => {
    // You can add a toast notification here
    console.log('Prompt copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your prompt library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prompt Library</h1>
              <p className="mt-1 text-gray-500">
                Discover, organize, and manage your AI prompts
                {filteredPrompts.length > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {filteredPrompts.length} prompts found
                  </span>
                )}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search prompts, tags, content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-96 pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Creative Filters */}
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <FilterChip
              label="All Prompts"
              value=""
              isActive={!activeFilters.tool && !activeFilters.category && !activeFilters.favorites}
              onClick={() => setActiveFilters({ tool: '', category: '', rating: '', favorites: false, dateRange: 'all' })}
            />
            
            <FilterChip
              label="⭐ Favorites"
              value="favorites"
              isActive={activeFilters.favorites}
              onClick={() => handleFilterChange('favorites', !activeFilters.favorites)}
              color="red"
            />

            {/* AI Tools */}
            {tools.slice(0, 4).map(tool => (
              <FilterChip
                key={tool.id}
                label={tool.name}
                value={tool.id}
                isActive={activeFilters.tool === tool.id.toString()}
                onClick={() => handleFilterChange('tool', activeFilters.tool === tool.id.toString() ? '' : tool.id.toString())}
                color="purple"
              />
            ))}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter size={16} className="mr-2" />
              More Filters
            </button>
          </div>

          {/* View Toggle & Actions */}
          <div className="flex items-center space-x-3">
            {/* Selection Actions */}
            {selectedPrompts.length > 0 && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedPrompts.length} selected
                </span>
                <button className="p-1 text-blue-600 hover:text-blue-800">
                  <Download size={14} />
                </button>
                <button className="p-1 text-blue-600 hover:text-blue-800">
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="usage_desc">Most Used</option>
              <option value="title_asc">A-Z</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || Object.values(activeFilters).some(v => v) 
                ? "Try adjusting your search or filters" 
                : "Start by creating your first prompt"
              }
            </p>
            <button 
              onClick={() => navigate('/create')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create First Prompt
            </button>
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedPrompts.length === filteredPrompts.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span>Select All ({filteredPrompts.length})</span>
              </button>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onSelect={(id) => navigate(`/library/${id}`)}
                    onToggleFavorite={handleToggleFavorite}
                    onCopy={handleCopyNotification}
                    selected={selectedPrompts.includes(prompt.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPrompts.length === filteredPrompts.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AI Tool
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPrompts.map(prompt => (
                      <tr 
                        key={prompt.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/library/${id}`)}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPrompts.includes(prompt.id)}
                            onChange={() => handleToggleSelect(prompt.id)}
                            className="rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {prompt.is_favorite && (
                              <Heart size={14} className="text-red-500 fill-current mr-2" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{prompt.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {prompt.prompt_text?.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: prompt.tool_color || '#6B7280' }}
                          >
                            {prompt.tool_name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {prompt.rating && (
                            <div className="flex items-center">
                              <Star size={14} className="text-yellow-400 fill-current mr-1" />
                              <span className="text-sm">{prompt.rating}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {prompt.usage_count || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(new Date(prompt.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(prompt.prompt_text);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(prompt.id, !prompt.is_favorite);
                              }}
                              className={`p-1 ${prompt.is_favorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            >
                              <Heart size={14} className={prompt.is_favorite ? 'fill-current' : ''} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
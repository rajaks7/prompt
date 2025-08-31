import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Heart, 
  Copy, 
  Share2, 
  Eye, 
  Star, 
  Calendar,
  Tag,
  Image as ImageIcon,
  X,
  Check,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react';

const PromptDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [relatedPrompts, setRelatedPrompts] = useState([]);
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [allPrompts, setAllPrompts] = useState([]);
  const [parentSearch, setParentSearch] = useState('');

  // Fetch prompt details
  useEffect(() => {
    const fetchPromptDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/prompts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch prompt');
        
        const data = await response.json();
        setPrompt(data);
        setEditedPrompt(data);
        
        // Increment view count
        await fetch(`http://localhost:5000/api/prompts/${id}/view`, { 
          method: 'PATCH' 
        });
        
        // Fetch related prompts
        fetchRelatedPrompts(data.category_id, data.ai_tool_id);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch master data for edit dropdowns
    const fetchMasterData = async () => {
      try {
        const [toolsRes, categoriesRes, typesRes, sourcesRes, promptsRes] = await Promise.all([
          fetch('http://localhost:5000/api/tools'),
          fetch('http://localhost:5000/api/categories'),
          fetch('http://localhost:5000/api/types'),
          fetch('http://localhost:5000/api/sources'),
          fetch('http://localhost:5000/api/prompts')
        ]);
        
        setTools(await toolsRes.json());
        setCategories(await categoriesRes.json());
        setTypes(await typesRes.json());
        setSources(await sourcesRes.json());
        
        const promptsData = await promptsRes.json();
        setAllPrompts(Array.isArray(promptsData) ? promptsData : []);
      } catch (err) {
        console.error('Failed to fetch master data:', err);
      }
    };

    if (id) {
      fetchPromptDetails();
      fetchMasterData();
    }
  }, [id]);

  // Fetch related prompts
  const fetchRelatedPrompts = async (categoryId, toolId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/prompts?category=${categoryId}&tool=${toolId}&limit=4`);
      if (response.ok) {
        const data = await response.json();
        setRelatedPrompts(data.filter(p => p.id !== parseInt(id)) || []);
      }
    } catch (err) {
      console.error('Failed to fetch related prompts:', err);
    }
  };

  // Handle edit save
  const handleSave = async () => {
    try {
      console.log('Saving prompt:', editedPrompt);
      
      // Handle file upload if new attachment exists
      let updatedData = {
        title: editedPrompt.title,
        prompt_text: editedPrompt.prompt_text,
        output_text: editedPrompt.output_text || '',
        rating: parseInt(editedPrompt.rating) || 0,
        output_status: editedPrompt.output_status || null,
        tags: editedPrompt.tags || [],
        credits_used: parseInt(editedPrompt.credits_used) || null,
        ai_tool_id: parseInt(editedPrompt.ai_tool_id) || null,
        category_id: parseInt(editedPrompt.category_id) || null,
        type_id: parseInt(editedPrompt.type_id) || null,
        source_id: parseInt(editedPrompt.source_id) || null,
        parent_prompt_id: parseInt(editedPrompt.parent_prompt_id) || null,
        version: editedPrompt.version || null,
        ai_tool_model: editedPrompt.ai_tool_model || null
      };

      // Handle attachment changes
      if (editedPrompt.newAttachment || editedPrompt.deleteAttachment) {
        const formData = new FormData();
        
        // Add all the regular fields
        Object.keys(updatedData).forEach(key => {
          if (updatedData[key] !== null && updatedData[key] !== undefined) {
            if (Array.isArray(updatedData[key])) {
              formData.append(key, JSON.stringify(updatedData[key]));
            } else {
              formData.append(key, updatedData[key]);
            }
          }
        });
        
        // Handle both delete and new file
        if (editedPrompt.deleteAttachment && editedPrompt.newAttachment) {
          // Replace: delete old and add new
          formData.append('attachment', editedPrompt.newAttachment);
          formData.append('replaceAttachment', 'true');
        } else if (editedPrompt.newAttachment) {
          // Just add new file
          formData.append('attachment', editedPrompt.newAttachment);
        } else if (editedPrompt.deleteAttachment) {
          // Just delete
          formData.append('deleteAttachment', 'true');
        }

        const response = await fetch(`http://localhost:5000/api/prompts/${id}`, {
          method: 'PATCH',
          body: formData // Don't set Content-Type header for FormData
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to update prompt: ${errorData}`);
        }
        
        const updated = await response.json();
        setPrompt(updated);
        setEditedPrompt(updated);
        setIsEditing(false);
        
        alert('Prompt updated successfully!');
        window.location.reload();
      } else {
        // Regular JSON update (no file changes)
        const response = await fetch(`http://localhost:5000/api/prompts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to update prompt: ${errorData}`);
        }
        
        const updated = await response.json();
        setPrompt(updated);
        setEditedPrompt(updated);
        setIsEditing(false);
        
        alert('Prompt updated successfully!');
        window.location.reload();
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save changes: ' + err.message);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/prompts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete prompt');
      
      navigate('/library', { 
        state: { message: 'Prompt deleted successfully', type: 'success' } 
      });
    } catch (err) {
      alert('Failed to delete prompt: ' + err.message);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/prompts/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !prompt.is_favorite })
      });
      
      if (!response.ok) throw new Error('Failed to toggle favorite');
      
      const updated = await response.json();
      setPrompt(prev => ({ ...prev, is_favorite: updated.is_favorite }));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle share
  const handleShare = (platform) => {
    const text = `Check out this prompt: ${prompt.title}

AI Tool: ${prompt.tool_name || 'Not specified'}
Category: ${prompt.category_name || 'Not specified'}

Prompt:
${prompt.prompt_text}`;
    
    const url = window.location.href;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(prompt.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`);
        break;
      default:
        handleCopy(text + '\n\n' + url);
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getToolColor = (color) => {
    return color || '#6B7280';
  };

  const getCategoryColor = (categoryName) => {
    const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];
    const hash = categoryName?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors`}
      />
    ));
  };

  // Image Modal Component
  const ImageModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-6xl max-h-full">
        <button
          onClick={() => setShowImageModal(false)}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>
        <img
          src={`http://localhost:5000/uploads/${prompt.attachment_filename}`}
          alt="Attachment"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prompt details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Error Loading Prompt</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Prompt not found</p>
          <button
            onClick={() => navigate('/library')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const isImage = prompt.attachment_filename && 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(prompt.attachment_filename);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Header Actions */}
        <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/library')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Library</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  prompt.is_favorite
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} className={prompt.is_favorite ? 'fill-current' : ''} />
              </button>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit3 size={20} />
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Printer size={20} />
              </button>
              
              <div className="relative group">
                <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                  <Share2 size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Copy size={16} />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ExternalLink size={16} />
                    <span>Share on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ExternalLink size={16} />
                    <span>Share via Email</span>
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDelete}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {isEditing ? (
                <input
                  type="text"
                  value={editedPrompt.title || ''}
                  onChange={(e) => setEditedPrompt(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 w-full border-none outline-none bg-transparent"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{prompt.title}</h1>
              )}
              
              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formatDate(prompt.created_at)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{prompt.usage_count || 0} views</span>
                </div>
                
                {prompt.rating > 0 && (
                  <div className="flex items-center space-x-1">
                    {renderStars(prompt.rating)}
                    <span className="ml-1">({prompt.rating}/5)</span>
                  </div>
                )}

                {/* AI Tool Model - FIRST */}
                {prompt.ai_tool_model && (
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {prompt.ai_tool_model}
                    </span>
                  </div>
                )}

                {/* Version - SECOND */}
                {prompt.version && (
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      v{prompt.version}
                    </span>
                  </div>
                )}

                {/* Output Status - THIRD */}
                {prompt.output_status && (
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prompt.output_status === 'successful' ? 'bg-green-100 text-green-700' :
                      prompt.output_status === 'so-so' ? 'bg-yellow-100 text-yellow-700' :
                      prompt.output_status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {prompt.output_status}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {prompt.tool_name && (
                  <span
                    className="px-3 py-1.5 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: getToolColor(prompt.tool_color) }}
                  >
                    {prompt.tool_name}
                  </span>
                )}
                
                {prompt.category_name && (
                  <span
                    className="px-3 py-1.5 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: getCategoryColor(prompt.category_name) }}
                  >
                    {prompt.category_name}
                  </span>
                )}
                
                {prompt.type_name && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {prompt.type_name}
                  </span>
                )}
                
                {prompt.source_name && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {prompt.source_name}
                  </span>
                )}
              </div>

              {/* Linked Prompt */}
              {prompt.parent_prompt_id && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                  <div 
                    className="flex items-center space-x-2 text-blue-700"
                    onClick={() => navigate(`/library/${prompt.parent_prompt_id}`)}
                  >
                    <ExternalLink size={16} />
                    <span className="text-sm font-medium">
                      Linked to: {prompt.parent_prompt_title || `Prompt #${prompt.parent_prompt_id}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Custom Tags */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium flex items-center space-x-1"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Prompt</h2>
                <button
                  onClick={() => handleCopy(prompt.prompt_text)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    copySuccess
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              
              {isEditing ? (
                <textarea
                  value={editedPrompt.prompt_text || ''}
                  onChange={(e) => setEditedPrompt(prev => ({ ...prev, prompt_text: e.target.value }))}
                  rows={6}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed">
                    {prompt.prompt_text}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Output Content */}
          {(prompt.output_text || isEditing) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Output</h2>
                  {prompt.output_text && (
                    <button
                      onClick={() => handleCopy(prompt.output_text)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Copy size={16} />
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <textarea
                    value={editedPrompt.output_text || ''}
                    onChange={(e) => setEditedPrompt(prev => ({ ...prev, output_text: e.target.value }))}
                    rows={6}
                    placeholder="Enter the AI's output or response here..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : prompt.output_text ? (
                  <div className="bg-green-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                      {prompt.output_text}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                    No output recorded yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Fields */}
          {isEditing && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Tool */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AI Tool</label>
                    <select
                      value={editedPrompt.ai_tool_id || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, ai_tool_id: e.target.value || null }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select AI Tool</option>
                      {tools.map(tool => (
                        <option key={tool.id} value={tool.id}>{tool.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={editedPrompt.category_id || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, category_id: e.target.value || null }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={editedPrompt.type_id || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, type_id: e.target.value || null }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      {types.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <select
                      value={editedPrompt.source_id || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, source_id: e.target.value || null }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Source</option>
                      {sources.map(source => (
                        <option key={source.id} value={source.id}>{source.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      value={editedPrompt.rating || 0}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={0}>No rating</option>
                      <option value={1}>1 star</option>
                      <option value={2}>2 stars</option>
                      <option value={3}>3 stars</option>
                      <option value={4}>4 stars</option>
                      <option value={5}>5 stars</option>
                    </select>
                  </div>

                  {/* Output Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Output Status</label>
                    <select
                      value={editedPrompt.output_status || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, output_status: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No status</option>
                      <option value="successful">Successful</option>
                      <option value="so-so">So-so</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  {/* Version */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <input
                      type="text"
                      value={editedPrompt.version || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, version: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1.0, 2.1, etc."
                    />
                  </div>

                  {/* AI Tool Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AI Tool Model</label>
                    <input
                      type="text"
                      value={editedPrompt.ai_tool_model || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, ai_tool_model: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="gpt-4, claude-3, etc."
                    />
                  </div>

                  {/* Credits Used */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits Used</label>
                    <input
                      type="number"
                      value={editedPrompt.credits_used || ''}
                      onChange={(e) => setEditedPrompt(prev => ({ ...prev, credits_used: parseInt(e.target.value) || null }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  {/* Parent Prompt Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link to Parent Prompt</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={parentSearch}
                        onChange={(e) => setParentSearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search for parent prompt..."
                      />
                      {parentSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {allPrompts
                            .filter(p => 
                              p.id !== parseInt(id) && 
                              p.title.toLowerCase().includes(parentSearch.toLowerCase())
                            )
                            .slice(0, 5)
                            .map(parentPrompt => (
                              <div
                                key={parentPrompt.id}
                                onClick={() => {
                                  setEditedPrompt(prev => ({ ...prev, parent_prompt_id: parentPrompt.id }));
                                  setParentSearch(parentPrompt.title);
                                }}
                                className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-sm">{parentPrompt.title}</div>
                                <div className="text-xs text-gray-500">ID: {parentPrompt.id}</div>
                              </div>
                            ))}
                          {allPrompts.filter(p => 
                            p.id !== parseInt(id) && 
                            p.title.toLowerCase().includes(parentSearch.toLowerCase())
                          ).length === 0 && (
                            <div className="p-2 text-gray-500 text-sm">No prompts found</div>
                          )}
                        </div>
                      )}
                    </div>
                    {editedPrompt.parent_prompt_id && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <span className="text-blue-700">
                          Selected: {allPrompts.find(p => p.id === parseInt(editedPrompt.parent_prompt_id))?.title || `ID: ${editedPrompt.parent_prompt_id}`}
                        </span>
                        <button
                          onClick={() => {
                            setEditedPrompt(prev => ({ ...prev, parent_prompt_id: null }));
                            setParentSearch('');
                          }}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={editedPrompt.tags ? editedPrompt.tags.join(', ') : ''}
                      onChange={(e) => setEditedPrompt(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attachment Section */}
          {(prompt.attachment_filename || isEditing) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isEditing ? 'Attachment' : 'Attachment'}
                  </h2>
                  {prompt.attachment_filename && !isEditing && (
                    <button
                      onClick={() => window.open(`http://localhost:5000/uploads/${prompt.attachment_filename}`, '_blank')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Current Attachment Display */}
                    {prompt.attachment_filename && (
                      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-blue-700">
                            <strong>Current attachment:</strong> {prompt.attachment_filename}
                          </p>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this attachment?')) {
                                setEditedPrompt(prev => ({ ...prev, deleteAttachment: true }));
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
                          >
                            <X size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                        {!editedPrompt.deleteAttachment ? (
                          isImage ? (
                            <img
                              src={`http://localhost:5000/uploads/${prompt.attachment_filename}`}
                              alt="Current attachment"
                              className="max-w-xs rounded-lg border"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <ExternalLink size={16} />
                              <span>File: {prompt.attachment_filename}</span>
                            </div>
                          )
                        ) : (
                          <div className="text-red-600 text-sm">
                            ✓ Attachment will be deleted when you save
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* New Attachment Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {prompt.attachment_filename ? 'Replace Attachment' : 'Add Attachment'}
                      </label>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setEditedPrompt(prev => ({ ...prev, newAttachment: file }));
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: Images, PDF, DOC, DOCX, TXT (Max 10MB)
                      </p>
                    </div>
                    
                    {editedPrompt.newAttachment && (
                      <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                        <p className="text-sm text-green-700">
                          <strong>New file selected:</strong> {editedPrompt.newAttachment.name}
                        </p>
                        <button
                          onClick={() => setEditedPrompt(prev => ({ ...prev, newAttachment: null }))}
                          className="text-red-600 hover:text-red-800 text-xs mt-1"
                        >
                          Remove new file
                        </button>
                      </div>
                    )}
                    
                    {!prompt.attachment_filename && !editedPrompt.newAttachment && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <p>No attachment uploaded for this prompt</p>
                        <p className="text-sm mt-2">Select a file above to add an attachment.</p>
                      </div>
                    )}
                  </div>
                ) : prompt.attachment_filename ? (
                  <>
                    {isImage ? (
                      <div className="relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
                        <img
                          src={`http://localhost:5000/uploads/${prompt.attachment_filename}`}
                          alt="Attachment"
                          className="w-full rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <ImageIcon size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <ExternalLink size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600">{prompt.attachment_filename}</p>
                          <p className="text-sm text-gray-400">Click download to view file</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedPrompt(prompt);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Views</span>
                <span className="font-medium">{prompt.usage_count || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{formatDate(prompt.created_at)}</span>
              </div>
              
              {prompt.updated_at !== prompt.created_at && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Updated</span>
                  <span className="font-medium">{formatDate(prompt.updated_at)}</span>
                </div>
              )}
              
              {prompt.credits_used && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Credits Used</span>
                  <span className="font-medium">{prompt.credits_used}</span>
                </div>
              )}
            </div>
          </div>

          {/* Related Prompts */}
          {relatedPrompts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Related Prompts</h3>
              <div className="space-y-3">
                {relatedPrompts.slice(0, 3).map((related) => (
                  <div
                    key={related.id}
                    onClick={() => navigate(`/library/${related.id}`)}
                    className="p-3 border border-gray-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 text-sm mb-1">
                      {related.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {related.prompt_text?.substring(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {related.usage_count || 0} views
                      </span>
                      {related.rating > 0 && (
                        <div className="flex items-center">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{related.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/library')}
                className="w-full flex items-center space-x-2 p-3 text-left bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Library</span>
              </button>
              
              <button
                onClick={() => navigate('/create')}
                className="w-full flex items-center space-x-2 p-3 text-left bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Edit3 size={16} />
                <span>Create New Prompt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && <ImageModal />}

      {/* Copy Success Toast */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <Check size={20} />
            <span>Copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptDetailPage;
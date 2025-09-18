import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Upload, X, Eye, Wand2, Sparkles, FileText, Tag, Link, Search } from 'lucide-react';
import SidebarNavigation from "../../components/ui/SidebarNavigation";

// useMasterData hook - defined locally
const useMasterData = () => {
  const [data, setData] = useState({
    tools: [], categories: [], types: [], sources: [], prompts: [],
    loading: true, error: null,
  });
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [toolsRes, categoriesRes, typesRes, sourcesRes, promptsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tools'),
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/types'),
          axios.get('http://localhost:5000/api/sources'),
          axios.get('http://localhost:5000/api/prompts?sort=title_asc'),
        ]);
        
        // Add consistent colors to categories if they don't have color_hex field
        const categoriesWithColors = categoriesRes.data.map(category => ({
          ...category,
          color_hex: category.color_hex || getCategoryColor(category.name)
        }));
        
        setData({
          tools: toolsRes.data, 
          categories: categoriesWithColors,
          types: typesRes.data, 
          sources: sourcesRes.data, 
          prompts: promptsRes.data,
          loading: false, 
          error: null,
        });
      } catch (error) {
        console.error("Failed to fetch master data", error);
        setData(d => ({ ...d, loading: false, error: "Could not load required data." }));
      }
    };
    fetchAllData();
  }, []);
  
  return data;
};

// Icon wrapper component
const Icon = ({ name, size = 24, className = "" }) => {
  const IconComponent = {
    Star, Upload, X, Eye, Wand2, Sparkles, FileText, Tag, Link, Search
  }[name];
  
  return IconComponent ? <IconComponent size={size} className={className} /> : null;
};

// AI Tool Tag Button
const AIToolButton = ({ tool, selected, onClick }) => {
  const baseColor = tool.color_hex || '#3B82F6';

  const buttonStyle = selected
    ? {
        backgroundColor: baseColor,
        color: 'white',
        boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
      }
    : {
        backgroundColor: '#F3F4F6', // plain grey background
        color: '#374151',          // grey text
      };

  return (
    <button
      type="button"
      onClick={() => onClick(tool.id)}
      style={buttonStyle}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
    >
      {tool.name}
    </button>
  );
};
  
// Generate consistent colors for categories (using 6-char hex codes)
const getCategoryColor = (categoryName) => {
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#C026D3', '#DB2777', '#E11D48'
  ];
  if (!categoryName) return '#6B7280';
  const index = categoryName.length % colors.length;
  return colors[index];
};

// Category Button  
const CategoryButton = ({ category, selected, onClick }) => {
  const categoryColor = category.color_hex || getCategoryColor(category.name);

  const buttonStyle = selected
    ? {
        backgroundColor: categoryColor,
        color: 'white',
        boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
        transform: 'scale(1.05)',
      }
    : {
        backgroundColor: '#F9FAFB',
        color: '#374151',
        border: '1px solid #E5E7EB',
      };

  return (
    <button
      type="button"
      onClick={() => onClick(category.id)}
      style={buttonStyle}
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
    >
      {(
        // 🔹 Small square always uses DB color
        <div
          className="w-5 h-5 rounded"
          style={{ backgroundColor: categoryColor }}
        />
      )}
      {category.name}
    </button>
  );
};

// Radio Button Group
const RadioGroup = ({ options, value, onChange, name }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id.toString()}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
            {option.name}
          </span>
        </label>
      ))}
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating, onChange }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 rounded-full hover:bg-yellow-50 transition-colors"
        >
          <Icon 
            name="Star" 
            size={20} 
            className={`transition-colors ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300 hover:text-yellow-300'
            }`} 
          />
        </button>
      ))}
      <span className="text-sm text-gray-500 ml-2">({rating}/5)</span>
    </div>
  );
};

// Status Toggle Component
const StatusToggle = ({ status, onChange }) => {
  const options = [
    { value: 'Successful', label: '✓ Success', color: 'bg-green-500' },
    { value: 'So-So', label: '~ So-So', color: 'bg-yellow-500' },
    { value: 'Failure', label: '✗ Failed', color: 'bg-red-500' }
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${status === option.value 
              ? `${option.color} text-white shadow-md transform scale-105` 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Parent Prompt Search
const ParentPromptSearch = ({ prompts, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedPrompt = prompts.find(p => p.id.toString() === value);
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
        <Icon name="Search" size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search parent prompt..."
          value={selectedPrompt ? selectedPrompt.title : searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setSearchTerm(''); }}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      
      {showDropdown && filteredPrompts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
          {filteredPrompts.slice(0, 10).map(prompt => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => {
                onChange(prompt.id.toString());
                setShowDropdown(false);
                setSearchTerm('');
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
            >
              {prompt.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// File Upload Component
const FileUpload = ({ file, onChange, onRemove }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  return (
    <div className="space-y-3">
      {!file ? (
        <label className="
          flex flex-col items-center justify-center w-full h-24 border-2 border-dashed 
          border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 
          transition-colors
        ">
          <div className="flex flex-col items-center">
            <Icon name="Upload" size={24} className="text-gray-400 mb-1" />
            <p className="text-sm text-gray-500">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Icon name="FileText" size={20} className="text-blue-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">{file.name}</p>
            <p className="text-xs text-blue-600">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button 
            type="button"
            onClick={onRemove}
            className="text-blue-400 hover:text-blue-600 p-1"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const CreatePromptPage = () => {
  const navigate = useNavigate();
  const { tools, categories, types, sources, prompts, loading, error: dataError } = useMasterData();
  
  const [formData, setFormData] = useState({
    title: '',
    type_id: '',
    source_id: '',
    ai_tool_id: '',
    category_id: '',
    prompt_text: '',
    output_text: '',
    output_status: 'Successful',
    rating: 5,
    tags: '',
    credits_used: '',
    parent_prompt_id: '',
    version: '1.0',
    ai_tool_model: ''
  });
  
  const [attachment, setAttachment] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate stats
  const promptStats = useMemo(() => ({
    wordCount: formData.prompt_text.split(/\s+/).filter(Boolean).length,
    charCount: formData.prompt_text.length,
    lineCount: formData.prompt_text.split('\n').length
  }), [formData.prompt_text]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    
    // Handle form data
    for (const key in formData) {
      let value = formData[key];
      const numericKeys = ['type_id', 'source_id', 'ai_tool_id', 'category_id', 'rating', 'credits_used', 'parent_prompt_id'];
      
      if (numericKeys.includes(key) && value === '') {
        value = null;
      }
      
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    }
    
    if (attachment) {
      formDataToSend.append('attachment', attachment);
    }
    
    try {
      await axios.post('http://localhost:5000/api/prompts', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/library');
    } catch (err) {
      console.error("Error creating prompt:", err);
      setFormError(err.response?.data?.msg || 'Failed to create prompt. Please check all required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we need to show source field
  const selectedType = types.find(t => t.id.toString() === formData.type_id);
  const showSourceField = selectedType?.name === 'Sourced';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{dataError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNavigation />

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="Wand2" size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Create New Prompt</h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Craft your next masterpiece for your AI companion
          </p>
          
          {/* Live Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              <span>{promptStats.wordCount} words</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Eye" size={16} />
              <span>{promptStats.charCount} characters</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={16} />
              <span>{promptStats.lineCount} lines</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  placeholder="Enter a descriptive title for your prompt..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* AI Tools - Tag Buttons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  AI Tool
                </label>
                <div className="flex flex-wrap gap-3">
                  {tools.map(tool => (
                    <AIToolButton
                      key={tool.id}
                      tool={tool}
                      selected={formData.ai_tool_id === tool.id.toString()}
                      onClick={(id) => handleChange('ai_tool_id', id.toString())}
                    />
                  ))}
                </div>
              </div>
              
              {/* AI Tool Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  AI Tool Model
                </label>
                <input
                  type="text"
                  value={formData.ai_tool_model}
                  onChange={(e) => handleChange('ai_tool_model', e.target.value)}
                  placeholder="e.g., gpt-4, claude-3-sonnet, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Categories - Styled Buttons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map(category => (
                    <CategoryButton
                      key={category.id}
                      category={category}
                      selected={formData.category_id === category.id.toString()}
                      onClick={(id) => handleChange('category_id', id.toString())}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Icon name="Wand2" size={20} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Prompt Content</h2>
            </div>
            
            <div className="space-y-6">
              {/* Prompt Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prompt *
                </label>
                <textarea
                  value={formData.prompt_text}
                  onChange={(e) => handleChange('prompt_text', e.target.value)}
                  required
                  rows={12}
                  placeholder="Write your prompt here... Be specific and clear about what you want the AI to do."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-colors resize-none"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{promptStats.wordCount} words • {promptStats.charCount} characters</span>
                  <span>{promptStats.lineCount} lines</span>
                </div>
              </div>
              
              {/* Output Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Output / Notes
                </label>
                <textarea
                  value={formData.output_text}
                  onChange={(e) => handleChange('output_text', e.target.value)}
                  rows={6}
                  placeholder="Paste the AI's output here, or add your notes about expected results..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Type - Radio Buttons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Type
                </label>
                <RadioGroup
                  options={types}
                  value={formData.type_id}
                  onChange={(value) => handleChange('type_id', value)}
                  name="type"
                />
              </div>
              
              {/* Source - Dropdown (always visible, disabled unless type = Sourced) */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Source
                </label>
                <select
                    value={formData.source_id}
                    onChange={(e) => handleChange('source_id', e.target.value)}
                    disabled={!showSourceField} // disable unless type = Sourced
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !showSourceField ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                >
                    <option value="">-- Select Source --</option>
                    {sources.map((src) => (
                    <option key={src.id} value={src.id}>
                        {src.name}
                    </option>
                    ))}
                </select>
                </div>
              
              
              {/* Version */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleChange('version', e.target.value)}
                  placeholder="1.0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Credits Used */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Credits Used
                </label>
                <input
                  type="number"
                  value={formData.credits_used}
                  onChange={(e) => handleChange('credits_used', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            {/* Rating */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rating
              </label>
              <StarRating
                rating={formData.rating}
                onChange={(rating) => handleChange('rating', rating)}
              />
            </div>
            
            {/* Status */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Output Status
              </label>
              <StatusToggle
                status={formData.output_status}
                onChange={(status) => handleChange('output_status', status)}
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Icon name="Tag" size={20} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Additional Settings</h2>
            </div>
            
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="marketing, seo, blog, writing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
              
              {/* Parent Prompt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link to Parent Prompt
                </label>
                <ParentPromptSearch
                  prompts={prompts}
                  value={formData.parent_prompt_id}
                  onChange={(value) => handleChange('parent_prompt_id', value)}
                />
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attachment
                </label>
                <FileUpload
                  file={attachment}
                  onChange={setAttachment}
                  onRemove={() => setAttachment(null)}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/library')}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex items-center gap-4">
                {formError && (
                  <p className="text-red-600 text-sm">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  <Icon name="Sparkles" size={18} />
                  {isSubmitting ? 'Creating...' : 'Create Prompt'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default CreatePromptPage;
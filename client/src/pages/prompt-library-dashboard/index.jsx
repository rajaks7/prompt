import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Filter, Grid, List, Heart, Copy, Share, Download, X, Star, Calendar, Eye, Tag, Trash2, Mail, MessageCircle, ChevronDown, User, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Debug and hide headers - ULTIMATE VERSION
const HideOriginalHeader = () => {
  React.useEffect(() => {
    const findAndHideHeaders = () => {
      console.log('=== DEBUGGING HEADERS ===');

      // Find all headers
      const allHeaders = document.querySelectorAll('header');
      console.log('Found headers:', allHeaders.length);
      
      allHeaders.forEach((header, index) => {
        console.log(`Header ${index}:`, header.outerHTML.substring(0, 200));
        console.log(`Header ${index} classes:`, header.className);
        console.log(`Header ${index} text:`, header.textContent?.substring(0, 100));
        
        // Hide if it's not our library header
        if (!header.classList.contains('library-header')) {
          console.log(`Hiding header ${index}`);
          header.style.display = 'none';
          header.style.visibility = 'hidden';
          header.style.height = '0px';
          header.style.overflow = 'hidden';
        }
      });

      // Also find elements containing "Welcome back"
      const welcomeElements = document.querySelectorAll('*');
      welcomeElements.forEach(element => {
        if (element.textContent && element.textContent.includes('Welcome back')) {
          console.log('Found welcome element:', element.tagName, element.className);
          
          // Try to hide the parent container
          let parent = element.closest('header') || element.closest('div');
          if (parent && !parent.classList.contains('library-header')) {
            console.log('Hiding welcome parent:', parent.tagName, parent.className);
            parent.style.display = 'none';
          }
        }
      });

      // Nuclear option - hide everything that looks like a header
      document.querySelectorAll('div').forEach(div => {
        if (div.textContent && div.textContent.includes('Welcome back') && 
            !div.classList.contains('library-header')) {
          console.log('Nuclear hiding div with welcome:', div.className);
          div.style.display = 'none';
        }
      });
    };

    // Run immediately and with delays
    findAndHideHeaders();
    setTimeout(findAndHideHeaders, 200);
    setTimeout(findAndHideHeaders, 1000);

    // CSS backup
    const style = document.createElement('style');
    style.innerHTML = `
      header:not(.library-header) { display: none !important; }
      div:has(h1:contains("Welcome back")):not(.library-header) { display: none !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  return null;
};

// Compact User Menu Component
const CompactUserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock user data - replace with your actual user data
  const user = {
    name: 'John Doe',
    role: 'admin',
    avatar: 'bg-blue-500'
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${user.avatar}`}>
          {user.name.charAt(0)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold ${user.avatar}`}>
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-blue-600 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <User size={14} />
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Color palette for categories (when no category color in DB)
const categoryColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#C026D3', '#DB2777', '#E11D48'
];

const getCategoryColor = (categoryName) => {
  if (!categoryName) return '#6B7280';
  const index = categoryName.length % categoryColors.length;
  return categoryColors[index];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM dd');
};

const PromptCard = ({ prompt, isSelected, onSelect, onToggleFavorite, selectionMode, onCardView }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // destructure common fields
  const {
    id, title, prompt_text, rating, usage_count, is_favorite,
    attachment_filename, created_at, tags, output_status,
    ai_tool_model, version
  } = prompt;

  // handle both snake_case and camelCase
  const categoryImageUrl = prompt.categoryImageUrl || prompt.category_image_url || null;
  const categoryName = prompt.categoryName || prompt.category_name || "Uncategorized";
  const toolName = prompt.toolName || prompt.tool_name || "No Tool";
  const toolColor = prompt.toolColor || prompt.tool_color || "#6B7280";

  const status = output_status ? output_status.trim().toLowerCase() : "";

  // ✅ helper to check if file is an image
  const isImageFile = (filename) => {
    if (!filename) return false;
    const ext = filename.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  };

  // ✅ strict priority: image attachment → category image → placeholder
  let displayImage = null;
  if (!imageError) {
    if (attachment_filename && isImageFile(attachment_filename)) {
      displayImage = `http://localhost:5000/uploads/${attachment_filename}`;
    } else if (categoryImageUrl) {
      displayImage = `http://localhost:5000${categoryImageUrl}`;
    }
  }

  const handleCardClick = () => {
    if (!selectionMode) {
      onCardView(id);
      navigate(`/library/${id}`);
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt_text);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(id, !is_favorite);
  };

  const excerpt =
    prompt_text?.length > 120
      ? prompt_text.substring(0, 120) + "..."
      : prompt_text || "";

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer group relative ${
        isSelected ? "border-blue-500 shadow-xl" : "border-gray-100 hover:border-gray-200"
      } ${isHovered ? "shadow-xl transform -translate-y-2" : "shadow-md"} max-w-sm w-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {selectionMode && (
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
    )}
      {/* Image Section */}
      <div className="relative h-48 rounded-t-xl overflow-hidden bg-gray-100">
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Tag size={24} className="text-gray-400" />
            <span className="text-xs text-gray-500 ml-2">No Image</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        {/* Tool + Model + Version */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: toolColor }}
            >
              {toolName}
            </span>
            {ai_tool_model && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {ai_tool_model}
              </span>
            )}
            {version && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                v{version}
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Eye size={12} className="mr-1" />
            {usage_count || 0}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-gray-600 line-clamp-2 h-8 mb-2">{excerpt}</p>

        {/* Category */}
        <div className="flex">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: prompt.categoryColor || "#6B7280" }}
          >
            {categoryName}
          </span>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1.5 border-t border-gray-100">
        {/* Left: Rating */}
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={10}
              className={
                star <= Math.round(rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-1">({rating?.toFixed(1) || "0.0"})</span>
        </div>

        {/* Middle: Output Status */}
        {output_status && (
          <div className="flex justify-center flex-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                ${
                  status === "successful"
                    ? "bg-green-100 text-green-700"
                    : status === "so-so"
                    ? "bg-yellow-100 text-yellow-700"
                    : status === "failure"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
            >
              {output_status}
            </span>
          </div>
        )}

        {/* Right: Date */}
        <div className="flex items-center">
          <Calendar size={10} className="mr-1" />
          {formatDate(created_at)}
        </div>
      </div>

      </div>
    </div>
  );
};

const TableRow = ({ prompt, isSelected, onSelect, onToggleFavorite, selectionMode, onCardView }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // destructure consistent fields
  const {
    id, title, prompt_text, rating, usage_count, is_favorite,
    attachment_filename, created_at, output_status,
    ai_tool_model, version
  } = prompt;

  // handle both snake_case and camelCase API fields
  const categoryImageUrl = prompt.categoryImageUrl || prompt.category_image_url || null;
  const categoryName = prompt.categoryName || prompt.category_name || "Uncategorized";
  const toolName = prompt.toolName || prompt.tool_name || "No Tool";
  const toolColor = prompt.toolColor || prompt.tool_color || "#6B7280";

  const status = output_status ? output_status.trim().toLowerCase() : "";

  // ✅ helper to check if attachment is an image
  const isImageFile = (filename) => {
    if (!filename) return false;
    const ext = filename.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  };

  // ✅ strict priority: image attachment → category image → placeholder
  let displayImage = null;
  if (!imageError) {
    if (attachment_filename && isImageFile(attachment_filename)) {
      displayImage = `http://localhost:5000/uploads/${attachment_filename}`;
    } else if (categoryImageUrl) {
      displayImage = `http://localhost:5000${categoryImageUrl}`;
    }
  }

  const handleRowClick = () => {
    if (!selectionMode) {
      onCardView(id);
      navigate(`/library/${id}`);
    }
  };

  return (
    <tr
      className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? "bg-blue-50" : ""}`}
      onClick={handleRowClick}
    >
      {selectionMode && (
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          />
        </td>
      )}
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
            {displayImage ? (
              <img
                src={displayImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Tag size={16} className="text-gray-400" />
                <span className="ml-1 text-xs text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate max-w-xs">{title}</h4>
            <p className="text-xs text-gray-500 truncate max-w-xs">
              {prompt_text?.substring(0, 100)}...
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: toolColor }}
          >
            {toolName}
          </span>
          {ai_tool_model && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {ai_tool_model}
            </span>
          )}
          {version && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              v{version}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: prompt.categoryColor || "#6B7280" }}
        >
          {categoryName}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              className={
                star <= Math.round(rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-1 text-xs text-gray-600">({rating?.toFixed(1) || "0.0"})</span>
          {output_status && (
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium
                ${
                  status === "successful"
                    ? "bg-green-100 text-green-700"
                    : status === "so-so"
                    ? "bg-yellow-100 text-yellow-700"
                    : status === "failure"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
            >
              {output_status}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{usage_count || 0}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(created_at)}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id, !is_favorite);
            }}
            className={`p-1 rounded transition-colors ${
              is_favorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart size={16} className={is_favorite ? "fill-current" : ""} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(prompt_text);
            }}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-gray-400 hover:text-green-500 transition-colors"
          >
            <Share size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ShareModal = ({ isOpen, onClose, selectedPrompts, prompts }) => {
  if (!isOpen) return null;

  const selectedPromptData = prompts.filter(p => selectedPrompts.includes(p.id));

  // 🔹 Helper to format prompt details
  const buildPromptDetails = (p) => {
    const tool = p.tool_name || p.toolName || "Not specified";
    const model = p.ai_tool_model || "Not specified";
    const category = p.category_name || p.categoryName || "Not specified";
    const outputStatus = p.output_status || "Not specified";

    return (
      `Title: ${p.title}\n` +
      `Tool: ${tool}\n` +
      `Model: ${model}\n` +
      `Category: ${category}\n` +
      `Output Status: ${outputStatus}\n\n` +
      `Content:\n${p.prompt_text}\n\n` +
      `Rating: ${p.rating || "N/A"}/5\n` +
      `Usage: ${p.usage_count || 0} times\n` +
      `Created: ${new Date(p.created_at).toLocaleDateString()}\n\n` +
      `---\n\n`
    );
  };

  const handleWhatsAppShare = () => {
    const text = selectedPromptData.map(buildPromptDetails).join('');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = "Shared Prompts from Prompt Manager";

    const body = selectedPromptData.map((p) => {
      const tool = p.tool_name || p.toolName || "Not specified";
      const model = p.ai_tool_model || "Not specified";
      const category = p.category_name || p.categoryName || "Not specified";
      const outputStatus = p.output_status || "Not specified";

      return (
        `Title: ${p.title}\n` +
        `Tool: ${tool}\n` +
        `Model: ${model}\n` +
        `Category: ${category}\n` +
        `Output Status: ${outputStatus}\n\n` +
        `Content:\n${p.prompt_text}\n\n` +
        `Rating: ${p.rating || "N/A"}/5\n` +
        `Usage: ${p.usage_count || 0} times\n` +
        `Created: ${new Date(p.created_at).toLocaleDateString()}\n\n` +
        `---\n\n`
      );
    }).join("\n");

    // Encode safely for email
    const safeSubject = encodeURIComponent(subject);
    const safeBody = encodeURIComponent(body);

    window.location.href = `mailto:?subject=${safeSubject}&body=${safeBody}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Prompts</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Share {selectedPrompts.length} selected prompt{selectedPrompts.length > 1 ? 's' : ''}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={20} />
            Share via WhatsApp
          </button>

          <button
            onClick={handleEmailShare}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Mail size={20} />
            Share via Email
          </button>
        </div>
      </div>
    </div>
  );
};


const FilterDropdown = ({ name, label, value, onChange, options }) => (
  <div className="min-w-0">
    <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}</label>
    <select 
      name={name} 
      value={value} 
      onChange={onChange} 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">All</option>
      {options.map(opt => (
        <option key={opt.id || opt.value} value={opt.id || opt.value}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const LibraryPage = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    search: '', 
    tool: '', 
    category: '', 
    rating: '', 
    sort: 'created_at_desc', 
    favoritesOnly: false 
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const { tools, categories } = useMasterData();
  
  const searchInputRef = useRef(null);

  // Hide original header for this page only
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .min-h-screen > div > main > header,
      body > div > div > header,
      header:not(.library-header) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Fetch prompts with applied filters
  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/prompts', { 
          params: filters 
        });
        setPrompts(response.data);
        setFilteredPrompts(response.data);
      } catch (err) { 
        console.error('Failed to fetch prompts:', err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchPrompts();
  }, [filters]);

  // Handle view count increment when card is clicked
  const handleCardView = async (promptId) => {
    try {
      // Increment usage count in database
      await axios.patch(`http://localhost:5000/api/prompts/${promptId}/view`);
      
      // Update local state to reflect the change
      setPrompts(prev => prev.map(p => 
        p.id === promptId ? { ...p, usage_count: (p.usage_count || 0) + 1 } : p
      ));
      setFilteredPrompts(prev => prev.map(p => 
        p.id === promptId ? { ...p, usage_count: (p.usage_count || 0) + 1 } : p
      ));
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled via filters, ensure focus stays
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleFavoriteToggle = () => {
    setFilters(prev => ({ ...prev, favoritesOnly: !prev.favoritesOnly }));
  };
  
  const handleToggleFavorite = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/prompts/${id}/favorite`, { 
        is_favorite: newStatus 
      });
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, is_favorite: newStatus } : p));
      setFilteredPrompts(prev => prev.map(p => p.id === id ? { ...p, is_favorite: newStatus } : p));
    } catch (error) { 
      console.error("Failed to update favorite status", error); 
    }
  };

  const handleSelectPrompt = (id) => {
    setSelectedPrompts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : prev.length < 10 
          ? [...prev, id] 
          : prev
    );
  };

  const handleSelectAll = () => {
    if (selectedPrompts.length === filteredPrompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(filteredPrompts.slice(0, 10).map(p => p.id));
    }
  };

  const handleExportSelected = () => {
  if (selectedPrompts.length === 0) return;

  const selectedData = filteredPrompts.filter(p => selectedPrompts.includes(p.id));
  const textContent = selectedData.map(prompt => {
    const tool = prompt.tool_name || prompt.toolName || "Not specified";
    const model = prompt.ai_tool_model || "Not specified";
    const category = prompt.category_name || prompt.categoryName || "Not specified";
    const outputStatus = prompt.output_status || "Not specified";

    return (
      `Title: ${prompt.title}\n` +
      `Tool: ${tool}\n` +
      `Model: ${model}\n` +
      `Category: ${category}\n` +
      `Output Status: ${outputStatus}\n\n` +
      `Content:\n${prompt.prompt_text}\n\n` +
      `Rating: ${prompt.rating || "N/A"}/5\n` +
      `Usage: ${prompt.usage_count || 0} times\n` +
      `Created: ${new Date(prompt.created_at).toLocaleDateString()}\n\n` +
      `---\n\n`
    );
  }).join('');

  const element = document.createElement('a');
  const file = new Blob([textContent], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `selected-prompts-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};


  const handleDeleteSelected = async () => {
  if (selectedPrompts.length === 0) return;
  if (!window.confirm(`Are you sure you want to delete ${selectedPrompts.length} selected prompts?`)) return;

  try {
    await axios.post("http://localhost:5000/api/prompts/bulk-delete", {
      ids: selectedPrompts
    });

    setPrompts(prev => prev.filter(p => !selectedPrompts.includes(p.id)));
    setFilteredPrompts(prev => prev.filter(p => !selectedPrompts.includes(p.id)));
    setSelectedPrompts([]);

    alert("Selected prompts deleted successfully.");
  } catch (err) {
    console.error("Failed to bulk delete prompts:", err);
    alert("Failed to delete selected prompts. Check console for details.");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Custom Header - No Welcome Message */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Prompt Library</h1>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              {filteredPrompts.length} prompts
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search, Sort, Filter Bar with More Visible Silver Gradient */}
      <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 border-b shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4">
            {/* Main Controls Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    name="search"
                    placeholder="Search prompts, tags, or content..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </form>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Favorites Toggle */}
                <button
                  onClick={handleFavoriteToggle}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                    filters.favoritesOnly 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 text-gray-600 hover:bg-white border border-gray-200'
                  }`}
                >
                  <Heart size={16} className={filters.favoritesOnly ? 'fill-current' : ''} />
                  Favorites
                </button>

                {/* Sort */}
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="px-4 py-3 border border-gray-200 rounded-xl bg-white/90 text-sm focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="created_at_desc">Newest First</option>
                  <option value="created_at_asc">Oldest First</option>
                  <option value="title_asc">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                  <option value="rating_desc">Highest Rated</option>
                  <option value="rating_asc">Lowest Rated</option>
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 border rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                    showFilters 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white/90 text-gray-600 border-gray-200 hover:bg-white'
                  }`}
                >
                  <Filter size={16} />
                  Filters
                </button>

                {/* View Mode */}
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white/90">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>

                {/* Selection Mode */}
                <button
                  onClick={() => {
                    setSelectionMode(!selectionMode);
                    if (selectionMode) setSelectedPrompts([]);
                  }}
                  className={`px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${
                    selectionMode 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white/90 text-gray-600 border-gray-200 hover:bg-white'
                  }`}
                >
                  Select
                </button>
              </div>
            </div>

            {/* Selection Actions */}
            {selectionMode && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-blue-50/80 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-700">
                    {selectedPrompts.length} selected (max 10)
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedPrompts.length === Math.min(filteredPrompts.length, 10) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                {selectedPrompts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportSelected}
                      className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                    >
                      <Download size={14} />
                      Export
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Share size={14} />
                      Share
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Expanded Filters */}
            {showFilters && (
              <div className="p-4 bg-white/90 rounded-xl border border-gray-200 shadow-sm backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FilterDropdown
                    name="tool"
                    label="AI Tool"
                    value={filters.tool}
                    onChange={handleFilterChange}
                    options={tools}
                  />
                  
                  <FilterDropdown
                    name="category"
                    label="Category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    options={categories}
                  />
                  
                  <div className="min-w-0">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Minimum Rating</label>
                    <select
                      name="rating"
                      value={filters.rating}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({ 
                          search: '', 
                          tool: '', 
                          category: '', 
                          rating: '', 
                          sort: 'created_at_desc', 
                          favoritesOnly: false 
                        });
                      }}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-500 mb-4">
              {filters.favoritesOnly ? 'No favorite prompts found' : 'Try adjusting your search terms or filters'}
            </p>
            <button
              onClick={() => {
                setFilters({ 
                  search: '', 
                  tool: '', 
                  category: '', 
                  rating: '', 
                  sort: 'created_at_desc', 
                  favoritesOnly: false 
                });
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
            {filteredPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isSelected={selectedPrompts.includes(prompt.id)}
                onSelect={handleSelectPrompt}
                onToggleFavorite={handleToggleFavorite}
                onCardView={handleCardView}
                selectionMode={selectionMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {selectionMode && (
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPrompts.length === Math.min(filteredPrompts.length, 10)}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prompt
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tool
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPrompts.map(prompt => (
                    <TableRow
                      key={prompt.id}
                      prompt={prompt}
                      isSelected={selectedPrompts.includes(prompt.id)}
                      onSelect={handleSelectPrompt}
                      onToggleFavorite={handleToggleFavorite}
                      onCardView={handleCardView}
                      selectionMode={selectionMode}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        selectedPrompts={selectedPrompts}
        prompts={filteredPrompts}
      />
    </div>
  );
};

// Custom hook for fetching master data (tools and categories)
const useMasterData = () => {
  const [data, setData] = useState({ tools: [], categories: [], loading: true });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tools'),
          axios.get('http://localhost:5000/api/categories'),
        ]);
        setData({ 
          tools: toolsRes.data, 
          categories: categoriesRes.data, 
          loading: false 
        });
      } catch (error) { 
        console.error("Failed to fetch filter data", error);
        setData({ tools: [], categories: [], loading: false });
      }
    };
    fetchData();
  }, []);
  
  return data;
};

export default LibraryPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Star, Copy, Heart, ChevronDown, Grid, List, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// --- Reusable Components ---
const FilterDropdown = ({ name, label, value, onChange, options }) => (
    <div>
        <label className="text-xs font-semibold text-gray-500">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full mt-1 p-2 border-gray-300 border rounded-md text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">All</option>
            {options.map(opt => <option key={opt.id || opt.value} value={opt.id || opt.value}>{opt.name}</option>)}
        </select>
    </div>
);

const PromptCard = ({ prompt, onSelect, onToggleFavorite }) => {
    const { id, title, tool_name, rating, tags, is_favorite, attachment_filename, category_image_url, tool_color, prompt_text, usage_count } = prompt;
    
    const handleCopy = (e) => { e.stopPropagation(); navigator.clipboard.writeText(prompt_text); alert('Prompt copied!'); };
    const handleFavorite = (e) => { e.stopPropagation(); onToggleFavorite(id, !is_favorite); };

    const displayImage = attachment_filename ? `http://localhost:5000/uploads/${attachment_filename}` : category_image_url;
    const excerpt = prompt_text.substring(0, 100) + (prompt_text.length > 100 ? '...' : '');

    return (
        <div onClick={() => onSelect(id)} className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group">
            <div className="relative">
                {displayImage ? (
                    <img src={displayImage} onError={(e) => { e.target.src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Image'; }} alt={title} className="w-full h-40 object-cover"/>
                ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400" style={{backgroundImage: 'linear-gradient(to top, #f3f4f6, #e5e7eb)'}}><Zap size={48} /></div>
                )}
                <div className="absolute top-2 right-2">
                    <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1"><Zap size={12}/><span>{tool_name}</span></span>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1 border-t-4" style={{ borderColor: tool_color || '#6B7280' }}>
                <div className="flex-1">
                    <h3 className="text-md font-bold text-gray-900 pr-2 truncate">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1 h-10">{excerpt}</p>
                    <div className="flex items-center mt-3">
                        {[1,2,3,4,5].map(star => <Star key={star} size={16} className={rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}/>)}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                        <button onClick={handleCopy} className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"><Copy size={14} /><span>Copy</span></button>
                        <button onClick={handleFavorite} className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${is_favorite ? 'text-red-500' : ''}`}>
                            <Heart size={14} className={is_favorite ? 'fill-current' : ''} />
                        </button>
                    </div>
                    <span>{usage_count || 0} uses</span>
                </div>
            </div>
        </div>
    );
};

const LibraryPage = () => {
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', tool: '', category: '', rating: '', sort: 'created_at_desc', favoritesOnly: false });
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const { tools, categories } = useMasterData();

    useEffect(() => {
        const fetchPrompts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/prompts', { params: filters });
                setPrompts(response.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchPrompts();
    }, [filters]);

    const handleFilterChange = e => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFavoriteToggle = () => setFilters(prev => ({ ...prev, favoritesOnly: !prev.favoritesOnly }));
    
    const handleToggleFavorite = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/prompts/${id}/favorite`, { is_favorite: newStatus });
            setPrompts(prompts.map(p => p.id === id ? { ...p, is_favorite: newStatus } : p));
        } catch (error) { console.error("Failed to update favorite status", error); }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Prompt Library</h1>
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative flex-grow w-full md:max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" name="search" placeholder="Search prompts..." value={filters.search} onChange={handleFilterChange} className="w-full p-2 pl-10 border-gray-300 border rounded-lg"/>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleFavoriteToggle} className={`p-2 rounded-md hover:bg-gray-100 ${filters.favoritesOnly ? 'bg-red-100 text-red-600' : ''}`}><Heart size={16}/></button>
                        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 p-2 text-gray-600 font-semibold rounded-md hover:bg-gray-100">
                            <span>Filters</span>
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="p-1 bg-gray-200 rounded-lg flex space-x-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><Grid size={16}/></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List size={16}/></button>
                        </div>
                    </div>
                </div>
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t">
                        <FilterDropdown name="tool" label="AI Tool" value={filters.tool} onChange={handleFilterChange} options={tools} />
                        <FilterDropdown name="category" label="Category" value={filters.category} onChange={handleFilterChange} options={categories} />
                        <FilterDropdown name="rating" label="Minimum Rating" value={filters.rating} onChange={handleFilterChange} options={[
                            { value: 5, name: '5 Stars' }, { value: 4, name: '4 Stars & Up' },
                            { value: 3, name: '3 Stars & Up' }
                        ]} />
                        <FilterDropdown name="sort" label="Sort By" value={filters.sort} onChange={handleFilterChange} options={[
                            { value: 'created_at_desc', name: 'Newest First' },
                            { value: 'rating_desc', name: 'Highest Rated' },
                            { value: 'title_asc', name: 'Title (A-Z)' },
                        ]} />
                    </div>
                )}
            </div>

            {loading ? <p>Loading...</p> : (
                prompts.length === 0 ? (
                    <div className="text-center py-16"><h3 className="text-xl font-semibold">No Prompts Found</h3><p className="text-gray-500">Try adjusting your filters.</p></div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {prompts.map(prompt => <PromptCard key={prompt.id} prompt={prompt} onSelect={(id) => navigate(`/library/${id}`)} onToggleFavorite={handleToggleFavorite} />)}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <p>Table view coming soon!</p>
                    </div>
                )
            )}
        </div>
    );
};

const useMasterData = () => {
    const [data, setData] = useState({ tools: [], categories: [], loading: true });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [toolsRes, categoriesRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/tools'),
                    axios.get('http://localhost:5000/api/categories'),
                ]);
                setData({ tools: toolsRes.data, categories: categoriesRes.data, loading: false });
            } catch (error) { console.error("Failed to fetch filter data", error); }
        };
        fetchData();
    }, []);
    return data;
};

export default LibraryPage;
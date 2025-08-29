import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

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
                setData({
                    tools: toolsRes.data, categories: categoriesRes.data,
                    types: typesRes.data, sources: sourcesRes.data, prompts: promptsRes.data,
                    loading: false, error: null,
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

const StarRating = ({ rating, setRating }) => (
    <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} size={24} className={`cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} onClick={() => setRating(star)} />
        ))}
    </div>
);

const StatusButtons = ({ status, setStatus }) => {
    const options = ['Successful', 'So-So', 'Failure'];
    return (
        <div className="flex space-x-2 rounded-lg bg-gray-100 p-1">
            {options.map(option => (
                <button type="button" key={option} onClick={() => setStatus(option)} className={`w-full py-2 text-sm font-semibold rounded-md transition-all duration-200 ${status === option ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}>
                    {option}
                </button>
            ))}
        </div>
    );
};

// Renamed component
const CreatePromptPage = () => {
    const navigate = useNavigate();
    const { tools, categories, types, sources, prompts, loading, error: dataError } = useMasterData();
    const [formData, setFormData] = useState({
        title: '', type_id: '', source_id: '', ai_tool_id: '', category_id: '',
        prompt_text: '', output_text: '', output_status: 'Successful', rating: 5,
        tags: '', credits_used: '', parent_prompt_id: ''
    });
    const [attachment, setAttachment] = useState(null);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { wordCount, charCount } = useMemo(() => ({
        wordCount: formData.prompt_text.split(/\s+/).filter(Boolean).length,
        charCount: formData.prompt_text.length
    }), [formData.prompt_text]);
    
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setAttachment(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);
        const formDataToSend = new FormData();
        for (const key in formData) {
            let value = formData[key];
            const numericKeys = ['type_id', 'source_id', 'ai_tool_id', 'category_id', 'rating', 'credits_used', 'parent_prompt_id'];
            if (numericKeys.includes(key) && value === '') value = null;
            if (key !== 'tags' && value !== null) formDataToSend.append(key, value);
        }
        formDataToSend.append('tags', formData.tags);
        if (attachment) formDataToSend.append('attachment', attachment);
        
        try {
            await axios.post('http://localhost:5000/api/prompts', formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Prompt created successfully!');
            navigate('/library');
        } catch (err) {
            console.error("Error creating prompt:", err);
            setFormError(err.response?.data?.msg || 'Failed to create prompt. Please check all required fields.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <div className="p-8">Loading form data...</div>;
    if (dataError) return <div className="p-8 text-red-500">{dataError}</div>;

    const isSourced = types.find(t => t.id === parseInt(formData.type_id))?.name === 'Sourced';
    const FilterDropdown = ({ name, label, value, onChange, options }) => (
        <div>
            <label className="text-xs font-semibold text-gray-500">{label}</label>
            <select name={name} value={value} onChange={onChange} className="w-full mt-1 p-2 border-gray-300 border rounded-md text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select...</option>
                {options.map(opt => <option key={opt.id || opt.value} value={opt.id || opt.value}>{opt.name || opt.title}</option>)}
            </select>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Prompt</h1>
            <p className="text-gray-500 mb-8">Craft your next masterpiece for your AI companion.</p>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8 max-w-4xl mx-auto border border-gray-200">
                
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Core Information</h2>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FilterDropdown name="ai_tool_id" label="AI Tool" value={formData.ai_tool_id} onChange={handleChange} options={tools} />
                        <FilterDropdown name="category_id" label="Category" value={formData.category_id} onChange={handleChange} options={categories} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Prompt Content</h2>
                    <div>
                        <label htmlFor="prompt_text" className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                        <textarea name="prompt_text" id="prompt_text" value={formData.prompt_text} onChange={handleChange} required rows="10" className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"></textarea>
                        <div className="text-right text-xs text-gray-500 mt-1">{wordCount} words / {charCount} characters</div>
                    </div>
                    <div>
                        <label htmlFor="output_text" className="block text-sm font-medium text-gray-700 mb-1">Output / Notes</label>
                        <textarea name="output_text" id="output_text" value={formData.output_text} onChange={handleChange} rows="5" className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Metadata & Classification</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <StarRating rating={formData.rating} setRating={(r) => setFormData(f => ({...f, rating: r}))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Output Status</label>
                            <StatusButtons status={formData.output_status} setStatus={(s) => setFormData(f => ({...f, output_status: s}))} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FilterDropdown name="type_id" label="Type" value={formData.type_id} onChange={handleChange} options={types} />
                         {isSourced && (
                             <FilterDropdown name="source_id" label="Source" value={formData.source_id} onChange={handleChange} options={sources} />
                         )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                            <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., marketing, seo, blog" className="w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <FilterDropdown name="parent_prompt_id" label="Link to Parent Prompt" value={formData.parent_prompt_id} onChange={handleChange} options={prompts} />
                    </div>
                    <div>
                        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                        <input type="file" name="attachment" id="attachment" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>
                </div>
                
                <div className="pt-4 text-right">
                    {formError && <p className="text-red-500 mb-4 text-left">{formError}</p>}
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 font-semibold text-lg disabled:bg-gray-400">
                        {isSubmitting ? 'Saving...' : 'Save Prompt'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Exporting with the correct name
export default CreatePromptPage;
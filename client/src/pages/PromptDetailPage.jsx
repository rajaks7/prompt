import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Printer, Edit, Copy, Star, File, Image } from 'lucide-react';

const PromptDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/prompts/${id}`);
                setPrompt(response.data);
            } catch (error) {
                console.error("Failed to fetch prompt", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrompt();
    }, [id]);

    const handlePrint = () => window.print();
    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt_text);
        alert('Prompt copied!');
    };

    if (loading) return <div className="p-8 text-center">Loading Prompt...</div>;
    if (!prompt) return <div className="p-8 text-center">Prompt not found.</div>;

    const wordCount = prompt.prompt_text.split(/\s+/).filter(Boolean).length;
    const charCount = prompt.prompt_text.length;
    const isImage = prompt.attachment_filename && ['.jpg', '.jpeg', '.png', '.gif'].some(ext => prompt.attachment_filename.endsWith(ext));

    return (
        <div className="p-4 md:p-8 bg-white min-h-full">
            <style>{`@media print { body * { visibility: hidden; } .printable-area, .printable-area * { visibility: visible; } .printable-area { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
            <div className="printable-area">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{prompt.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">Created on {format(new Date(prompt.created_at), 'PPP')}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <button onClick={handleCopy} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center space-x-2 text-sm font-semibold text-gray-700"><Copy size={16}/><span>Copy</span></button>
                        <button onClick={() => alert('Edit coming soon!')} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center space-x-2 text-sm font-semibold text-gray-700"><Edit size={16}/><span>Edit</span></button>
                        <button onClick={handlePrint} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"><Printer size={20}/></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-700">Prompt</h2>
                            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm border">{prompt.prompt_text}</pre>
                            <div className="text-right text-xs text-gray-500 mt-2">{wordCount} words / {charCount} characters</div>
                        </div>
                        {prompt.output_text && (
                            <div>
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">Output / Notes</h2>
                                <div className="bg-indigo-50 p-4 rounded-md text-sm border border-indigo-200 prose">{prompt.output_text}</div>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-gray-100 p-4 rounded-lg border">
                            <h3 className="font-semibold mb-3 text-lg">Details</h3>
                            <div className="space-y-3 text-sm">
                                <p><strong>Tool:</strong> <span className="font-semibold px-2 py-1 rounded-full text-white" style={{backgroundColor: prompt.tool_color}}>{prompt.tool_name}</span></p>
                                <p><strong>Category:</strong> <span className="font-semibold">{prompt.category_name}</span></p>
                                <p><strong>Type:</strong> <span className="font-semibold">{prompt.type_name}</span></p>
                                {prompt.source_name && <p><strong>Source:</strong> <span className="font-semibold">{prompt.source_name}</span></p>}
                                {prompt.rating && <div className="flex items-center"><strong>Rating:</strong><div className="flex ml-2">{[1,2,3,4,5].map(star => <Star key={star} size={16} className={prompt.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}/>)}</div></div>}
                                {prompt.tags && prompt.tags.length > 0 && <div className="flex flex-wrap gap-1"><strong>Tags:</strong> {prompt.tags.map(t => <span key={t} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{t}</span>)}</div>}
                                {prompt.parent_prompt_title && <p><strong>Linked to:</strong> <span className="font-semibold">{prompt.parent_prompt_title}</span></p>}
                            </div>
                        </div>
                         {prompt.attachment_filename && (
                            <div className="bg-gray-100 p-4 rounded-lg border">
                                <h3 className="font-semibold mb-2 text-lg">Attachment</h3>
                                {isImage ? (
                                    <img src={`http://localhost:5000/uploads/${prompt.attachment_filename}`} alt="Attachment" className="rounded-md w-full object-cover"/>
                                ) : (
                                    <a href={`http://localhost:5000/uploads/${prompt.attachment_filename}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline flex items-center space-x-2"><File size={16}/><span>View Attachment</span></a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptDetailPage;
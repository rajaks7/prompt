import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/tools';

const AdminToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [editingTool, setEditingTool] = useState(null);
  const [formState, setFormState] = useState({ name: '', color_hex: '#6B7280' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setTools(response.data);
    } catch (err) { setError('Failed to fetch AI tools.'); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleEditClick = (tool) => {
    setEditingTool(tool);
    setFormState({ name: tool.name, color_hex: tool.color_hex });
  };

  const handleCancelEdit = () => {
    setEditingTool(null);
    setFormState({ name: '', color_hex: '#6B7280' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTool) {
        await axios.put(`${API_URL}/${editingTool.id}`, formState);
      } else {
        await axios.post(API_URL, formState);
      }
      handleCancelEdit();
      fetchData();
    } catch (err) { setError('Operation failed. Does the name already exist?'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) { setError('Failed to delete tool.'); }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6"><Link to="/admin" className="text-blue-600 hover:underline">&larr; Back to Admin Dashboard</Link></div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin - Manage AI Tools</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-4">{editingTool ? 'Edit Tool' : 'Add New Tool'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="e.g., ChatGPT" className="w-full p-2 border border-gray-300 rounded-md"/>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
            <input type="color" name="color_hex" value={formState.color_hex} onChange={handleInputChange} className="w-full h-10 p-1 border border-gray-300 rounded-md"/>
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">{editingTool ? 'Update' : 'Add'}</button>
            {editingTool && <button type="button" onClick={handleCancelEdit} className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300">Cancel</button>}
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Tools</h2>
        <ul className="space-y-3">
          {tools.map((tool) => (
            <li key={tool.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-md" style={{ backgroundColor: tool.color_hex }}></div>
                <span>{tool.name}</span>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEditClick(tool)} className="text-blue-500 hover:text-blue-700 font-semibold">Edit</button>
                <button onClick={() => handleDelete(tool.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminToolsPage;
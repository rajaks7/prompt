// client/src/pages/AdminTypesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/types';

const AdminTypesPage = () => {
  const [types, setTypes] = useState([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setTypes(response.data);
    } catch (err) { setError('Failed to fetch prompt types.'); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { name: newName });
      setNewName('');
      fetchData();
    } catch (err) { setError('Failed to add type. Does it already exist?'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) { setError('Failed to delete type.'); }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6"><Link to="/admin" className="text-blue-600 hover:underline">&larr; Back to Admin Dashboard</Link></div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin - Manage Prompt Types</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Type</h2>
        <form onSubmit={handleAdd} className="flex space-x-4">
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., My Prompt" className="flex-grow p-2 border border-gray-300 rounded-md"/>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Add</button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Types</h2>
        <ul className="space-y-3">
          {types.map((type) => (
            <li key={type.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
              <span>{type.name}</span>
              <button onClick={() => handleDelete(type.id)} className="text-red-500 hover:text-red-700">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default AdminTypesPage;
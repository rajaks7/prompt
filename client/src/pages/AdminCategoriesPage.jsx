import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/categories';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError('Failed to fetch categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        setError('Failed to delete category.');
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    try {
      await axios.post(API_URL, { name: newCategoryName, image_url: newImageUrl });
      setNewCategoryName('');
      setNewImageUrl('');
      fetchCategories();
    } catch (err) {
      setError('Failed to add category. Does it already exist?');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link to="/admin" className="text-blue-600 hover:underline">
          &larr; Back to Admin Dashboard
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin - Manage Categories</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name (e.g., Marketing)"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Default Image URL (optional)"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
          >
            Add Category
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        <ul className="space-y-3">
            {categories.map((category) => (
                <li key={category.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
                    <div className="flex items-center space-x-4">
                        {category.image_url && <img src={category.image_url} alt={category.name} className="w-10 h-10 rounded-md object-cover" />}
                        <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                    <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700 font-semibold">
                        Delete
                    </button>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
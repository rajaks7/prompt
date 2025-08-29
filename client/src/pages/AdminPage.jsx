// client/src/pages/AdminPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        This is the central hub for managing the master data that powers the application's dropdowns and filters. Use the links below to add, edit, or remove items from each category.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

        <AdminCard
          title="AI Tools"
          description="Manage the list of AI tools like ChatGPT, Midjourney, etc."
          linkTo="/admin/tools"
          bgColor="bg-blue-500"
        />

        <AdminCard
          title="Categories"
          description="Manage prompt categories like Marketing, Technical, Creative, etc."
          linkTo="/admin/categories"
          bgColor="bg-green-500"
        />

        <AdminCard
          title="Prompt Types"
          description="Manage the types of prompts, e.g., 'My Prompt' or 'Sourced'."
          linkTo="/admin/types"
          bgColor="bg-purple-500"
        />

        <AdminCard
          title="Source Names"
          description="Manage the names of sources for 'Sourced' prompts."
          linkTo="/admin/sources"
          bgColor="bg-orange-500"
        />

      </div>
    </div>
  );
};

// A helper component to make the cards look nice
const AdminCard = ({ title, description, linkTo, bgColor }) => (
  <Link to={linkTo} className={`block p-6 rounded-lg shadow-lg text-white hover:scale-105 transform transition-transform duration-200 ${bgColor}`}>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="font-light">{description}</p>
  </Link>
);

export default AdminPage;
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import Layout from "components/Layout";
import NotFound from "pages/NotFound";

// Correctly importing the component with its new name: CreatePromptPage
import CreatePromptPage from './pages/prompt-creation-editing-interface'; 
import LibraryPage from './pages/prompt-library-dashboard';
import DashboardPage from './pages/DashboardPage';
import PromptDetailPage from './pages/PromptDetailPage';
import AdminPage from './pages/AdminPage';
import AdminToolsPage from './pages/AdminToolsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminTypesPage from './pages/AdminTypesPage';
import AdminSourcesPage from './pages/AdminSourcesPage';

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:id" element={<PromptDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/tools" element={<AdminToolsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/types" element={<AdminTypesPage />} />
          <Route path="/admin/sources" element={<AdminSourcesPage />} />
        </Route>
        
        {/* Create page outside Layout - no header/sidebar */}
        <Route path="/create" element={<CreatePromptPage />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
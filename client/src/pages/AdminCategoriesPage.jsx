import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newColor, setNewColor] = useState("#3B82F6");
  const [newImage, setNewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", color_hex: "", image: null });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;

    const formData = new FormData();
    formData.append("name", newCategory);
    formData.append("color_hex", newColor);
    if (newImage) formData.append("image", newImage);

    try {
      await axios.post("http://localhost:5000/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewCategory("");
      setNewColor("#3B82F6");
      setNewImage(null);
      fetchCategories();
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleEditSave = async (id) => {
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("color_hex", editData.color_hex);
    if (editData.image) formData.append("image", editData.image);

    try {
      await axios.put(`http://localhost:5000/api/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Admin Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6">Admin – Categories</h1>

        {/* Add New Category */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-12 h-10 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
            className="text-sm"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  {/* Image */}
                  <td className="px-4 py-2">
                    {editingId === cat.id ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditData({ ...editData, image: e.target.files[0] })
                        }
                        className="text-sm"
                      />
                    ) : cat.image_url ? (
                      <img
                        src={`http://localhost:5000/${cat.image_url}`}
                        alt={cat.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-4 py-2">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>

                  {/* Color */}
                  <td className="px-4 py-2">
                    {editingId === cat.id ? (
                      <input
                        type="color"
                        value={editData.color_hex}
                        onChange={(e) =>
                          setEditData({ ...editData, color_hex: e.target.value })
                        }
                        className="w-12 h-8 rounded"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded"
                          style={{ backgroundColor: cat.color_hex }}
                        />
                        <span className="text-sm text-gray-600">
                          {cat.color_hex}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 flex gap-2">
                    {editingId === cat.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(cat.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditData({
                              name: cat.name,
                              color_hex: cat.color_hex || "#3B82F6",
                              image: null,
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;

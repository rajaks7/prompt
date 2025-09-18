import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminTypesPage = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/types");
      setTypes(res.data);
    } catch (err) {
      console.error("Failed to fetch types:", err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAdd = async () => {
    if (!newType.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/types", { name: newType });
      setNewType("");
      fetchTypes();
    } catch (err) {
      console.error("Failed to add type:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/types/${id}`);
      fetchTypes();
    } catch (err) {
      console.error("Failed to delete type:", err);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/types/${id}`, { name: editName });
      setEditingId(null);
      fetchTypes();
    } catch (err) {
      console.error("Failed to update type:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Admin Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6">Admin – Prompt Types</h1>

        {/* Add New Type */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Type name"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Types List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">
                    {editingId === t.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      t.name
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editingId === t.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(t.id)}
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
                            setEditingId(t.id);
                            setEditName(t.name);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {types.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No types found.
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

export default AdminTypesPage;

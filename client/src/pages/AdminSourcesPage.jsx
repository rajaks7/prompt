import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSourcesPage = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchSources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sources");
      setSources(res.data);
    } catch (err) {
      console.error("Failed to fetch sources:", err);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAdd = async () => {
    if (!newSource.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/sources", { name: newSource });
      setNewSource("");
      fetchSources();
    } catch (err) {
      console.error("Failed to add source:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sources/${id}`);
      fetchSources();
    } catch (err) {
      console.error("Failed to delete source:", err);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/sources/${id}`, { name: editName });
      setEditingId(null);
      fetchSources();
    } catch (err) {
      console.error("Failed to update source:", err);
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

        <h1 className="text-2xl font-bold mb-6">Admin – Prompt Sources</h1>

        {/* Add New Source */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Source name"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Sources List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2">
                    {editingId === s.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      s.name
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editingId === s.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(s.id)}
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
                            setEditingId(s.id);
                            setEditName(s.name);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {sources.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No sources found.
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

export default AdminSourcesPage;

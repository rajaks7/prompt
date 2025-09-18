import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminToolsPage = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [newTool, setNewTool] = useState("");
  const [newColor, setNewColor] = useState("#3B82F6");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", color_hex: "" });

  const fetchTools = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Failed to fetch tools:", err);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleAdd = async () => {
    if (!newTool.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/tools", {
        name: newTool,
        color_hex: newColor,
      });
      setNewTool("");
      setNewColor("#3B82F6");
      fetchTools();
    } catch (err) {
      console.error("Failed to add tool:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tools/${id}`);
      fetchTools();
    } catch (err) {
      console.error("Failed to delete tool:", err);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tools/${id}`, editData);
      setEditingId(null);
      fetchTools();
    } catch (err) {
      console.error("Failed to update tool:", err);
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

        <h1 className="text-2xl font-bold mb-6">Admin – AI Tools</h1>

        {/* Add New Tool */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="New tool name"
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-12 h-10 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Tools List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} className="border-t">
                  <td className="px-4 py-2">
                    {editingId === tool.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      tool.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === tool.id ? (
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
                          style={{ backgroundColor: tool.color_hex }}
                        />
                        <span className="text-sm text-gray-600">
                          {tool.color_hex}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editingId === tool.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(tool.id)}
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
                            setEditingId(tool.id);
                            setEditData({
                              name: tool.name,
                              color_hex: tool.color_hex || "#3B82F6",
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(tool.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {tools.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No tools found.
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

export default AdminToolsPage;

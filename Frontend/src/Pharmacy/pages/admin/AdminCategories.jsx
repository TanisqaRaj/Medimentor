import { useEffect, useState } from "react";
import pharmacyApi from "../../api/pharmacyApi";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    pharmacyApi.get("/categories")
      .then(({ data }) => setCategories(data.data))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      await pharmacyApi.post("/categories", { name: name.trim() });
      toast.success("Category added");
      setName("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Medicines in it will become uncategorised.")) return;
    try {
      await pharmacyApi.delete(`/categories/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto max-w-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Categories</h1>

        {/* Add form */}
        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-400"
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <FiPlus /> {saving ? "Adding..." : "Add"}
          </button>
        </form>

        {/* List */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-12 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-400">No categories yet. Add one above.</p>
        ) : (
          <ul className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-800">{c.name}</span>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

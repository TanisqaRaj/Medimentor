import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import pharmacyApi from "../../api/pharmacyApi";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";

const EMPTY_FORM = {
  name: "", description: "", price: "", stock: "", imageUrl: "",
  manufacturer: "", dosage: "", categoryId: "", requiresPrescription: false,
};

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef();

  const loadMedicines = () => {
    setLoading(true);
    pharmacyApi.get("/medicines", { params: { size: 100 } })
      .then(({ data }) => setMedicines(data.data.content))
      .catch(() => toast.error("Failed to load medicines"))
      .finally(() => setLoading(false));
  };

  // Load categories independently so a medicines fetch failure doesn't wipe the dropdown
  const loadCategories = () => {
    pharmacyApi.get("/categories")
      .then(({ data }) => setCategories(data.data))
      .catch(() => toast.error("Failed to load categories"));
  };

  useEffect(() => {
    loadMedicines();
    loadCategories();
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (med) => { setEditing(med.id); setForm({ ...med, categoryId: med.categoryId }); setShowModal(true); };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      try {
        const { data } = await pharmacyApi.post("/medicines/upload-image", { image: target.result });
        setForm((f) => ({ ...f, imageUrl: data.url }));
        toast.success("Image uploaded");
      } catch {
        toast.error("Image upload failed");
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock || !form.categoryId) {
      return toast.error("Fill all required fields");
    }
    setSaving(true);
    try {
      if (editing) {
        await pharmacyApi.put(`/medicines/${editing}`, form);
        toast.success("Medicine updated");
      } else {
        await pharmacyApi.post("/medicines", form);
        toast.success("Medicine created");
      }
      setShowModal(false);
      loadMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this medicine?")) return;
    try {
      await pharmacyApi.delete(`/medicines/${id}`);
      toast.success("Deleted");
      loadMedicines();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Medicines</h1>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <FiPlus /> Add Medicine
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Medicine</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-center">Rx</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicines.map((med) => (
                  <tr key={med.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                      {med.imageUrl && <img src={med.imageUrl} alt={med.name} className="w-8 h-8 rounded object-cover" />}
                      {med.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{med.categoryName}</td>
                    <td className="px-4 py-3 text-right">₹{med.price}</td>
                    <td className={`px-4 py-3 text-right font-medium ${med.stock < 10 ? "text-red-500" : "text-green-600"}`}>{med.stock}</td>
                    <td className="px-4 py-3 text-center">{med.requiresPrescription ? "✓" : "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(med)} className="text-blue-500 hover:text-blue-700"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(med.id)} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-lg font-bold text-gray-800 mb-4">{editing ? "Edit Medicine" : "Add Medicine"}</h2>
                <div className="space-y-3">
                  {[
                    { key: "name", label: "Name *", type: "text" },
                    { key: "price", label: "Price *", type: "number" },
                    { key: "stock", label: "Stock *", type: "number" },
                    { key: "manufacturer", label: "Manufacturer", type: "text" },
                    { key: "dosage", label: "Dosage", type: "text" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400"
                      />
                    </div>
                  ))}

                  {/* Image upload */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Image</label>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <div className="flex items-center gap-3">
                      {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-14 h-14 rounded-lg object-cover border" />}
                      <button
                        type="button"
                        onClick={() => fileRef.current.click()}
                        disabled={imageUploading}
                        className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-teal-400 transition"
                      >
                        <FiUpload /> {imageUploading ? "Uploading..." : "Upload Image"}
                      </button>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Category *</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-red-400 mt-1">No categories found. Add categories first.</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 resize-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.requiresPrescription}
                      onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })}
                      className="accent-teal-600"
                    />
                    <span className="text-sm text-gray-700">Requires Prescription</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || imageUploading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

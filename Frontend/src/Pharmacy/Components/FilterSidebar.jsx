import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../store/pharmacySlice";
import { FiX } from "react-icons/fi";

export default function FilterSidebar({ onClose }) {
  const dispatch = useDispatch();
  const { categories, filters } = useSelector((s) => s.pharmacy);

  const update = (key, value) => dispatch(setFilters({ [key]: value }));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</p>
        <div className="space-y-1">
          <button
            onClick={() => update("categoryId", null)}
            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition ${
              !filters.categoryId ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update("categoryId", cat.id)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition ${
                filters.categoryId === cat.id
                  ? "bg-teal-50 text-teal-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Price Range</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value || null)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-teal-400"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value || null)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-teal-400"
          />
        </div>
      </div>

      {/* Prescription */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Type</p>
        <div className="space-y-1">
          {[
            { label: "All", value: null },
            { label: "OTC (No Prescription)", value: false },
            { label: "Prescription Only", value: true },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => update("requiresPrescription", value)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition ${
                filters.requiresPrescription === value
                  ? "bg-teal-50 text-teal-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => dispatch(setFilters({ search: "", categoryId: null, minPrice: null, maxPrice: null, requiresPrescription: null }))}
        className="w-full text-sm text-gray-500 hover:text-teal-600 transition"
      >
        Clear all filters
      </button>
    </div>
  );
}

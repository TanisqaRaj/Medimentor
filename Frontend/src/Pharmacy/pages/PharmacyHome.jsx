import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchMedicines, fetchCategories, fetchCart, setFilters } from "../store/pharmacySlice";
import MedicineCard from "../Components/MedicineCard";
import MedicineCardSkeleton from "../Components/MedicineCardSkeleton";
import FilterSidebar from "../Components/FilterSidebar";
import { FiSearch, FiFilter, FiShoppingCart, FiPackage } from "react-icons/fi";

export default function PharmacyHome() {
  const dispatch = useDispatch();
  const { medicines, loading, totalPages, currentPage, filters, totalElements, cart } = useSelector(
    (s) => s.pharmacy
  );
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const [showFilter, setShowFilter] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMedicines({ ...filters, page: currentPage, size: 12 }));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  };

  const handlePageChange = (page) => {
    dispatch(fetchMedicines({ ...filters, page, size: 12 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with search + cart/orders */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-12 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">MediMentor Pharmacy</h1>
          <p className="text-teal-100 mb-6">Medicines delivered to your door</p>
          <div className="flex gap-2 max-w-xl">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="flex-1 flex items-center bg-white rounded-xl px-4 gap-2">
                <FiSearch className="text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search medicines, brands..."
                  className="flex-1 py-3 text-gray-800 outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition"
              >
                Search
              </button>
            </form>
            {/* Cart & Orders */}
            <Link
              to="/pharmacy/cart"
              className="relative flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 transition"
              title="Cart"
            >
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-teal-600 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/pharmacy/orders"
              className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 transition"
              title="My Orders"
            >
              <FiPackage className="text-xl" />
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Filter Sidebar - desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar />
        </aside>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-0 z-50 flex"
            >
              <div className="w-72 bg-white h-full shadow-2xl p-4 overflow-y-auto">
                <FilterSidebar onClose={() => setShowFilter(false)} />
              </div>
              <div className="flex-1 bg-black/40" onClick={() => setShowFilter(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              {totalElements > 0 ? `${totalElements} results` : ""}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilter(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <FiFilter /> Filters
              </button>
              <select
                value={`${filters.sortBy}-${filters.sortDir}`}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split("-");
                  dispatch(setFilters({ sortBy, sortDir }));
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="createdAt-desc">Newest First</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <MedicineCardSkeleton key={i} />)
              : medicines.map((med, i) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <MedicineCard medicine={med} />
                  </motion.div>
                ))}
          </div>

          {/* Empty state */}
          {!loading && medicines.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">💊</p>
              <p className="text-lg">No medicines found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    i === currentPage
                      ? "bg-teal-600 text-white"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-teal-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

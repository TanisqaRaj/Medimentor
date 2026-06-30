import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchMedicineById, addToCart } from "../store/pharmacySlice";
import toast from "react-hot-toast";
import { FiShoppingCart, FiArrowLeft, FiStar } from "react-icons/fi";
import { MdLocalPharmacy } from "react-icons/md";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedMedicine: med, loading, cartLoading } = useSelector((s) => s.pharmacy);

  useEffect(() => {
    dispatch(fetchMedicineById(id));
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    const result = await dispatch(addToCart({ medicineId: med.id }));
    if (addToCart.fulfilled.match(result)) {
      toast.success("Added to cart!");
    } else {
      toast.error(result.payload || "Failed to add");
    }
  };

  if (loading || !med) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-gray-200 rounded-2xl h-80" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-6 transition"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-10 min-h-72"
            >
              {med.imageUrl ? (
                <img
                  src={med.imageUrl}
                  alt={med.name}
                  className="max-h-64 object-contain drop-shadow-lg"
                />
              ) : (
                <MdLocalPharmacy className="text-teal-300 text-9xl" />
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                  {med.categoryName}
                </span>
                <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{med.name}</h1>
                <p className="text-gray-500 text-sm mb-3">{med.manufacturer}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.round(med.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({med.reviewCount || 0} reviews)</span>
                </div>

                <p className="text-3xl font-bold text-teal-600 mb-4">₹{med.price}</p>

                {med.dosage && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Dosage:</span> {med.dosage}
                  </p>
                )}

                {med.requiresPrescription && (
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-4">
                    <span className="text-orange-600 text-sm font-medium">
                      📋 Prescription required
                    </span>
                  </div>
                )}

                <p className="text-gray-600 text-sm leading-relaxed mb-6">{med.description}</p>

                <p className={`text-sm font-medium mb-6 ${med.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {med.stock > 0 ? `✓ In Stock (${med.stock} units)` : "✗ Out of Stock"}
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={cartLoading || med.stock === 0}
                className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition w-full"
              >
                <FiShoppingCart />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

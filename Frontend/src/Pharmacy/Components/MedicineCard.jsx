import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { addToCart } from "../store/pharmacySlice";
import toast from "react-hot-toast";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { MdLocalPharmacy } from "react-icons/md";

export default function MedicineCard({ medicine: med }) {
  const dispatch = useDispatch();

  const handleAdd = async (e) => {
    e.preventDefault();
    const result = await dispatch(addToCart({ medicineId: med.id }));
    if (addToCart.fulfilled.match(result)) {
      toast.success("Added to cart!");
    } else {
      toast.error(result.payload || "Failed");
    }
  };

  return (
    <Link to={`/pharmacy/product/${med.id}`}>
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 h-36 flex items-center justify-center relative">
          {med.imageUrl ? (
            <img src={med.imageUrl} alt={med.name} className="h-28 object-contain" />
          ) : (
            <MdLocalPharmacy className="text-teal-200 text-6xl" />
          )}
          {med.requiresPrescription && (
            <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
              Rx
            </span>
          )}
          {med.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <p className="text-xs text-teal-600 mb-0.5">{med.categoryName}</p>
          <p className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">{med.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-2">{med.manufacturer}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <FiStar className={`text-xs ${med.rating > 0 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            <span className="text-xs text-gray-500">{med.rating?.toFixed(1) || "—"}</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-gray-800">₹{med.price}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              disabled={med.stock === 0}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 text-white p-1.5 rounded-lg transition"
            >
              <FiShoppingCart size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

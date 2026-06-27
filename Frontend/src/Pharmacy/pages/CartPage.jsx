import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, updateCartItem, removeCartItem } from "../store/pharmacySlice";
import toast from "react-hot-toast";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, cartLoading } = useSelector((s) => s.pharmacy);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQtyChange = async (itemId, qty) => {
    if (qty < 1) {
      await dispatch(removeCartItem(itemId));
      toast.success("Item removed");
      return;
    }
    const result = await dispatch(updateCartItem({ itemId, quantity: qty }));
    if (updateCartItem.rejected.match(result)) toast.error(result.payload);
  };

  const handleRemove = async (itemId) => {
    await dispatch(removeCartItem(itemId));
    toast.success("Item removed");
  };

  const needsPrescription = cart?.items?.some((i) => i.requiresPrescription);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <FiShoppingBag className="text-7xl mb-4 text-teal-200" />
          <p className="text-xl font-medium mb-2">Your cart is empty</p>
          <Link to="/pharmacy" className="text-teal-600 hover:underline mt-2">
            Browse medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center"
                >
                  <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    {item.medicineImage ? (
                      <img src={item.medicineImage} alt={item.medicineName} className="w-14 h-14 object-contain" />
                    ) : (
                      <span className="text-2xl">💊</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.medicineName}</p>
                    <p className="text-teal-600 font-semibold">₹{item.price}</p>
                    {item.requiresPrescription && (
                      <span className="text-xs text-orange-500">📋 Prescription needed</span>
                    )}
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                      disabled={cartLoading}
                      className="text-gray-500 hover:text-teal-600 disabled:opacity-40"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                      disabled={cartLoading}
                      className="text-gray-500 hover:text-teal-600 disabled:opacity-40"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <p className="font-semibold text-gray-800 w-20 text-right">₹{item.subtotal}</p>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-400 hover:text-red-600 transition ml-2"
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-4">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>₹{cart.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-gray-800 mb-5">
              <span>Total</span>
              <span className="text-teal-600 text-lg">₹{cart.totalAmount}</span>
            </div>

            {needsPrescription && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-xs text-orange-700">
                Some items require a prescription. You'll upload it at checkout.
              </div>
            )}

            <button
              onClick={() => navigate("/pharmacy/checkout")}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

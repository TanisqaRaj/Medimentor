import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { placeOrder, uploadPrescription, fetchMyOrders } from "../store/pharmacySlice";
import toast from "react-hot-toast";
import { FiUpload, FiCheckCircle } from "react-icons/fi";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, orderLoading } = useSelector((s) => s.pharmacy);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Track whether we just placed an order — prevents the "cart empty" guard
  // from kicking in and redirecting us to /pharmacy/cart after order clears the cart.
  const orderPlacedRef = useRef(false);

  const needsPrescription = cart?.items?.some((i) => i.requiresPrescription);

  // Guard: if cart is empty AND we didn't just place an order, send back to cart
  useEffect(() => {
    if (!orderPlacedRef.current && (!cart || cart.items.length === 0)) {
      navigate("/pharmacy/cart");
    }
  }, [cart, navigate]);

  if (!cart || cart.items.length === 0) return null;

  const handleUploadPrescription = async () => {
    if (!prescriptionFile) return;
    setUploading(true);
    const result = await dispatch(uploadPrescription(prescriptionFile));
    setUploading(false);
    if (uploadPrescription.fulfilled.match(result)) {
      setPrescriptionId(result.payload.id);
      toast.success("Prescription uploaded!");
    } else {
      toast.error(result.payload || "Upload failed");
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) return toast.error("Please enter a shipping address");
    if (needsPrescription && !prescriptionId) return toast.error("Please upload prescription first");

    orderPlacedRef.current = true;
    const result = await dispatch(placeOrder({
      shippingAddress: address,
      paymentMethod,
      prescriptionId: prescriptionId || undefined,
    }));

    if (placeOrder.fulfilled.match(result)) {
      toast.success("Order placed successfully!");
      // Refresh orders list so OrdersPage shows the new order immediately
      dispatch(fetchMyOrders());
      navigate("/pharmacy/orders");
    } else {
      orderPlacedRef.current = false;
      toast.error(result.payload || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="font-semibold text-gray-800 mb-4">Shipping Address</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-teal-400 resize-none"
              />
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-2">
                {["COD", "UPI", "CARD"].map((method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="accent-teal-600"
                    />
                    <span className="text-sm text-gray-700">
                      {method === "COD" ? "Cash on Delivery" : method === "UPI" ? "UPI Payment" : "Credit/Debit Card"}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Prescription Upload */}
            {needsPrescription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-orange-200"
              >
                <h2 className="font-semibold text-gray-800 mb-1">Upload Prescription</h2>
                <p className="text-xs text-gray-500 mb-4">Required for prescription medicines</p>

                {prescriptionId ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <FiCheckCircle />
                    <span className="text-sm font-medium">Prescription uploaded successfully</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-teal-400 transition">
                      <FiUpload className="text-3xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        {prescriptionFile ? prescriptionFile.name : "Click to upload (JPG, PNG, PDF)"}
                      </span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => setPrescriptionFile(e.target.files[0])}
                      />
                    </label>
                    {prescriptionFile && (
                      <button
                        onClick={handleUploadPrescription}
                        disabled={uploading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition"
                      >
                        {uploading ? "Uploading..." : "Upload Prescription"}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate flex-1 mr-2">{item.medicineName} × {item.quantity}</span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800 mb-5">
                <span>Total</span>
                <span className="text-teal-600 text-lg">₹{cart.totalAmount}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition"
              >
                {orderLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

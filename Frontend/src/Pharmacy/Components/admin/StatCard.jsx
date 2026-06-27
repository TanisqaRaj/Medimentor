import { motion } from "framer-motion";

const COLOR_MAP = {
  teal:    "bg-teal-50 text-teal-600",
  orange:  "bg-orange-50 text-orange-500",
  blue:    "bg-blue-50 text-blue-600",
  yellow:  "bg-yellow-50 text-yellow-600",
  purple:  "bg-purple-50 text-purple-600",
  green:   "bg-green-50 text-green-600",
  emerald: "bg-emerald-50 text-emerald-600",
  red:     "bg-red-50 text-red-500",
};

export default function StatCard({ icon, label, value, color = "teal", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${COLOR_MAP[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

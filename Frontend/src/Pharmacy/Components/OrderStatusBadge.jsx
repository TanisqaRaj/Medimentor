const STATUS_STYLES = {
  PENDING:    "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED:    "bg-purple-100 text-purple-700",
  DELIVERED:  "bg-green-100 text-green-700",
  CANCELLED:  "bg-red-100 text-red-600",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function MedicineCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gray-100 h-36" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-5 bg-gray-100 rounded w-1/4" />
          <div className="h-7 w-7 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

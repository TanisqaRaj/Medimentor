// Reusable skeleton shimmer — use className to set size/shape
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container bg-[length:200%_100%] rounded-lg ${className}`}
    style={{ animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%" }}
  />
);

// Pre-built skeletons for common patterns
export const CardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <Skeleton className="h-9 w-full rounded-xl" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const DoctorCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex gap-6">
    <Skeleton className="w-32 h-32 rounded-xl shrink-0" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-10 w-40 rounded-lg mt-2" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 flex flex-col items-center gap-3">
    <Skeleton className="w-12 h-12 rounded-full" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export default Skeleton;

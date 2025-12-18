


// ============================================
// COMPOSANT SKELETON (Loading)
// ============================================

export default function BlogsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-slate-300 overflow-hidden animate-pulse"
        >
          <div className="flex flex-col md:flex-row gap-10 px-6 py-8">
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="flex justify-between mt-4">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
            <div className="w-full md:w-80 h-48 md:h-58 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

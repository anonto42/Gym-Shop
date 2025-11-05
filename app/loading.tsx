// components/GlobalLoader.tsx
export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-6 p-4">
      <h2 className="text-2xl font-semibold text-gray-700 animate-pulse">Loading Products...</h2>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex flex-col gap-2 bg-gray-100 rounded-2xl p-4"
          >
            <div className="bg-gray-300 h-32 w-full rounded-lg"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

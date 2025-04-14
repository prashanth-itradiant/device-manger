const PerformanceSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="bg-gray-100 animate-pulse rounded-xl p-4 flex items-center gap-4 shadow"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
          <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);
export default PerformanceSkeleton;

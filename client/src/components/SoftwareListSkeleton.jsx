const SoftwareListSkeleton = () => {
  return (
    <div className="bg-white shadow rounded-2xl overflow-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-3">Software Name</th>
            <th className="p-3">Version</th>
            <th className="p-3">Publisher</th>
            <th className="p-3">Install Date</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, index) => (
            <tr key={index} className="animate-pulse text-gray-700">
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoftwareListSkeleton;

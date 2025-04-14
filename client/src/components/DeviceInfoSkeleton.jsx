import React from "react";

const DeviceInfoSkeleton = () => {
  return (
    <div className="w-full lg:w-1/4 pb-8 animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-5 w-24 bg-gray-300 rounded"></div>
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gray-300"></div>

        <div className="text-center space-y-2">
          <div className="h-4 w-32 bg-gray-300 mx-auto rounded"></div>
          <div className="h-3 w-24 bg-gray-200 mx-auto rounded"></div>
        </div>

        <div className="w-full px-4 text-xs text-gray-600 space-y-2">
          {[...Array(6)].map((_, index) => (
            <div className="flex justify-between" key={index}>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 w-full px-4 pt-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-6 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoSkeleton;

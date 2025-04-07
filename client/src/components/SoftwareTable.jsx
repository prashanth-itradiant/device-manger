import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return dateString.replace(/^(\d{4})(\d{2})(\d{2})$/, "$3-$2-$1"); // Converts 20250317 to 17-03-2025
};

const SoftwareTable = ({ softwareList }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full ">
        <thead className="bg-gray-200 top-0 z-10">
          <tr className="text-left text-sm font-semibold text-gray-700">
            <th className="border-b p-3">Software Name</th>
            <th className="border-b p-3">Version</th>
            <th className="border-b p-3">Publisher</th>
            <th className="border-b p-3">Install Date</th>
          </tr>
        </thead>
        <tbody>
          {softwareList.map((item, index) => (
            <tr
              key={item.ID}
              className={`border-b text-sm ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition`}
            >
              <td
                className="p-3 truncate max-w-[250px]"
                title={item.SOFTWARE_NAME}
              >
                {item.SOFTWARE_NAME}
              </td>
              <td className="p-3">{item.VERSION}</td>
              <td className="p-3">{item.PUBLISHER}</td>
              <td className="p-3">{formatDate(item.INSTALL_DATE)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoftwareTable;

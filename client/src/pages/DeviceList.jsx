import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi"; // Search Icon

function DeviceList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8080/api/devices");
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRowClick = (serialNo) => {
    navigate(`/device/${serialNo}`);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
      {/* Top Bar: Title & Search */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 ">Device List</h2>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md px-3 py-1 pl-8 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className="absolute left-2 top-2 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-center w-8 text-nowrap">
                <input type="checkbox" />
              </th>
              {[
                "Device Owner",
                "Email",
                "Hostname",
                "Device Model",
                "Serial Number",
                "Domain",
                "OS",
              ].map((label, index) => (
                <th
                  key={index}
                  className="p-2 text-left font-normal text-sm text-nowrap"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No devices found
                </td>
              </tr>
            ) : (
              users
                .filter(
                  (user) =>
                    user.SERIAL_NO.toLowerCase().includes(
                      search.toLowerCase()
                    ) ||
                    user.USER_EMAIL.toLowerCase().includes(search.toLowerCase())
                )
                .map((user, index) => (
                  <tr
                    key={user.ROWID}
                    onClick={() => handleRowClick(user.SERIAL_NO)}
                    className={`cursor-pointer hover:bg-gray-50 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-2 text-center text-nowrap">
                      <input type="checkbox" />
                    </td>
                    <td className="p-2 text-nowrap text-xs">
                      {user.DEVICE_OWNER.replace(/^ITRADIANT\\/, "")}
                    </td>
                    <td className="p-2 text-nowrap text-xs">
                      {user.USER_EMAIL}
                    </td>
                    <td className="p-2 text-nowrap text-xs">{user.HOSTNAME}</td>
                    <td className="p-2 text-nowrap text-xs">
                      {user.DEVICE_MODEL}
                    </td>
                    <td className="p-2 text-nowrap text-xs">
                      {user.SERIAL_NO}
                    </td>
                    <td className="p-2 text-nowrap text-xs">{user.Domain}</td>
                    <td className="p-2 text-nowrap text-xs">{user.OS}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeviceList;

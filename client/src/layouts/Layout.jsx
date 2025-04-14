import React, { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { FiMenu, FiLogOut, FiGrid, FiMonitor } from "react-icons/fi";
import { RiAccountCircleLine } from "react-icons/ri";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar closed initially
  const { data: user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login", { replace: true });
    });
  };

  const sidebarItems = [
    { text: "Dashboard", path: "/", icon: <FiGrid size={18} /> },
    { text: "Devices", path: "/devices", icon: <FiMonitor size={18} /> },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar (Top bar with nav links) */}
      <header className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between h-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-lg p-1 rounded hover:bg-white hover:text-gray-600 transition"
          >
            <FiMenu />
          </button>

          {/* Show Dashboard and Devices in top navbar */}
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="text-sm px-2 py-1 rounded hover:bg-white hover:text-gray-700 transition"
            >
              {item.text}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-sm">{user ? user.name : "Guest"}</span>
          <RiAccountCircleLine size={24} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (conditionally rendered) */}
        {sidebarOpen && (
          <div className="bg-gray-900 w-40 p-2 shadow-md text-white flex flex-col">
            <nav className="flex-1">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center p-2 hover:bg-gray-600 hover:text-white rounded-md transition text-sm"
                >
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </Link>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-red-600 hover:bg-red-500 hover:text-white rounded-md mt-4 transition text-sm"
            >
              <FiLogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-3 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

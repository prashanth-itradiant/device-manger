import axios from "axios";
import { Cpu, HardDrive, MemoryStick, Monitor, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import profile from "../assets/profile1.jpg";
import DeviceInfoSkeleton from "../components/DeviceInfoSkeleton";
import PerformanceSkeleton from "../components/PerformanceSkelton";
import SoftwareListSkeleton from "../components/SoftwareListSkeleton";
import Toast from "../utlis/toast";

const Loader = () => (
  <div className="flex justify-center items-center py-6 bg-gray-50 rounded-xl">
    <MoonLoader size={40} color="#4A90E2" />
  </div>
);

const actions = [
  { name: "Clear Tempfiles", endpoint: "/api/admin-action/clear-temp-files" },
  { name: "Quick Assist", endpoint: "/api/admin-action/quick-assist" },
  { name: "Notify", endpoint: "/api/admin-action/notify" },
  { name: "Force Update", endpoint: "/api/admin-action/force-update" },
];

export default function DeviceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [loadingSoftware, setLoadingSoftware] = useState(false);
  const [loadingDeviceInfo, setLoadingDeviceInfo] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleBackNavigation = () => {
    navigate(-1);
  };

  const fetchPerformanceData = async () => {
    setLoadingPerformance(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-device-performance/${id}`
      );
      const raw = res.data.data;
      const transformed = [
        { title: "CPU Usage", value: raw.CPU, key: "cpu" },
        { title: "RAM Usage", value: raw.MEMORY, key: "ram" },
        { title: "Disk Usage", value: raw.DISK, key: "disk" },
        { title: "GPU Usage", value: raw.GPU, key: "gpu" },
        { title: "Last Reboot", value: raw.LAST_REBOOTED, key: "reboot" },
      ];

      setPerformanceData(transformed);
      console.log(res.data.data, "performance data");
    } catch (err) {
      console.error("Error fetching performance data", err);
    } finally {
      setLoadingPerformance(false);
    }
  };

  const submitAction = async () => {
    if (!selectedAction) return;

    setLoadingAction(selectedAction.name);
    setModalOpen(false);
    console.log();
    try {
      const payload = { SERIAL_NO: id, Message: message };
      const url = `${import.meta.env.VITE_API_BASE_URL}${
        selectedAction.endpoint
      }`;
      const response = await axios.post(url, payload);
      Toast.fire({ icon: "success", title: response.data.message });
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Failed to perform action");
    }
    setLoadingAction(null);
  };

  const fetchSoftwareList = async () => {
    setLoadingSoftware(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-device-softwares/${id}`
      );
      setSoftwareList(res.data.data);
      console.log(res.data, "software list");
    } catch (err) {
      console.error("Error fetching software list", err);
    } finally {
      setLoadingSoftware(false);
    }
  };

  const fetchDeviceInfo = async () => {
    setLoadingDeviceInfo(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/get-device-info/${id}`
      );
      setDeviceInfo(res.data.data);
      console.log(res.data.data, "device info");
    } catch (err) {
      console.error("Error fetching device info", err);
    } finally {
      setLoadingDeviceInfo(false);
    }
  };

  const handleAction = async (name, endpoint) => {
    if (name === "Quick Assist" || name === "Notify") {
      setSelectedAction({ name, endpoint });
      setModalOpen(true);
      return;
    }

    setLoadingAction(name);
    try {
      const payload = { SERIAL_NO: id };
      const url = `${import.meta.env.VITE_API_BASE_URL}${endpoint}`;
      const response = await axios.post(url, payload);

      // ✅ Show success notification
      Toast.fire({
        icon: "success",
        title: response.data.message || "Action performed successfully!",
      });
    } catch (error) {
      console.error("Error performing action:", error);

      // ✅ Show error notification
      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to perform action. Try again!",
      });
    }
    setLoadingAction(null);
  };

  const refreshPerformanceData = async () => {
    setLoadingPerformance(true);
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/admin-action/device-performance/${id}`
      );
      const raw = res.data.data;
      const transformed = [
        { title: "CPU Usage", value: raw.CPU, key: "cpu" },
        { title: "RAM Usage", value: raw.MEMORY, key: "ram" },
        { title: "Disk Usage", value: raw.DISK, key: "disk" },
        { title: "GPU Usage", value: raw.GPU, key: "gpu" },
        { title: "Last Reboot", value: raw.LAST_REBOOTED, key: "reboot" },
      ];
      setPerformanceData(transformed);
    } catch (err) {
      console.error("Error refreshing performance data", err);
    } finally {
      setLoadingPerformance(false);
    }
  };

  const refreshDeviceInfo = async () => {
    setLoadingDeviceInfo(true);
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/admin-action/device-info/${id}`
      );
      setDeviceInfo(res.data.data);
    } catch (err) {
      console.error("Error refreshing software list", err);
    } finally {
      setLoadingDeviceInfo(false);
    }
  };

  const refreshSoftwareList = async () => {
    setLoadingSoftware(true);
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/admin-action/software-list/${id}`
      );
      setSoftwareList(res.data.data);
    } catch (err) {
      console.error("Error refreshing software list", err);
    } finally {
      setLoadingSoftware(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
    fetchSoftwareList();
    fetchDeviceInfo();
  }, []);

  const iconMap = {
    cpu: Cpu,
    ram: MemoryStick,
    disk: HardDrive,
    gpu: Monitor,
    reboot: RefreshCcw,
  };

  return (
    <div className="min-h-screen bg-white p-3">
      <h1 className="text-lg font-semibold text-gray-600 border-b pb-2 mt-1">
        <span
          className="cursor-pointer text-gray-600 hover:underline"
          onClick={handleBackNavigation}
        >
          {deviceInfo?.DEVICE_OWNER?.split("\\")[0]}
        </span>
        {"\\" + deviceInfo?.DEVICE_OWNER?.split("\\")[1]}
      </h1>

      <div className="flex flex-col lg:flex-row mt-4 space-x-0 lg:space-x-8">
        {/* Left Panel */}
        {/* Device Info */}
        {loadingDeviceInfo ? (
          <DeviceInfoSkeleton />
        ) : (
          <div className="w-full lg:w-1/4 pb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-medium text-gray-600">
                Device Info
              </h2>
              <button
                onClick={refreshDeviceInfo}
                className="text-blue-600  flex items-center gap-1 hover:underline text-xs"
              >
                <RefreshCcw size={12} />
                Refresh
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={profile}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                  <span>
                    {deviceInfo?.DEVICE_OWNER
                      ? deviceInfo.DEVICE_OWNER.replace(/^ITRADIANT\\/, "")
                      : "Unknown User"}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {deviceInfo?.USER_EMAIL}
                </div>
              </div>

              <div className="w-full px-4 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Device Owner:</span>
                  <span className="font-medium">
                    {deviceInfo?.DEVICE_OWNER
                      ? deviceInfo.DEVICE_OWNER.replace(/^ITRADIANT\\/, "")
                      : ""}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Hostname:</span>
                  <span className="font-medium">{deviceInfo?.HOSTNAME}</span>
                </div>
                <div className="flex justify-between">
                  <span>Device Model:</span>
                  <span className="font-medium">
                    {deviceInfo?.DEVICE_MODEL}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Serial Number:</span>
                  <span className="font-medium">{deviceInfo?.SERIAL_NO}</span>
                </div>
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <span className="font-medium">{deviceInfo?.Domain}</span>
                </div>
                <div className="flex justify-between">
                  <span>OS:</span>
                  <span className="font-medium">{deviceInfo?.OS}</span>
                </div>
                <div className="flex justify-between">
                  <span>Users:</span>
                  <span className="font-medium">{deviceInfo?.DeviceUsers}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full px-4 pt-4">
                {actions.map(({ name, endpoint }) => (
                  <button
                    key={name}
                    onClick={() => handleAction(name, endpoint)}
                    className="text-xs bg-gray-900 hover:bg-gray-700 text-white px-2 py-1 rounded shadow"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Panel */}
        <div className="w-full lg:w-3/4 space-y-8">
          {/* Performance Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-medium text-gray-600">
                Device Performance
              </h2>
              <button
                onClick={refreshPerformanceData}
                className="text-blue-600 flex items-center gap-1 hover:underline text-xs"
              >
                <RefreshCcw size={12} />
                Refresh
              </button>
            </div>
            {loadingPerformance ? (
              <PerformanceSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performanceData.map(({ title, value, key }) => {
                  const Icon = iconMap[key] || Cpu;

                  // Check if value ends with %
                  const isPercentage =
                    typeof value === "string" && value.trim().endsWith("%");

                  // Default text color
                  let valueColor = "";

                  if (isPercentage) {
                    const percentage = parseInt(value.replace("%", "").trim());
                    if (percentage >= 80) {
                      valueColor = "text-red-600";
                    } else if (percentage >= 50) {
                      valueColor = "text-yellow-500";
                    } else {
                      valueColor = "text-green-600";
                    }
                  } else {
                    valueColor = "text-gray-600";
                  }

                  return (
                    <div
                      key={title}
                      className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4"
                    >
                      <div className="bg-gray-100 p-3 rounded-full">
                        <Icon className="w-6 h-6 text-gray-900" />
                      </div>
                      <div>
                        <h4 className="text-gray-600 text-sm">{title}</h4>
                        <p className={`text-sm font-semibold ${valueColor}`}>
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Software List Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-medium text-gray-600">
                Software List
              </h2>
              <button
                onClick={refreshSoftwareList}
                className="text-blue-600 flex items-center gap-1 hover:underline text-xs"
              >
                <RefreshCcw size={12} />
                Refresh
              </button>
            </div>
            {loadingSoftware ? (
              <SoftwareListSkeleton />
            ) : (
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
                    {softwareList.map((sw, idx) => {
                      const formattedDate = sw.INSTALL_DATE
                        ? `${sw.INSTALL_DATE.slice(
                            0,
                            4
                          )}-${sw.INSTALL_DATE.slice(
                            4,
                            6
                          )}-${sw.INSTALL_DATE.slice(6)}`
                        : "N/A";

                      return (
                        <tr
                          key={idx}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          <td className="p-3">{sw.SOFTWARE_NAME}</td>
                          <td className="p-3">{sw.VERSION}</td>
                          <td className="p-3">{sw.PUBLISHER}</td>
                          <td className="p-3 text-nowrap">{formattedDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal with Glassmorphism */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm  bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">{selectedAction?.name}</h3>
            <textarea
              className="w-full border p-2 rounded text-sm"
              rows={3}
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="text-sm bg-gray-200 px-3 py-1 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                onClick={submitAction}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

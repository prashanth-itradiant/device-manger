import React from "react";
import Chart from "react-apexcharts";
import { CircleUser } from "lucide-react";

const Dashboard = () => {
  const activeUsers = 10;
  const inactiveUsers = 2;
  const totalUsers = activeUsers + inactiveUsers;

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Active", "Inactive"],
    colors: ["#6B7280", "#D1D5DB"], // Gray palette
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        colors: ["#fff"],
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} users`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chartSeries = [activeUsers, inactiveUsers];

  return (
    <div className="p-6 flex flex-col items-center w-full bg-gray-50 min-h-screen">
      <div className="bg-white p-6 shadow-lg rounded-2xl flex flex-col items-center gap-4 w-full md:w-2/3">
        {/* Icon + Title */}
        <div className="flex items-center gap-2">
          <CircleUser size={25} className="text-gray-600 mb-1" />
          <h2 className="text-2xl font-semibold text-gray-700">User Chart</h2>
        </div>

        {/* Chart + Stats Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full mt-4">
          {/* Apex Donut Chart */}
          <div className="w-full md:w-1/2">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              width="100%"
            />
          </div>

          {/* Labels beside the chart */}
          <div className="flex flex-col text-center md:text-left space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#6B7280" }}
              ></div>
              <span className="font-medium text-gray-700">Active Users:</span>
              <span className="text-gray-800 font-semibold">{activeUsers}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#D1D5DB" }}
              ></div>
              <span className="font-medium text-gray-700">Inactive Users:</span>
              <span className="text-gray-800 font-semibold">
                {inactiveUsers}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span className="font-medium text-gray-700">Total Users:</span>
              <span className="text-gray-800 font-semibold">{totalUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

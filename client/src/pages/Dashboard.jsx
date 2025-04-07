import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CircleUser } from "lucide-react";

const Dashboard = () => {
  const activeUsers = 10;
  const inactiveUsers = 2;
  const totalUsers = activeUsers + inactiveUsers;

  const pieData = [
    { name: "Active", value: activeUsers, color: "#34D399" }, // teal green
    { name: "Inactive", value: inactiveUsers, color: "#F87171" }, // soft red
  ];

  return (
    <div className="p-6 flex flex-col items-center w-full bg-gray-50 min-h-screen">
      <div className="bg-white p-6 shadow-lg rounded-2xl flex flex-col items-center gap-4 w-full md:w-2/3">
        {/* Icon + Title */}
        <div className="flex items-center">
          <CircleUser size={32} className="text-indigo-600 mb-1" />
          <h2 className="text-2xl font-semibold text-gray-800">User Chart</h2>
        </div>

        {/* Chart + Stats Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full mt-4">
          {/* Donut Chart */}
          <div className="w-full md:w-1/2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  label={({ name }) => `${name}`}
                  labelLine={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Labels beside the chart */}
          <div className="flex flex-col text-center md:text-left space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#34D399" }}
              ></div>
              <span className="font-medium text-gray-700">Active Users:</span>
              <span className="text-gray-800 font-semibold">{activeUsers}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#F87171" }}
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

import { Icon } from "lucide-react";

const PerformanceCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center space-x-4">
    <div className="bg-gray-100 p-3 rounded-full">
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    <div>
      <h4 className="text-gray-600 text-sm">{title}</h4>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default PerformanceCard;

import DashboardLayout from "./layout";
import {
  FiBell,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiSettings,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import DashboardGuard from "./components/DashboardGuard";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      message: "Gig #102 is pending approval",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    },
    {
      id: 2,
      message: "Gig #89 is scheduled for deletion",
      type: "danger",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: 3,
      message: "New feature rollout successful",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: 4,
      message: "System maintenance scheduled for Sunday at 2 AM",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ];

  const typeStyles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-400",
      text: "text-blue-800",
      icon: <FiInfo className="text-blue-500 mt-1" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      text: "text-yellow-800",
      icon: <FiAlertTriangle className="text-yellow-500 mt-1" />,
    },
    danger: {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-800",
      icon: <FiXCircle className="text-red-500 mt-1" />,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-400",
      text: "text-green-800",
      icon: <FiCheckCircle className="text-green-500 mt-1" />,
    },
    default: {
      bg: "bg-gray-50",
      border: "border-gray-300",
      text: "text-gray-800",
      icon: <FiSettings className="text-gray-500 mt-1" />,
    },
  };

  return (
    <DashboardGuard>
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FiBell className="text-3xl text-blue-600" />
          <h2 className="text-2xl font-semibold">Notifications</h2>
        </div>

        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map(({ id, message, type, timestamp }) => {
              const style = typeStyles[type] || typeStyles.default;
              return (
                <li
                  key={id}
                  className={`flex items-start gap-3 p-4 rounded-md border-l-4 shadow-sm transition-all duration-200 ${style.bg} ${style.border}`}
                >
                  {style.icon}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${style.text}`}>
                      {message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 italic">You have no notifications.</p>
        )}
      </div>
    </DashboardLayout>
    </DashboardGuard>
  );
}
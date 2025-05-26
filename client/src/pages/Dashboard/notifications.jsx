import DashboardLayout from "./layout";
import { FiBell } from "react-icons/fi";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      message: "Gig #102 is pending approval",
      type: "warning",
    },
    {
      id: 2,
      message: "Gig #89 is scheduled for deletion",
      type: "danger",
    },
  ];

  const getNotificationStyle = (type) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800";
      case "danger":
        return "bg-red-50 border-l-4 border-red-400 text-red-800";
      default:
        return "bg-gray-50 border-l-4 border-gray-300 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FiBell className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-semibold">Notifications</h2>
        </div>

        {notifications.length > 0 ? (
          <ul className="space-y-3">
            {notifications.map(({ id, message, type }) => (
              <li
                key={id}
                className={`${getNotificationStyle(
                  type
                )} p-4 rounded shadow-sm flex items-start`}
              >
                <span className="text-sm font-medium">{message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">You have no notifications.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

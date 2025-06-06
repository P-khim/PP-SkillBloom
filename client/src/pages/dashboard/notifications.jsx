"use client";

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
import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnapprovedGigs = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8747/api/gigs/unapproved",
        { withCredentials: true }
      );
      const dynamicNotifications = data.gigs.map((gig) => ({
        id: gig.id,
        title: gig.title,
        message: `Gig "${gig.title}" is pending approval.`,
        type: "warning",
        timestamp: new Date(gig.createdAt),
      }));
      setNotifications(dynamicNotifications);
    } catch (error) {
      console.error("Failed to fetch unapproved gigs", error);
    }
  };

  const handleAction = async (gigId, action) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8747/api/gigs/${action}/${gigId}`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) => prev.filter((n) => n.id !== gigId));
    } catch (error) {
      console.error(`Failed to ${action} gig`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnapprovedGigs();
  }, []);

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
              {notifications.map(({ id, title, message, type, timestamp }) => {
                const style = typeStyles[type] || typeStyles.default;
                return (
                  <li
                    key={id}
                    className={`flex flex-col md:flex-row md:items-start gap-3 p-4 rounded-md border-l-4 shadow-sm transition-all duration-200 ${style.bg} ${style.border}`}
                  >
                    <div>{style.icon}</div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${style.text}`}>
                        {message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          disabled={loading}
                          onClick={() => handleAction(id, "approve")}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          disabled={loading}
                          onClick={() => handleAction(id, "reject")}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
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

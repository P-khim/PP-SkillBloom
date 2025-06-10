"use client";

import DashboardLayout from "./layout";
import {
  FiBell,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiSettings,
  FiEye,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import DashboardGuard from "./components/DashboardGuard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationsDelete, setNotificationsDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [selectedQrOrder, setSelectedQrOrder] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

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
        isDeleteRequest: false,
      }));
      setNotifications(dynamicNotifications);
    } catch (error) {
      console.error("Failed to fetch unapproved gigs", error);
    }
  };

  const fetchUnapprovedGigsDelete = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8747/api/gigs/unapproved-delete",
        { withCredentials: true }
      );
      const dynamicNotifications = data.gigs.map((gig) => ({
        id: gig.id,
        title: gig.title,
        message: `Gig "${gig.title}" is requested for deletion.`,
        type: "danger",
        timestamp: new Date(gig.createdAt),
        isDeleteRequest: true,
      }));
      setNotificationsDelete(dynamicNotifications);
    } catch (error) {
      console.error("Failed to fetch unapproved delete gigs", error);
    }
  };

  const fetchUnpaidOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8747/api/gigs/unpaid-orders",
        { withCredentials: true }
      );
      const qrOrderNotifications = data.map((order) => ({
        id: order.id,
        title: `Order ${order.id}`,
        message: `Order ${order.id} has unpaid QR`,
        type: "success",
        timestamp: new Date(order.createdAt),
        isQrOrder: true,
        qrImage: order.qrImage, // assuming API returns this
        price: order.price,
      }));
      setUnpaidOrders(qrOrderNotifications);
      console.log(unpaidOrders);
    } catch (error) {
      console.error("Failed to fetch unpaid QR", error);
    }
  };

  const handleAction = async (gigId, action, isDeleteRequest = false) => {
    setLoading(true);
    try {
      const routeAction = isDeleteRequest
        ? `${action}-delete`
        : action;
      await axios.put(
        `http://localhost:8747/api/gigs/${routeAction}/${gigId}`,
        {},
        { withCredentials: true }
      );

      if (isDeleteRequest) {
        setNotificationsDelete((prev) => prev.filter((n) => n.id !== gigId));
      } else {
        setNotifications((prev) => prev.filter((n) => n.id !== gigId));
      }
    } catch (error) {
      console.error(`Failed to ${action} gig`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleQrAction = async (orderId, action) => {
    setLoading(true);
    try {
      let url = "";

      if (action === "paid") {
        url = `http://localhost:8747/api/gigs/mark-paid/${orderId}`;
      } else if (action === "reject") {
        url = `http://localhost:8747/api/gigs/reject-order/${orderId}`;
      } else {
        throw new Error("Unknown action");
      }

      await axios.put(url, {}, { withCredentials: true });
      setUnpaidOrders((prev) => prev.filter((n) => n.id !== orderId));
      setShowQrModal(false);
    } catch (error) {
      console.error(`Failed to ${action} QR order`, error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUnapprovedGigs();
    fetchUnapprovedGigsDelete();
    fetchUnpaidOrders();
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

  const allNotifications = [
    ...notifications,
    ...notificationsDelete,
    ...unpaidOrders,
  ];

  let price = 0;
  let commissionRate = 0.08;
  let priceToPay = 0;
  if(selectedQrOrder && selectedQrOrder.price) {
    price = Number(selectedQrOrder.price);
    priceToPay = (price - price * commissionRate).toFixed(2);
  }

  return (
    <DashboardGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <FiBell className="text-3xl text-blue-600" />
            <h2 className="text-2xl font-semibold">Notifications</h2>
          </div>

          {allNotifications.length > 0 ? (
            <ul className="space-y-4">
              {allNotifications.map(
                ({
                  id,
                  title,
                  message,
                  type,
                  timestamp,
                  isDeleteRequest,
                  isQrOrder,
                  qrImage,
                }) => {
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
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {isQrOrder ? (
                            <>
                              <button
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                  const order = unpaidOrders.find((o) => o.id === id);
                                  if (order) {
                                    setSelectedQrOrder(order);
                                    setShowQrModal(true);
                                  } else {
                                    console.warn(`Order with ID ${id} not found`);
                                  }
                                }}
                              >
                                <FiEye /> View QR
                              </button>

                              <button
                                disabled={loading}
                                onClick={() => handleQrAction(id, "paid")}
                                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                PAID
                              </button>
                              <button
                                disabled={loading}
                                onClick={() => handleQrAction(id, "reject")}
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                disabled={loading}
                                onClick={() =>
                                  handleAction(id, "approve", isDeleteRequest)
                                }
                                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                disabled={loading}
                                onClick={() =>
                                  handleAction(id, "reject", isDeleteRequest)
                                }
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          ) : (
            <p className="text-gray-500 italic">You have no notifications.</p>
          )}
        </div>

        {showQrModal && selectedQrOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
              <h3 className="text-lg font-semibold mb-4">
                QR Code for Order #{selectedQrOrder.id}
              </h3>
              <h4>Original price: {price} $</h4>
              <h4>Skillbloom commission: 8%</h4>
              <h4>Price to pay: {priceToPay} $</h4>
              <img
                src={`http://localhost:8747/${selectedQrOrder.qrImage}`}
                alt={`QR for order ${selectedQrOrder.id}`}
                className="w-full object-contain"
              />
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                onClick={() => setShowQrModal(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </DashboardLayout>
    </DashboardGuard>
  );
}

import { useStateProvider } from "../../../context/StateContext";
import {
  GET_SELLER_ORDERS_ROUTE,
  SELLER_AGREE_ROUTE,
  SELLER_CANCEL_ROUTE,
} from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [modalMessage, setModalMessage] = useState("");
  const [qrFiles, setQrFiles] = useState({});

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await axios.get(GET_SELLER_ORDERS_ROUTE, {
          withCredentials: true,
        });
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  const handleSellerAgree = async (orderId) => {
    try {
      await axios.put(
        SELLER_AGREE_ROUTE,
        { orderId },
        { withCredentials: true }
      );
      // Refresh orders after agree
      const { data } = await axios.get(GET_SELLER_ORDERS_ROUTE, {
        withCredentials: true,
      });
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to agree order:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(
        SELLER_CANCEL_ROUTE,
        { orderId },
        { withCredentials: true }
      );
      // Refresh orders after cancel
      const { data } = await axios.get(GET_SELLER_ORDERS_ROUTE, {
        withCredentials: true,
      });
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const openConfirmModal = (message, actionFn) => {
    setModalMessage(message);
    setConfirmAction(() => () => {
      actionFn();
    });
    setIsModalOpen(true);
  }

  const handleQrFileChange = (orderId, event) => {
    setQrFiles((prev) => ({
      ...prev,
      [orderId]: event.target.files[0],
    }));
  };

  const handleUploadQr = async (orderId) => {
    if (!qrFiles[orderId]) return alert("Please select a QR file first.");

    const formData = new FormData();
    formData.append("qrImage", qrFiles[orderId]);
    formData.append("orderId", orderId);

    try {
      // Replace with your actual QR upload API route
      await axios.post('http://localhost:8747/api/auth/qr-upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("QR uploaded successfully!");
      // Optionally, refresh orders or reset input
      setQrFiles((prev) => ({ ...prev, [orderId]: null }));

      // Refresh orders here:
      const { data } = await axios.get(GET_SELLER_ORDERS_ROUTE, {
        withCredentials: true,
      });
    setOrders(data.orders);
    } catch (err) {
      console.error("QR upload failed", err);
      alert("Failed to upload QR.");
    }
  };

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Orders</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Order Id</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Delivery Time</th>
              <th className="px-6 py-3">Ordered By</th>
              <th className="px-6 py-3">Order Date</th>
              <th className="px-6 py-3">Send Message</th>
              <th className="px-6 py-3">Order Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                key={order.id}
              >
                <th className="px-6 py-4">{order.id}</th>
                <th className="px-6 py-4 font-medium">{order.gig.title}</th>
                <td className="px-6 py-4">{order.gig.category}</td>
                <td className="px-6 py-4">{order.price}</td>
                <td className="px-6 py-4">{order.gig.deliveryTime}</td>
                <td className="px-6 py-4">
                  {order.buyer.fullName} ({order.buyer.username})
                </td>
                <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/seller/orders/messages/${order.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Send
                  </Link>
                </td>
                <td className="px-6 py-4">{order.status}</td>
                <td className="px-6 py-4">
                  {order.status === "COMPLETED" ? (
                    order.qrImage ? (
                      <span className="text-green-600 font-semibold">QR uploaded</span>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleQrFileChange(order.id, e)}
                          className="mb-1"
                        />
                        <button
                          onClick={() => handleUploadQr(order.id)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                          disabled={!qrFiles[order.id]}
                        >
                          Upload
                        </button>
                      </>
                    )
                  ) : (
                    <span className="text-gray-500 italic text-sm">Upload your QR Code upon completion</span>
                  )}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {order.status === "ONGOING" && (
                    <>
                      <button
                        onClick={() =>
                          openConfirmModal(
                            "Are you sure you want to agree to complete this order?",
                            () => handleSellerAgree(order.id)
                          )
                        }
                        disabled={order.sellerAgreed}
                        className={`px-2 py-1 rounded text-white ${
                          order.sellerAgreed
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {order.sellerAgreed ? "Agreed" : "Agree Complete"}
                      </button>
                      <button
                        onClick={() =>
                          openConfirmModal("Are you sure you want to cancel this order?", () => handleCancelOrder(order.id))
                        }
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <ConfirmModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onConfirm={confirmAction}
          message={modalMessage}
        />
    </div>
  );
}

export default Orders;

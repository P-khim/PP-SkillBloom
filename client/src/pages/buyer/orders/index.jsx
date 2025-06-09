import { useStateProvider } from "../../../context/StateContext";
import {
  GET_BUYER_ORDERS_ROUTE,
  BUYER_AGREE_ROUTE,
  BUYER_CANCEL_ROUTE,
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

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, {
          withCredentials: true,
        });
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  const handleBuyerAgree = async (orderId) => {
    try {
      await axios.put(
        BUYER_AGREE_ROUTE,
        { orderId, userId: userInfo.id },
        { withCredentials: true }
      );
      // Refresh orders after agree
      const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, {
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
        BUYER_CANCEL_ROUTE,
        { orderId },
        { withCredentials: true }
      );
      // Refresh orders after cancel
      const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, {
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

  return (
    <div className="min-h-[80vh] my-10 mt-28 px-32">
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
                <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/buyer/orders/messages/${order.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Send
                  </Link>
                </td>
                <td className="px-6 py-4">{order.status}</td>
                <td className="px-6 py-4 flex gap-2">
                  {order.status === "ONGOING" && (
                    <>
                      <button
                        onClick={() => openConfirmModal("Are you sure you want to agree to complete this order?", ()=> handleBuyerAgree(order.id)) }
                        className={`px-2 py-1 bg-green-500 text-white rounded
                          ${order.buyerAgreed
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                          }`}
                      >
                        {order.buyerAgreed ? "Agreed" : "Agree Complete"}
                      </button>
                      <button
                        onClick={() => openConfirmModal("Are you sure you want to cancel this order?", () => handleCancelOrder(order.id)) }
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

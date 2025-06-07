import { Router } from "express";

import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  confirmOrder,
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  buyerAgreeComplete,
  sellerAgreeComplete,
  buyerCancelOrder,
  sellerCancelOrder,
} from "../controllers/OrdersControllers.js";

export const orderRoutes = Router();

orderRoutes.post("/create", verifyToken, createOrder);
orderRoutes.put("/success", verifyToken, confirmOrder);
orderRoutes.get("/get-buyer-orders", verifyToken, getBuyerOrders);
orderRoutes.get("/get-seller-orders", verifyToken, getSellerOrders);
// New routes to handle buyer/seller agree & cancel:
orderRoutes.put("/buyer-agree",  buyerAgreeComplete);
orderRoutes.put("/seller-agree",  sellerAgreeComplete);
orderRoutes.put("/buyer-cancel",  buyerCancelOrder);
orderRoutes.put("/seller-cancel",  sellerCancelOrder);
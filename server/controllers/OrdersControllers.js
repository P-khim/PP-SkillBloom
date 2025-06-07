import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51REiyXCvyJcIgd5qd3mtsY6dws3GrFYuPsrjQRvTwOnIjxibArNUf7sjINYxVPvZUTBAe3du1d6G1UfqmiOJDirt000ZWKKV5P"
);

export const createOrder = async (req, res, next) => {
  try {
    if (req.body.gigId) {
      const { gigId } = req.body;
      const prisma = new PrismaClient();
      const gig = await prisma.gigs.findUnique({
        where: { id: parseInt(gigId) },
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: gig?.price * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      await prisma.orders.create({
        data: {
          paymentIntent: paymentIntent.id,
          price: gig?.price,
          buyer: { connect: { id: req?.userId } },
          gig: { connect: { id: gig?.id } },
        },
      });
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(400).send("Gig id is required.");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    if (req.body.paymentIntent) {
      const prisma = new PrismaClient();
      await prisma.orders.update({
        where: { paymentIntent: req.body.paymentIntent },
        data: { isCompleted: true },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getBuyerOrders = async (req, res, next) => {
  try {
    if (req.userId) {
      const prisma = new PrismaClient();
      const orders = await prisma.orders.findMany({
        where: { buyerId: req.userId, isCompleted: true },
        include: { gig: true },
      });
      return res.status(200).json({ orders });
    }
    return res.status(400).send("User id is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    if (req.userId) {
      const prisma = new PrismaClient();
      const orders = await prisma.orders.findMany({
        where: {
          gig: {
            createdBy: {
              id: parseInt(req.userId),
            },
          },
          isCompleted: true,
        },
        include: {
          gig: true,
          buyer: true,
        },
      });
      return res.status(200).json({ orders });
    }
    return res.status(400).send("User id is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

const prisma = new PrismaClient();

export const buyerAgreeComplete = async (req, res) => {
  try {
    console.log("buyerAgreeComplete userId:", req.userId);
    console.log("buyerAgreeComplete req.body:", req.body);

    const { orderId, userId } = req.body;
    //const userId = req.userId;

    if (!orderId) return res.status(400).send("Order ID is required");

    // Fetch order and verify buyer owns it
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(orderId) },
    });
    if (!order) return res.status(404).send("Order not found");
    if (order.buyerId !== userId)
      return res.status(403).send("Not authorized");

    // If seller already agreed, mark complete
    if (order.sellerAgreed) {
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          buyerAgreed: true,
          buyerAgreedAt: new Date(),
          sellerAgreed: true, // already true
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
      return res.status(200).send("Order marked as completed by buyer agreement");
    } else {
      // Just mark buyer agreed
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          buyerAgreed: true,
          buyerAgreedAt: new Date(),
        },
      });
      return res.status(200).send("Buyer agreed to complete order");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const sellerAgreeComplete = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    if (!orderId) return res.status(400).send("Order ID is required");

    // Fetch order with gig and verify seller owns gig
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(orderId) },
      include: { gig: true },
    });
    if (!order) return res.status(404).send("Order not found");
    if (order.gig.createdBy !== userId) // assuming gig.createdBy is userId of seller
      return res.status(403).send("Not authorized");

    // If buyer already agreed, mark complete
    if (order.buyerAgreed) {
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          sellerAgreed: true,
          sellerAgreedAt: new Date(),
          buyerAgreed: true, // already true
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
      return res.status(200).send("Order marked as completed by seller agreement");
    } else {
      // Just mark seller agreed
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          sellerAgreed: true,
          sellerAgreedAt: new Date(),
        },
      });
      return res.status(200).send("Seller agreed to complete order");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const buyerCancelOrder = async (req, res) => {
  try {
    const { orderId, cancelReason } = req.body;
    const userId = req.userId;

    if (!orderId) return res.status(400).send("Order ID is required");

    const order = await prisma.orders.findUnique({
      where: { id: parseInt(orderId) },
    });
    if (!order) return res.status(404).send("Order not found");
    if (order.buyerId !== userId)
      return res.status(403).send("Not authorized");

    await prisma.orders.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        cancelReason: cancelReason || "Cancelled by buyer",
      },
    });
    return res.status(200).send("Order cancelled by buyer");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const sellerCancelOrder = async (req, res) => {
  try {
    const { orderId, cancelReason } = req.body;
    const userId = req.userId;

    if (!orderId) return res.status(400).send("Order ID is required");

    const order = await prisma.orders.findUnique({
      where: { id: parseInt(orderId) },
      include: { gig: true },
    });
    if (!order) return res.status(404).send("Order not found");
    if (order.gig.createdBy !== userId)
      return res.status(403).send("Not authorized");

    await prisma.orders.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        cancelReason: cancelReason || "Cancelled by seller",
      },
    });
    return res.status(200).send("Order cancelled by seller");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
import { Request, Response } from "express";
import Order from "../models/Orders";
import CItem from "../models/itemCart";

const orderController = {
 

  create: async (req: Request, res: Response) => {
    try {
      const {
        orderId,
        customerId,
        email,
        items,
        discountedPrice,
        discount,
        // cartItems, // Array of cart items to be created
        totalAmount,
        orderStatus,
        orderDate,
        deliveryDate,
        timeSlot,
        customer,
        isOnlineOrder,
        qrCode,
        notifications,
      } = req.body;
     
      
      const missingFields = [];
      if (!orderId) missingFields.push("orderId");
      if (!customerId) missingFields.push("customerId");
      if (!items) missingFields.push("items");

      // if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0)
      //   missingFields.push("cartItems");
      if (!totalAmount) missingFields.push("totalAmount");
      if (!orderStatus) missingFields.push("orderStatus");
      if (!isOnlineOrder) missingFields.push("isOnlineOrder");
      if (!qrCode) missingFields.push("qrCode");
      if (!email) missingFields.push("email");
      
      console.log(missingFields);
      

      if (missingFields.length > 0) {
        return res
          .status(400)
          .json({ message: "Missing required order data", missingFields });
      }

      const existingOrder = await Order.findOne({ orderId }).exec();
      if (existingOrder) {
        return res.status(409).json({ message: "Order ID must be unique" });
      }

      // Create Cart Items and store their IDs
      // const createdCartItems = [];
      // for (const item of cartItems) {
      //   const newCartItem = new CItem(item);
      //   const savedCartItem = await newCartItem.save();
      //   createdCartItems.push(savedCartItem._id);
      // }
    
      const newOrder = new Order({
        orderId,
        customerId,
        email,
        items,
   
        // cartItems: createdCartItems, // Link cart item IDs to the order
        discountedPrice,
        discount,
        totalAmount,
        orderStatus,
        orderDate: orderDate || new Date(),
        deliveryDate,
        timeSlot,
        customer,
        isOnlineOrder,
        qrCode,
        notifications: notifications || [],
      });

      await newOrder.save();
      return res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error order", error: err.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const order = await Order.findById(id).exec();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.orderStatus === "processing" || order.orderStatus === "preparing" ) {
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
          new: true,
        }).exec();
        return res.status(200).json(updatedOrder);
      } else {
        return res
          .status(400)
          .json({ message: "Order cannot be updated after cancelled" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },
     
     
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const order = await Order.findById(id).exec();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.orderStatus === "processing") {
        await Order.findByIdAndDelete(id).exec();
        return res.status(200).json({ message: "Order deleted successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "Order cannot be cancelled after preparation" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  getOrder: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      

      const order = await Order.findById(id).populate("cartItems").exec();

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(order);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  getAllOrders: async (req: Request, res: Response) => {
    try {
      const orders = await Order.find().exec();
      return res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  verifyQRCode: async (req: Request, res: Response) => {
    try {
      const { qrCode } = req.body;

      // need to update the logic as needed

      const order = await Order.findOne({ qrCode }).exec();

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "QR Code verified", order });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },
};

export default orderController;

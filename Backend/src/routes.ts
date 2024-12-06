import { Router } from "express";

// Models
import adonController from "./controllers/adon.controller";
import itemController from "./controllers/item.controller";
import orderController from "./controllers/order.controller";
import userController from "./controllers/user.controller";
import cartItemController from "./controllers/cartItem.controller";
import couponController from "./controllers/coupon.controller";
import { createFeedback, getFeedbacks, respondToFeedback, deleteFeedback } from './controllers/feedback.controller';
import couponMiddleware from "./middleware/couponMiddleware";

const routes = Router();

// Users
routes.get("/users", userController.select as any);
routes.get("/users/:id", userController.select as any);
routes.post("/register", userController.create as any);

// Login
routes.post("/login", userController.login as any);
routes.post("/verify_token", userController.verifyToken as any);

// Orders
routes.post("/create_order",orderController.create as any); // Middleware added here
routes.put("/orders/:id",orderController.update as any); // Middleware added here
routes.delete("/orders/:id", orderController.delete as any);
routes.get("/orders/:id", orderController.getOrder as any);
routes.get("/orders", orderController.getAllOrders as any);
routes.post("/verify_qr_code", orderController.verifyQRCode as any);

// Items
routes.post("/items", itemController.create as any);
routes.put("/items/:id", itemController.update as any);
routes.delete("/items/:id", itemController.delete as any);
routes.get("/items/:id", itemController.getItem as any);
routes.get("/items", itemController.getAllItems as any);
routes.post("/items/:id/decrease_stock", itemController.decreaseStock as any);
routes.get("/items/active", itemController.findActiveItems as any);

// Cart Item
routes.post("/cart_item", cartItemController.create as any);
routes.put("/cart_item/:id", cartItemController.update as any);
routes.delete("/cart_item/:id",cartItemController.delete as any);
routes.get("/cart_item/:id", cartItemController.getItem as any);
routes.get("/cart_item", cartItemController.getAllItems as any);
routes.delete("/cart_item", cartItemController.deleteAllItems as any);

// Coupon Item
routes.post("/coupon", couponController.create as any);
routes.put("/coupon/:id", couponController.update as any);
routes.delete("/coupon/:id", couponController.delete as any);
routes.get("/coupon/:id", couponController.getCoupon as any);
routes.get("/coupon", couponController.getAllCoupons as any);
routes.post("/apply_coupon", couponMiddleware as any, couponController.applyCoupon as any);

// Route to create feedback
routes.post('/feedback', createFeedback as any);

// Route to get all feedbacks
routes.get('/feedbacks', getFeedbacks as any);

// Route to respond to feedback
routes.put('/feedback/:id/respond', respondToFeedback as any);



// Route to delete feedback
routes.delete('/feedback/:id', deleteFeedback as any);




// Start Generation Here
// Adons
routes.post("/adons", adonController.createAdon as any);
routes.get("/adons", adonController.getAllAdons as any);
routes.get("/adons/:id", adonController.getAdonById as any);
routes.put("/adons/:id", adonController.updateAdon as any);
routes.delete("/adons/:id", adonController.deleteAdon as any);

export default routes;

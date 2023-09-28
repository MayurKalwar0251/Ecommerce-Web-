import express from "express";
import { authorizedRoles, isAuthenticated } from "../middlewares/auth.js";
import {
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  newOrder,
  updateStatus,
} from "../controllers/orderControllers.js";

export const orderRouter = express.Router();
orderRouter
  .route("/orders")
  .get(isAuthenticated, authorizedRoles("admin"), getAllOrders);

orderRouter
  .route("/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateStatus)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteOrder);

orderRouter.route("/new").post(isAuthenticated, newOrder);
orderRouter.route("/me").get(isAuthenticated, getMyOrders);
orderRouter.route("/:orderId").get(isAuthenticated, getSingleOrder);

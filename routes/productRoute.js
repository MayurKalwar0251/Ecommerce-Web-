import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getProductReview,
  getSIngleProduct,
  productRev,
  updateProduct,
} from "../controllers/productControllers.js";
import { authorizedRoles, isAuthenticated } from "../middlewares/auth.js";

export const productRouter = express.Router();

productRouter.route("/allreview").get(getProductReview);
productRouter.route("/allProduct").get(getAllProducts);

productRouter
  .route("/new")
  .post(isAuthenticated, authorizedRoles("admin"), createProduct);
productRouter
  .route("/review")
  .put(isAuthenticated, productRev)
  .delete(isAuthenticated, deleteReview);
productRouter
  .route("/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteProduct)
  .get(isAuthenticated, getSIngleProduct);

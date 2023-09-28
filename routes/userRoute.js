import express from "express";
import {
  allUsers,
  deleteUser,
  forgotPassword,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  singleUserDetails,
  updatePassword,
  updateProfile,
  updateRole,
} from "../controllers/userConstrollers.js";
import { authorizedRoles, isAuthenticated } from "../middlewares/auth.js";

export const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);

userRouter.route("/password/forgot").get(forgotPassword);
userRouter.route("/me").get(isAuthenticated, getUserDetails);
userRouter.route("/password/update").put(isAuthenticated, updatePassword);

userRouter.route("/me/update").put(isAuthenticated, updateProfile);

userRouter
  .route("/admin/allusers")
  .get(isAuthenticated, authorizedRoles("admin"), allUsers);
userRouter
  .route("/admin/user/:id")
  .get(isAuthenticated, singleUserDetails)
  .put(isAuthenticated, authorizedRoles("admin"), updateRole)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteUser);

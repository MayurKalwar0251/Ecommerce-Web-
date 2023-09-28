import jwt from "jsonwebtoken";
import catchAsyncErrors from "./catchAsyncErrors.js";

import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Login First" });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedData.id);

  req.user = user;

  next();
});

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(roles);
      return res
        .status(401)
        .json({ success: false, message: "Only admin can acces this route" });
    }
    next();
  };
};

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { Order } from "../models/orderModel.js";
import { product } from "../models/productModel.js";

export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(200).json({
    success: true,
    message: order,
  });
});

export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: order,
  });
});

export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: orders,
  });
});

// Get All Orders --admin
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalPrice = 0;

  orders.forEach((order) => {
    totalPrice += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalPrice,
    orders,
  });
});

// Update order status
export const updateStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (order.orderStatus === "Delievered") {
    return next(new ErrorHandler("Product already delievered", 404));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const updateProduct = await product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  updateProduct.stock -= quantity;

  await updateProduct.save({ validateBeforeSave: false });
}

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Product not found", 404));
  }

  order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Deleted",
  });
});

import express from "express";
import { productRouter } from "./routes/productRoute.js";
import { orderRouter } from "./routes/orderRoute.js";

const app = express();
import { config } from "dotenv";
import { connectDb } from "./config/Database.js";
import { err } from "./middlewares/error.js";
import { userRouter } from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

app.use(express.json());

config({
  path: "./config/config.env",
});

app.use(cookieParser());

app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);

connectDb();

app.get("/", (req, res) => {
  res.send("Hello");
});

// Always use it in end -- error middleWares
app.use(err);

export default app;

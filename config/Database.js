import mongoose from "mongoose";

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL,{dbName:"EcommerceWeb"})
    .then(() => {
      console.log("Connected databse with host");
    })
    .catch((error) => {
      console.log("Connection failed");
    });
};

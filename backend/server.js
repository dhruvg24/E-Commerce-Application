import app from "./app.js";
import dotenv from "dotenv";
import { connectToMongoDB } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}
connectToMongoDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// handle uncaught exception errors
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down due to uncaught exception errors`);
  process.exit(1);
  // server not closed here.
});

const PORT = process.env.PORT || 3000;
// console.log(app);

// RAZORPAY INTEGRATION

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down, due to unhandled promise rejection`);
  // here first close the server then exit.
  server.close(() => {
    process.exit(1);
  });
});

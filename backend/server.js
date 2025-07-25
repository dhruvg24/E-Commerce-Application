import app from "./app.js";
import dotenv from "dotenv";
import { connectToMongoDB } from "./config/db.js";
import {v2 as cloudinary} from 'cloudinary'
dotenv.config({ path: "backend/config/config.env" });
connectToMongoDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
// handle uncaught exception errors
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down due to uncaught exception errors`);
  process.exit(1);
  // server not closed here.
});

const PORT = process.env.PORT || 3000;
// console.log(app);

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

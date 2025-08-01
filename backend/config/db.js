import mongoose from "mongoose";

export const connectToMongoDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((data) => {
      console.log(`MongoDB connected with ${data.connection.host} server`);
    })
};

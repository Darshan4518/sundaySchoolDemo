// db.js
import mongoose from "mongoose";

const url: string = process.env.MONGO_URI as string;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    process.exit(1);
  }
};

export default connectDB;

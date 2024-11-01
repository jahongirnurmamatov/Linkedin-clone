import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/likedin-clone');
    console.log("Mongo db connected on host " + conn);
  } catch (error) {
    console.error(`Error in connecting mongoDb : ${error}`);
    process.exit(1);
  }
};

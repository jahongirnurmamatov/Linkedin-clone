import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bannerImg: { type: String, default: "" },
    headline: { type: String, default: "Linkedin User" },
    location: { type: String, default: "Earth" },
    about: { type: String, default: "" },
    skills: [String],
    epxerience: [
      {
        title: { type: String },
        company: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        school: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Number },
        endDate: { type: Number },
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

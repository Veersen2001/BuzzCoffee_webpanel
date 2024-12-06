import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  access_token: string;
  role: string;
  profileImage: string;
}

const User: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    session_expiry: {
      type: Date,
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://github.com/shadcn.png",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", User, "users");

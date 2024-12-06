import mongoose, { Document, Schema } from "mongoose";

interface IAdon extends Document {
  name: string;
  price: number;
  categories: string[];
}

const AdonSchema: Schema<IAdon> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Adon =
  mongoose.models.Adon || mongoose.model<IAdon>("Adon", AdonSchema, "adons");

export default Adon;

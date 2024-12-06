import mongoose, { Document, Schema } from "mongoose";

interface IItem extends Document {
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  stock: number;
  isActive: boolean;
  variants?: Array<{
    name: string;
    price: number;
  }>;
  addons?: Array<{
    name: string;
    price: number;
  }>;
}

const ItemSchema: Schema<IItem> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default:false,
    },
    variants: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    addons: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ItemSchema.methods.decreaseStock = function (this: IItem, quantity: number) {
  if (this.stock >= quantity) {
    this.stock -= quantity;
    return this.save();
  } else {
    throw new Error("Insufficient stock");
  }
};

ItemSchema.statics.findActiveItems = function () {
  return this.find({ isActive: true });
};

const Item =
  mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema, "items");

export default Item;

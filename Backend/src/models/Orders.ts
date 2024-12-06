import mongoose, { Document, Schema } from "mongoose";
import CItem from"./itemCart"

interface IOrder extends Document {
  orderId: string;
  customerId: string;
  email:string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    image:string;
    variants?: Array<{
      name: string;
      price: number;
    }>;
    addons?: Array<{
      name: string;
      price: number;
    }>;

  }>;
  // cartItems: mongoose.Types.ObjectId[]; // References to CItem
  discountedPrice:number;
  discount:number;
  totalAmount: number;
  orderStatus: "processing" | "preparing" | "delivered" | "cancelled";
  orderDate: Date;
  deliveryDate?: Date;
  timeSlot?: string;
  customer?:string
  isOnlineOrder: boolean;
  qrCode: string;
  notifications: Array<{
    type: string;
    message: string;
    sentAt: Date;
  }>;
}

const OrderSchema: Schema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
   
    email: {
      type: String,
      required:true,
      lowercase: true,
      // match: [
      //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //   'Please fill in a valid email address',
      // ], // Matches email against regex
        index:true,
    },
    
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: {
          type:String,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        variants: [
          {
            name: {
              type: String,
              
            },
            price: {
              type: Number,
            
            },
          },
        ],
        addons: [
          {
            name: {
              type: String,
              
            },
            price: {
              type: Number,
              

            },
          },
        ],
      
      },
    ],
    // cartItems: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "CItem", // Referencing Cart Items
    //     required: true,
    //   },
    // ],

    discountedPrice:{
     type: Number,
     default:0 
  },
      discount: {
    type: Number,
    default:0,

 
   },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ["processing", "preparing", "delivered", "cancelled"],
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    timeSlot: {
      type: String,
    },
    customer: {
      type: String,
    },
    isOnlineOrder: {
      type: Boolean,
    },
    qrCode: {
      type: String,
      required: true,
    },
    notifications: [
      {
        type: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema, "orders");

export default Order;

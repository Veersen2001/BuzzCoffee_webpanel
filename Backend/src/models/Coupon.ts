import mongoose, { Document, Schema } from "mongoose";

// Define the Coupon interface extending Mongoose's Document
interface Coupon extends Document {
    code: string;
    discount: number;
    discountType: "%" ;
    startDate: string;
    endDate:string;
    startHour?: number;
    endHour?: number;
    minimumPrice?: number;
    maximumOrder?: number;
    status: boolean;
    usageLimit:number;
    usedCount:number;
}

// Define the Coupon Schema
const CouponSchema: Schema<Coupon> = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
        },
        discountType: {
            type: String,
            default: "%",
        },
        startDate: {
            type: String,
            
        },
        endDate: {
            type: String,
           
        },
        startHour: {
            type: Number,
            default: null,
        },
        endHour: {
            type: Number,
            default: null,
        },
        minimumPrice: {
            type: Number,
            default: null,
            min: 0,
        },
        maximumOrder: {
            type: Number,
            default: null,
            min: 0,
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
        },
        usageLimit: {
            type:Number ,
            min:0 
        },
        usedCount:{
            type:Number,
            default: 0,
        }
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Export the Coupon model
const Coupon=
    mongoose.models.Coupon || mongoose.model<Coupon>("Coupon", CouponSchema, "Coupons");

export default Coupon;

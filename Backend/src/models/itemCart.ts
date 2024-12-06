import mongoose, { Document, Schema } from "mongoose";

interface CItem extends Document {
    title: string;
    productId:string,
    price: number;
    image?: string;
    total: number;
    quantity:number;
    variants?: Array<{
        name: string;
        price: number;
    }>;
    addons?: Array<{
        name: string;
        price: number;
    }>;
    
}

const CartSchema: Schema<CItem> = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },
        productId: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        total:{
            type: Number,
            required: true,
        },
        price:{
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
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
                  
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// CartSchema.statics.findActiveItems = function () {
//     return this.find({ isActive: true });
// };

const CItem =
    mongoose.models.CItem || mongoose.model<CItem>("CItem", CartSchema, "Citems");

export default CItem;

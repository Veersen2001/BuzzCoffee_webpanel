// models/Feedback.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Feedback document
export interface IFeedback extends Document {
    customerName: string;
    feedback: string;
    rating: number;
    response: string | null;
    responseDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for the feedback model
const feedbackSchema: Schema = new Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        feedback: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5, // Assuming ratings are from 1 to 5
        },
        response: {
            type: String,
            default: null,
        },
        responseDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the model
const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;

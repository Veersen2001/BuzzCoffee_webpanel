// controllers/feedbackController.ts
import { Request, Response } from 'express';

import Feedback, { IFeedback } from "../models/feedback";
// Create a feedback
export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { customerName, feedback, rating } = req.body;
        const newFeedback: IFeedback = new Feedback({
            customerName,
            feedback,
            rating,
        });

        await newFeedback.save();
        return res.status(201).json({ message: 'Feedback created successfully', feedback: newFeedback });
    } catch (err) {
        return res.status(500).json({ message: 'Error creating feedback', error: err });
    }
};

// Fetch all feedbacks
export const getFeedbacks = async (req: Request, res: Response) => {
    try {
        const feedbacks = await Feedback.find();
        return res.status(200).json({ feedbacks });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching feedbacks', error: err });
    }
};

// Respond to a feedback
export const respondToFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { response, responseDate: new Date() },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        return res.status(200).json({ message: 'Response added successfully', feedback });
    } catch (err) {
        return res.status(500).json({ message: 'Error responding to feedback', error: err });
    }
};

// Delete a feedback
export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        return res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting feedback', error: err });
    }
};

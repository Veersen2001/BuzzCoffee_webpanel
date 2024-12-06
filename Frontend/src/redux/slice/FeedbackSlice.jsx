// redux/feedbackSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Initial state for feedback
const initialState = {
    feedbackData: [],
    loading: false,
    error: null,
};
// Async Thunks for actions (fetch, create, delete, update)
export const fetchFeedbacks = createAsyncThunk(
    'feedback/fetchFeedbacks',
    async () => {
        const response = await axios.get(`${API_URL}/feedbacks`);
        toast.success("All Feedback load successfully");
        return response.data;
    }
);

export const createFeedback = createAsyncThunk(
    'feedback/createFeedback',
    async (feedback) => {
        const response = await axios.post(`${API_URL}/feedback`, feedback);
        toast.success(" Feedback Created successfully");
        return response.data.feedback;
    }
);

export const deleteFeedback = createAsyncThunk(
    'feedback/deleteFeedback',
    async (id) => {
        await axios.delete(`${API_URL}/feedback/${id}`);
        toast.success(" Feedback Deleted successfully");
        return id; // returning the id to delete from the state
    }
);

export const respondToFeedback = createAsyncThunk(
    'feedback/respondToFeedback',
    async ({ id, response }) => {
        const res = await axios.put(`${API_URL}/feedback/${id}/respond`, { response });
        toast.success(" Feedback respond successfully");
        return res.data.feedback;
    }
);

// Creating the slice
const FeedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch feedbacks
            .addCase(fetchFeedbacks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFeedbacks.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks = action.payload;
            })
            .addCase(fetchFeedbacks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create new feedback
            .addCase(createFeedback.pending, (state) => {
                state.loading = true;
            })
            .addCase(createFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks.push(action.payload);
            })
            .addCase(createFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete feedback
            .addCase(deleteFeedback.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks = state.feedbacks.filter(feedback => feedback._id !== action.payload);
            })
            .addCase(deleteFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Respond to feedback
            .addCase(respondToFeedback.pending, (state) => {
                state.loading = true;
            })
            .addCase(respondToFeedback.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.feedbacks.findIndex(feedback => feedback._id === action.payload._id);
                if (index !== -1) {
                    state.feedbacks[index] = action.payload;
                }
            })
            .addCase(respondToFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default FeedbackSlice.reducer;

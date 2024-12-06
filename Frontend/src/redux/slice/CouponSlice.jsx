import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Initial state
const initialState = {
    couponData: [],
    discountedPrice: 0, // Add initial value for discountedPrice
    discount: 0, // Add initial value for discount
    loading: false,
    error: null,
};

// **Get All Coupons**
export const getAllCoupons = createAsyncThunk("coupon/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/coupon`);
        toast.success("Coupons loaded successfully");
        return response.data; // Assuming the response contains an array of coupons
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch coupons");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Add New Coupon**
export const addCoupon = createAsyncThunk("coupon/add", async (coupon, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/coupon`, coupon);
        toast.success("Coupon added successfully");
        return response.data; // Assuming the response returns the added coupon
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add coupon");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Update Coupon**
export const updateCoupon = createAsyncThunk("coupon/update", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/coupon/${id}`, updatedData);
        toast.success("Coupon updated successfully");
        return { id, updatedData: response.data }; // Return both ID and updated data
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update coupon");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Delete Coupon**
export const deleteCoupon = createAsyncThunk("coupon/delete", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/coupon/${id}`);
        toast.success("Coupon deleted successfully");
        return id; // Return the ID of the deleted coupon
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete coupon");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Apply Coupon**
export const applyCoupon = createAsyncThunk(
    "coupon/apply",
    async ({ couponCode, price}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/apply_coupon`, {
                couponCode,
                price,
                
            });
            toast.success("Coupon applied successfully");
            return response.data; // This will contain the discounted price and a success message
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to apply coupon");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


// **Coupon Slice**
const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        // Add resetDiscount reducer
        resetDiscount: (state) => {
            state.discountedPrice = 0;
            state.discount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetching coupons
            .addCase(getAllCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.couponData = action.payload; // Replace couponData with fetched items
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle adding a coupon
            .addCase(addCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.couponData.push(action.payload); // Add the new coupon to couponData
            })
            .addCase(addCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updating a coupon
            .addCase(updateCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.couponData.findIndex((item) => item._id === action.payload.id);
                if (index !== -1) {
                    state.couponData[index] = { ...state.couponData[index], ...action.payload.updatedData }; // Update the specific coupon
                }
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleting a coupon
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.couponData = state.couponData.filter((item) => item._id !== action.payload); // Remove the deleted coupon
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle applying a coupon
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                // You can store the discounted price or handle it as needed
                state.discountedPrice = action.payload.discountedPrice;
                state.discount = action.payload.discount; // Assuming the backend returns discountedPrice
                 // Assuming the backend returns discountedPrice
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { resetDiscount } = couponSlice.actions; // Export resetDiscount action
export default couponSlice.reducer;

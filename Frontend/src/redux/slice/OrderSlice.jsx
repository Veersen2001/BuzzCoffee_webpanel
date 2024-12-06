import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Initial state
const initialState = {
    orderData: [],
    loading: false,
    error: null,
};

// **Create Order**
export const createOrder = createAsyncThunk("orders/create", async (orderData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/create_order`, orderData);
        toast.success("Order created successfully");
        return response.data; // Assuming the response contains the created order
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to create order");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Update Order**
export const updateOrder = createAsyncThunk("orders/update", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/orders/${id}`, updatedData);
        toast.success("Order updated successfully");
        return { id, updatedData: response.data }; // Return both ID and updated data
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update order");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Delete Order**
export const deleteOrder = createAsyncThunk("orders/delete", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/orders/${id}`);
        toast.success("Order deleted successfully");
        return id; // Return the ID of the deleted order
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete order");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Get Order by ID**
export const getOrder = createAsyncThunk("orders/getOrder", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        toast.success("Order details fetched successfully");
        return response.data; // Assuming the response contains order details
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch order details");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Get All Orders**
export const getAllOrders = createAsyncThunk("orders/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/orders`);
        toast.success("Orders loaded successfully");
        return response.data; // Assuming the response contains an array of orders
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Order Slice**
const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle creating an order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderData.push(action.payload); // Add the new order
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updating an order
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orderData.findIndex((order) => order._id === action.payload.id);
                if (index !== -1) {
                    state.orderData[index] = { ...state.orderData[index], ...action.payload.updatedData };
                }
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleting an order
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderData = state.orderData.filter((order) => order._id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetching order by ID
            .addCase(getOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Update or add the fetched order details
                const index = state.orderData.findIndex((order) => order._id === action.payload.id);
                if (index !== -1) {
                    state.orderData[index] = action.payload;
                } else {
                    state.orderData.push(action.payload);
                }
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetching all orders
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orderData = action.payload; // Replace with fetched orders
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;

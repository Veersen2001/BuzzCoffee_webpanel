import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Initial state
const initialState = {
    cartData: [],
    loading: false,
    error: null,
};

// **Get All Cart Items**
export const getAllCartItems = createAsyncThunk("cart/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/cart_item`);
        toast.success("Cart data loaded successfully");
        return response.data; // Assuming the response contains an array of cart items
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch cart data");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Add Item to Cart**
export const addCartItem = createAsyncThunk("cart/add", async (item, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/cart_item`, item);
        toast.success("Item added to cart successfully");
        return response.data; // Assuming the response returns the added cart item
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add item to cart");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Update Cart Item**
export const updateCartItem = createAsyncThunk("cart/update", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/cart_item/${id}`, updatedData);
        toast.success("Cart item updated successfully");
        return { id, updatedData: response.data }; // Return both ID and updated data
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update cart item");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Delete Item from Cart**
export const deleteCartItem = createAsyncThunk("cart/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/cart_item/${id}`);
        toast.success("Item removed from cart successfully");
        return id; // Return the ID of the deleted item
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete item from cart");
        return rejectWithValue(error?.response?.data?.message);
    }
});

export const deleteAllCartItems = createAsyncThunk("cart/deleteAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/cart_item`);
        // toast.success("All items removed from cart successfully");
        return []; // Return an empty array to clear the cart
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete all items from cart");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Cart Slice**
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetching cart items
            .addCase(getAllCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload; // Replace cartData with fetched items
            })
            .addCase(getAllCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle adding a cart item
            .addCase(addCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData.push(action.payload); // Add the new item to cartData
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updating a cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.cartData.findIndex((item) => item._id === action.payload.id);
                if (index !== -1) {
                    state.cartData[index] = { ...state.cartData[index], ...action.payload.updatedData }; // Update the specific cart item
                }
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleting a cart item
            .addCase(deleteCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = state.cartData.filter((item) => item._id !== action.payload); // Remove the deleted item
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

              // Handle deleting all cart items
            .addCase(deleteAllCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
        .addCase(deleteAllCartItems.fulfilled, (state) => {
            state.loading = false;
            state.cartData = []; // Clear all cart items
        })
        .addCase(deleteAllCartItems.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default cartSlice.reducer;

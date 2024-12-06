import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Initial state

const initialState = {
// Changed from 'ProductData' to 'products'
    products: [],  
    loading: false,
    error: null,
};

// **Get All Products**
export const getAllProducts = createAsyncThunk("product/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/items`);
        toast.success("Products loaded successfully");
        return response.data; // Assuming the response contains an array of products
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch products");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Add Product**
export const addProduct = createAsyncThunk("product/add", async (product, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/items`, product);
        toast.success("Product added successfully");
        return response.data; // Assuming the response returns the added product
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add product");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Update Product**
export const updateProduct = createAsyncThunk("product/update", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/items/${id}`, updatedData);
        toast.success("Product updated successfully");
        return { id, updatedData: response.data }; // Return both ID and updated data
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update product");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Delete Product**
export const deleteProduct = createAsyncThunk("product/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/product/${id}`);
        toast.success("Product removed successfully");
        return id; // Return the ID of the deleted product
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete product");
        return rejectWithValue(error?.response?.data?.message);
    }
});

// **Product Slice**
const productSlice = createSlice({
    name: "product",  // Changed name from 'cart' to 'product'
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetching products
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload; // Replace products with fetched products
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle adding a product
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload); // Add the new product to products
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updating a product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex((product) => product._id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = { ...state.products[index], ...action.payload.updatedData }; // Update the specific product
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleting a product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter((product) => product._id !== action.payload); // Remove the deleted product
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;

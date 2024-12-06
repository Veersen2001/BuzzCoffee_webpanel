import { configureStore } from "@reduxjs/toolkit";

import CartSliceReducer from "../slice/CartSlice";
import ProductSliceReducer from "../slice/ProductSlice"
import OrderSliceReducer from "../slice/OrderSlice"
import CouponSliceReducer from "../slice/CouponSlice"
import FeedbackSliceReducer from "../slice/CouponSlice"





const store = configureStore({
    reducer: {
        cart: CartSliceReducer,
        products:ProductSliceReducer,
        orders:OrderSliceReducer,
        coupon:CouponSliceReducer,
        feedback:FeedbackSliceReducer
        
    },
    devTools: true
});

export default store;
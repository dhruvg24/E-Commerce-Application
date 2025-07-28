// this is when user completes payment through razorpay after which creating order functionality.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// create order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    // order is the payload
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/new/order", order, config);

      console.log("Order data: ", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Order creation failed!");
    }
  }
);

// get user orders
export const getAllMyOrders = createAsyncThunk(
  "order/getAllMyOrders",
  async (_, { rejectWithValue }) => {
    // order is the payload
    try {
      const { data } = await axios.get("/api/orders/user");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch orders.");
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [], //complete order lists created till now
    order: {}, //individual order,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        (state.loading = false),
          // in backend we have passed order, success as response
          (state.order = action.payload.order),
          (state.success = action.payload.success);
      })
      .addCase(createOrder.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload?.message || "Order creation failed!");
      });

    builder
      .addCase(getAllMyOrders.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getAllMyOrders.fulfilled, (state, action) => {
        (state.loading = false),
          // in backend we have passed order, success as response
          (state.orders = action.payload.orders),
          (state.success = action.payload.success);
      })
      .addCase(getAllMyOrders.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload?.message || "Failed to fetch orders");
      });
  },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;

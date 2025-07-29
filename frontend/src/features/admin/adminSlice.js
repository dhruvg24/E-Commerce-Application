import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all products
export const fetchAdminProducts = createAsyncThunk(
  "/admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/admin/products");
      //   through backend - we send success,products
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while fetching the products"
      );
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    success: false,
    loading: false,
    error: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        (state.loading = false), (state.products = action.payload.products);
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while fetching products");
      });
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;

export default adminSlice.reducer;

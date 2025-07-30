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
// create products
export const createProduct = createAsyncThunk(
  "/admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // config - for images
      const { data } = await axios.post(
        "/api/admin/product/create",
        productData,
        config
      );
      // will get success,product from backend

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while creating the product"
      );
    }
  }
);

// update product
export const updateProduct = createAsyncThunk(
  "/admin/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // config - for images
      const { data } = await axios.put(
        `/api/admin/product/${id}`,
        formData,
        config
      );

      // success,product info. from backend
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while updating the product"
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
    product: {},
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

    builder
      .addCase(createProduct.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        (state.loading = false),
          state.products.push(action.payload.product),
          (state.success = action.payload.success);
        // console.log(state.products);
        // console.log('Created product:',action.payload.product);
        // console.log('Total products', [...state.products]);
      })
      .addCase(createProduct.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while creating the product");
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        (state.loading = false),
          (state.product = action.payload.product),
          (state.success = action.payload.success);
        // console.log(state.products);
        // console.log('Created product:',action.payload.product);
        // console.log('Total products', [...state.products]);
      })
      .addCase(updateProduct.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while updating the product");
      });
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;

export default adminSlice.reducer;

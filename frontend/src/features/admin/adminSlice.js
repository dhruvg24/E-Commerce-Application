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

// delete product
export const deleteProduct = createAsyncThunk(
  "/admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/admin/product/${productId}`);

      return { productId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while deleting the product"
      );
    }
  }
);

// fetch all users
export const fetchUsers = createAsyncThunk(
  "/admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/admin/users`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while fetching users"
      );
    }
  }
);

// get single user
export const getSingleUser = createAsyncThunk(
  "/admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/admin/user/${id}`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while fetching the user"
      );
    }
  }
);

// update user role
export const updateUserRole = createAsyncThunk(
  "/admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/admin/user/${userId}`, { role });

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while updating user role"
      );
    }
  }
);

// delete user profile
export const deleteUser = createAsyncThunk(
  "/admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/admin/user/${userId}`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while deleting the user"
      );
    }
  }
);

// fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "/admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/admin/orders`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while fetching the orders"
      );
    }
  }
);

// Delete order - On Completion of Delivery ONLY.
export const deleteOrder = createAsyncThunk(
  "/admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/admin/order/${id}`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while deleting the order"
      );
    }
  }
);

// Update Order status
export const updateOrderStatus = createAsyncThunk(
  "/admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/admin/order/${orderId}`,
        { status },
        config
      );
      // status can have multiple value
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while Updating order status"
      );
    }
  }
);


// Fetch All Reviews
export const fetchProductReviews = createAsyncThunk(
  "/admin/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      
      const { data } = await axios.get(
        `/api/admin/reviews?id=${productId}`
      );
      // status can have multiple value
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while fetching order reviews."
      );
    }
  }
);


// Delete Review
export const deleteReview = createAsyncThunk(
  "/admin/deleteReview",
  async ({productId,reviewId}, { rejectWithValue }) => {
    try {
      
      const { data } = await axios.delete(
        `/api/admin/reviews?productId=${productId}&id=${reviewId}`
      );
      // in backend we are getting productid , id through backend
      
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error while deleting product review."
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
    deleting: {},
    users: [],
    user: {},
    message: null,
    orders: [],
    totalAmount: 0,
    order: {},
    reviews:[]
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = null;
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
      })
      .addCase(updateProduct.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while updating the product");
      });

    builder
      .addCase(deleteProduct.pending, (state, action) => {
        const productId = action.meta.arg;

        state.deleting[productId] = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        (state.deleting[productId] = false),
          (state.products = state.products.filter(
            (product) => product._id !== productId
          ));
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = false;
        state.error =
          action.payload?.message || "Error while deleting the product";
      });

    builder
      .addCase(fetchUsers.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        (state.loading = false), (state.users = action.payload.users);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while fetching the users");
      });

    builder
      .addCase(getSingleUser.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        (state.loading = false), (state.user = action.payload.user);
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while fetching the user");
      });

    builder
      .addCase(updateUserRole.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        (state.loading = false), (state.success = action.payload.success);
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while updating user role");
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        (state.loading = false), (state.message = action.payload.message);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while deleting the user");
      });

    builder
      .addCase(fetchAllOrders.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        (state.loading = false),
          (state.orders = action.payload.orders),
          (state.totalAmount = action.payload.totalAmount);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while fetching the orders");
      });

    builder
      .addCase(deleteOrder.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        (state.loading = false),
          (state.product = action.payload.product),
          (state.message = action.payload.message);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while deleting the order.");
      });

    builder
      .addCase(updateOrderStatus.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = action.payload.success),
          (state.order = action.payload.order);
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while updating order status.");
      });

      builder
      .addCase(fetchProductReviews.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        (state.loading = false),
          (state.reviews = action.payload.reviews);
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while fetching order reviews.");
      });

       builder
      .addCase(deleteReview.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = action.payload.success),
          (state.message = action.payload.message);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Error while deleting product review.");
      });
  },
});

export const { removeErrors, removeSuccess, clearMessage } = adminSlice.actions;

export default adminSlice.reducer;

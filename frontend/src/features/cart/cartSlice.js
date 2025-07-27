import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/product/${id}`);
      console.log("Add items to cart - product", data);
      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "An error occured");
    }
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeItemFromCart: (state, action) => {
      state.removingId = action.payload;
      // console.log(state.removingId)
      state.cartItems = state.cartItems.filter(
        (item) => item.product != action.payload
      );
      // above method is to delete
      // reset items in local storage - to avoid refresh resets
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.removingId = null;
      // reassign the id
    },
  },
  extraReducers: (builder) => {
    // add items to cart
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;
        // to prevent duplicacy
        const existingItem = state.cartItems.find(
          (i) => i.product === item.product
        );
        // for all items search if same product
        if (existingItem) {
          existingItem.quantity = item.quantity;
          state.message = `Updated ${item.name} quantity in cart successfully`;
        } else {
          // if the item is not already in cart push it to the cart.
          state.cartItems.push(item);
          state.message = `${item.name} is added to cart successfully`;
        }
        state.loading = false;
        state.error = null;
        state.success = true;
        // to prevent reset cart while refreshing/reloading page
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload?.message || "An error occured");
      });
  },
});

export const { removeErrors, removeMessage, removeItemFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;

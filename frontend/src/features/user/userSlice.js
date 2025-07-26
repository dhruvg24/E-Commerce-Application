import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// REGISTER APIs
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/register", userData, config);
      console.log("register data: ", data);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Registration failed! Pls try again later."
      );
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/login",
        { email, password },
        config
      );
      console.log("login data: ", data);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Login failed! Pls try again later."
      );
    }
  }
);

export const loadUser = createAsyncThunk(
  "/user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/profile");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data ||
          "Failed to load user profile! Pls try again later."
      );
    }
  }
);

export const logout = createAsyncThunk(
  "/user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/logout", {
        withCredentials: true,
      });
      // withcredentials ensure deletion of cookie.
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.put("/api/profile/update", userData, config);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Profile Update Failed, Pls try again later.",
        }
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, //initially no user
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false, //only if user logins,
    message: null,
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
    // registration cases
    builder
      .addCase(register.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(register.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload.success),
          (state.user = action.payload?.user || null),
          (state.isAuthenticated = Boolean(action.payload?.user));
      })
      .addCase(register.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message ||
            "Registration failed, Please try again later.");
        state.user = null;
        state.isAuthenticated = false;
      });

    // login cases
    builder
      .addCase(login.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(login.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload.success),
          (state.user = action.payload?.user || null),
          (state.isAuthenticated = Boolean(action.payload?.user));
        // (console.log(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Login failed, Please try again later.");
        state.user = null;
        state.isAuthenticated = false;
      });

    // loading user
    builder
      .addCase(loadUser.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        (state.loading = false), (state.error = null);
        (state.user = action.payload?.user || null),
          (state.isAuthenticated = Boolean(action.payload?.user));
        // (console.log(state.user));
      })
      .addCase(loadUser.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Failed to load user profile!");
        state.user = null;
        state.isAuthenticated = false;
      });

    // logout user
    builder
      .addCase(logout.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(logout.fulfilled, (state, action) => {
        (state.loading = false), (state.error = null);
        (state.user = null), (state.isAuthenticated = false);
        // (console.log(state.user));
      })
      .addCase(logout.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload?.message || "Failed to logout user!");
      });

    // update user profile
    builder
      .addCase(updateProfile.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        (state.loading = false), (state.error = null);
        (state.user = action.payload?.user || null),
          (state.isAuthenticated = Boolean(action.payload?.user)),
          (state.success = action.payload?.success),
          (state.message = action.payload?.message);
        // set user through payload coz from backed userController.js we are passing user
        // (console.log(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message ||
            "Profile update failed. Please try again later.");
      });
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;

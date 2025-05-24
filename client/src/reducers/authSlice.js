import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  login,
  logout as _logout,
  register as _register,
  checkAuth as _checkAuth,
} from "../services/auth";
import { handleLogoutLocal } from "../helpers/utils";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, getState }) => {
    let token = getState().auth.token;
    if (!token) {
      return;
    }
    try {
      const response = await _checkAuth();
      if (response.user) {
        return {
          user: response.user,
          token: response.token,
        };
      }
      throw new Error("No user data received");
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch(handleLogout());
      dispatch(setError(error.message));
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { dispatch }) => {
    try {
      const response = await _register(data);
      return response;
    } catch (error) {
      console.log("register error", error);
      dispatch(
        setError(error.response?.data?.message || "Registration failed")
      );
      throw error;
    }
  }
);

export const handleLogin = createAsyncThunk(
  "auth/login",
  async (data, { dispatch }) => {
    dispatch(loginStart());
    try {
      const response = await login(data);
      console.log("login", response);
      dispatch(loginSuccess(response));
      localStorage.setItem("token", response.token);
      console.log("data.from", data.from);
      navigate(data.from || "/dashboard");
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
      throw error;
    }
  }
);

export const handleLogout = createAsyncThunk(
  "auth/logout",
  async (data, { dispatch }) => {
    try {
      const response = await _logout(data);
      dispatch(logout());
      handleLogoutLocal();
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Logout failed"));
      throw error;
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  setError,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  _createTask,
  _deleteTask,
  _fetchTaskById,
  _updateTaskDetail,
} from "../services/task";

const initialState = {
  taskDetail: null,
};

export const fetchTaskById = createAsyncThunk(
  "task/fetchTaskById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await _fetchTaskById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching task"
      );
    }
  }
);

export const updateTaskDetail = createAsyncThunk(
  "task/updateTaskDetail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await _updateTaskDetail(data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Error updating task status"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await _deleteTask(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting task"
      );
    }
  }
);

export const handleCreateTask = createAsyncThunk(
  "task/handleCreateTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await _createTask(data);
      return response.data;
    } catch (error) {
      console.log(" 00000", error);
      return rejectWithValue(
        error.response?.data?.message || "Error creating task"
      );
    }
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskDetail: (state, action) => {
      state.taskDetail = {
        ...state.taskDetail,
        ...action.payload,
      };
    },
  },
});

export const { setTaskDetail } = taskSlice.actions;
export default taskSlice.reducer;

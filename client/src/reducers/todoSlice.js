import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTodos } from "../services/todo";

const initialState = {
  todos: [],
  isEditing: false,
  editId: null,
  loading: false,
  error: null,
};

export const handleFetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  //   const response = await fetch("/api/todos");

  const response = await fetchTodos();

  console.log("response", response);
});

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    setEditId: (state, action) => {
      state.editId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTodos, setIsEditing, setEditId, setLoading, setError } =
  todoSlice.actions;

export default todoSlice.reducer;

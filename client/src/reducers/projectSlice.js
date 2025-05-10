import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  _fetchProjects,
  _fetchProjectById,
} from "../services/projects";

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

export const handleCreateProject = createAsyncThunk(
  "projects/handleCreateProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating project"
      );
    }
  }
);

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await _fetchProjects();
      const { data } = response;

      dispatch(setProjects(data));

      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await _fetchProjectById(id);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching project"
      );
    }
  }
);
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProjects, setLoading, setError } = projectSlice.actions;

export default projectSlice.reducer;

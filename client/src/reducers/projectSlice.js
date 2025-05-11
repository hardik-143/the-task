import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  _fetchProjects,
  _fetchProjectById,
  _fetchProjectTasks,
} from "../services/projects";

const initialState = {
  projects: [],
  projectDetail: {},
  loading: false,
  error: null,
  projectTasks: [],
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

export const fetchProjectTasks = createAsyncThunk(
  "projects/fetchProjectTasks",
  async (data, { rejectWithValue }) => {
    console.log("data", data);
    const { project_id, filters } = data;
    try {
      console.log("filters", filters);
      const response = await _fetchProjectTasks(project_id, filters);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching project tasks"
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
    setProjectDetail: (state, action) => {
      state.projectDetail = action.payload;
    },
    setProjectTasks: (state, action) => {
      state.projectTasks = action.payload;
    },
  },
});

export const {
  setProjects,
  setLoading,
  setError,
  setProjectDetail,
  setProjectTasks,
} = projectSlice.actions;

export default projectSlice.reducer;

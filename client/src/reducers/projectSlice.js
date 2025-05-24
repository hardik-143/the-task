import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  _fetchProjects,
  _fetchProjectById,
  _fetchProjectTasks,
  _fetchUsersForProject,
  _fetchProjectUsers,
  _updateProject,
} from "../services/projects";

const initialState = {
  projects: [],
  loading: false,
  error: null,
  projectTasks: [],
};

export const handleCreateProject = createAsyncThunk(
  "projects/handleCreateProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createProject({ ...data });
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

export const fetchUsersForProject = createAsyncThunk(
  "projects/fetchUsersForProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await _fetchUsersForProject(data);
      return response;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching users for project"
      );
    }
  }
);

export const fetchProjectUsers = createAsyncThunk(
  "projects/fetchProjectUsers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await _fetchProjectUsers(data);
      return response;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching users for project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await _updateProject(data.id, data.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Error updating project"
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

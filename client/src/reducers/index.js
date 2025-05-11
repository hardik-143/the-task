// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import projectsReducer from "./projectSlice";
import tasksReducer from "./taskSlice";
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], // only persist auth reducer
  version: 1,
};
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const projectsPersistConfig = {
  key: "projects",
  storage,
  whitelist: ["projectDetail"], // only persist projects reducer
};

const persistedProjectsReducer = persistReducer(
  projectsPersistConfig,
  projectsReducer
);

const tasksPersistConfig = {
  key: "tasks",
  storage,
  whitelist: [], // only persist tasks reducer
};

const persistedTasksReducer = persistReducer(tasksPersistConfig, tasksReducer);
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  projects: persistedProjectsReducer,
  tasks: persistedTasksReducer,
});

export default rootReducer;

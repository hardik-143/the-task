// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import projectsReducer from "./projectSlice";
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

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  projects: persistedProjectsReducer,
});

export default rootReducer;

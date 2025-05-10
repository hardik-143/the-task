// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import todoReducer from "./todoSlice";
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], // only persist auth reducer
  version: 1,
};
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const todoPersistConfig = {
  key: "todos",
  storage,
  whitelist: ["todos"], // only persist todos reducer
  version: 1,
};
const persistedTodoReducer = persistReducer(todoPersistConfig, todoReducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  todos: persistedTodoReducer,
});

export default rootReducer;

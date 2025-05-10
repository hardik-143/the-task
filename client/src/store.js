// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";
// import rootReducer from './reducers';

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth reducer
  version: 1,
};
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], // only persist auth reducer
  version: 1,
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// const persistedReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

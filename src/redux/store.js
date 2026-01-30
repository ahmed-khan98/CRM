import { configureStore,combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setupListeners } from "@reduxjs/toolkit/query";
import { createApiAuction } from "./createApi";
import filterReducer from "./filterSlice";
import uploadReducer from "./uploadSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["filter"], 
};

const rootReducer = combineReducers({
  [createApiAuction.reducerPath]: createApiAuction.reducer,
  filter: filterReducer,
  upload: uploadReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(createApiAuction.middleware),
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
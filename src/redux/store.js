import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createApiAuction } from './createApi';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    [createApiAuction.reducerPath]: createApiAuction.reducer,
    filter: filterReducer,  // <-- Filter reducer add kiya
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createApiAuction.middleware),
});

setupListeners(store.dispatch);
export default store;

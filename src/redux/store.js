import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createApiAuction } from './createApi';
import filterReducer from './filterSlice';
import uploadReducer from './uploadSlice';


export const store = configureStore({
  reducer: {
    [createApiAuction.reducerPath]: createApiAuction.reducer,
    filter: filterReducer, 
    upload: uploadReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createApiAuction.middleware),
});

setupListeners(store.dispatch);
export default store;

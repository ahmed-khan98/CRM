import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createApiAuction } from './createApi';

export const store = configureStore({
    reducer: {
      [createApiAuction.reducerPath]: createApiAuction.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(createApiAuction.middleware,),
  });

setupListeners(store.dispatch);
export default store


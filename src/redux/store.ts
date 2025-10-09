import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './feature/cartSlice';
import userReducer from './feature/userSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
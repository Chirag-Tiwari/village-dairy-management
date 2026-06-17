import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import milkReducer from './slices/milkSlice';
import monthlyPaymentReducer from './slices/monthlyPaymentSlice';
import protsahanReducer from './slices/protsahanSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  milk: milkReducer,
  monthlyPayment: monthlyPaymentReducer,
  protsahan: protsahanReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

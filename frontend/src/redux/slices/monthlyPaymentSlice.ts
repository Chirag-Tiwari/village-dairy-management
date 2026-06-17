import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MonthlyPaymentRegister } from '@/types';
import { MonthlyRegisterParams } from '@/services/monthlyPayment.service';

interface MonthlyPaymentState {
  register: MonthlyPaymentRegister | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MonthlyPaymentState = {
  register: null,
  status: 'idle',
  actionStatus: 'idle',
  error: null,
};

const monthlyPaymentSlice = createSlice({
  name: 'monthlyPayment',
  initialState,
  reducers: {
    fetchRegisterRequested: (state, _action: PayloadAction<MonthlyRegisterParams>) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchRegisterSucceeded: (state, action: PayloadAction<MonthlyPaymentRegister>) => {
      state.status = 'succeeded';
      state.register = action.payload;
    },
    fetchRegisterFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    verifyRequested: (state, _action: PayloadAction<MonthlyRegisterParams>) => {
      state.actionStatus = 'loading';
      state.error = null;
    },
    approveRequested: (state, _action: PayloadAction<MonthlyRegisterParams>) => {
      state.actionStatus = 'loading';
      state.error = null;
    },
    actionSucceeded: (state) => {
      state.actionStatus = 'succeeded';
    },
    actionFailed: (state, action: PayloadAction<string>) => {
      state.actionStatus = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  fetchRegisterRequested,
  fetchRegisterSucceeded,
  fetchRegisterFailed,
  verifyRequested,
  approveRequested,
  actionSucceeded,
  actionFailed,
} = monthlyPaymentSlice.actions;
export default monthlyPaymentSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyRegisterResponse } from '@/types';
import { CreateMilkEntryPayload } from '@/services/milk.service';

interface MilkState {
  register: DailyRegisterResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  submitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MilkState = {
  register: null,
  status: 'idle',
  submitStatus: 'idle',
  error: null,
};

const milkSlice = createSlice({
  name: 'milk',
  initialState,
  reducers: {
    fetchRegisterRequested: (state, _action: PayloadAction<{ date: string }>) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchRegisterSucceeded: (state, action: PayloadAction<DailyRegisterResponse>) => {
      state.status = 'succeeded';
      state.register = action.payload;
    },
    fetchRegisterFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    submitEntryRequested: (state, _action: PayloadAction<CreateMilkEntryPayload>) => {
      state.submitStatus = 'loading';
      state.error = null;
    },
    submitEntrySucceeded: (state) => {
      state.submitStatus = 'succeeded';
    },
    submitEntryFailed: (state, action: PayloadAction<string>) => {
      state.submitStatus = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  fetchRegisterRequested,
  fetchRegisterSucceeded,
  fetchRegisterFailed,
  submitEntryRequested,
  submitEntrySucceeded,
  submitEntryFailed,
} = milkSlice.actions;
export default milkSlice.reducer;

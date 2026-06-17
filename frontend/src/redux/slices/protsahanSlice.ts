import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProtsahanRegister, ProtsahanLedgerEntry } from '@/types';
import { ProtsahanRegisterParams } from '@/services/protsahan.service';

interface ProtsahanState {
  register: ProtsahanRegister | null;
  myLedger: ProtsahanLedgerEntry[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProtsahanState = {
  register: null,
  myLedger: [],
  status: 'idle',
  actionStatus: 'idle',
  error: null,
};

const protsahanSlice = createSlice({
  name: 'protsahan',
  initialState,
  reducers: {
    fetchRegisterRequested: (state, _action: PayloadAction<ProtsahanRegisterParams>) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchRegisterSucceeded: (state, action: PayloadAction<ProtsahanRegister>) => {
      state.status = 'succeeded';
      state.register = action.payload;
    },
    fetchRegisterFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    approveRequested: (state, _action: PayloadAction<ProtsahanRegisterParams>) => {
      state.actionStatus = 'loading';
      state.error = null;
    },
    markPaidRequested: (state, _action: PayloadAction<ProtsahanRegisterParams>) => {
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
    fetchMyLedgerRequested: () => {},
    fetchMyLedgerSucceeded: (state, action: PayloadAction<ProtsahanLedgerEntry[]>) => {
      state.myLedger = action.payload;
    },
  },
});

export const {
  fetchRegisterRequested,
  fetchRegisterSucceeded,
  fetchRegisterFailed,
  approveRequested,
  markPaidRequested,
  actionSucceeded,
  actionFailed,
  fetchMyLedgerRequested,
  fetchMyLedgerSucceeded,
} = protsahanSlice.actions;
export default protsahanSlice.reducer;

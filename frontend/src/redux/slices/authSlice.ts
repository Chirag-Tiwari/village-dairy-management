import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested: (state, _action: PayloadAction<{ mobileNumber: string; password: string }>) => {
      state.status = 'loading';
      state.error = null;
    },
    loginSucceeded: (state, action: PayloadAction<AuthUser>) => {
      state.status = 'succeeded';
      state.user = action.payload;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    loggedOut: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { loginRequested, loginSucceeded, loginFailed, loggedOut } = authSlice.actions;
export default authSlice.reducer;

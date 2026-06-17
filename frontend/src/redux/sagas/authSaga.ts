import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginResponse } from '@/services/auth.service';
import { setAccessToken } from '@/services/apiClient';
import { loginRequested, loginSucceeded, loginFailed } from '../slices/authSlice';

function* handleLogin(action: PayloadAction<{ mobileNumber: string; password: string }>) {
  try {
    const { mobileNumber, password } = action.payload;
    const result: LoginResponse = yield call(authApi.login, mobileNumber, password);

    setAccessToken(result.accessToken);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('refreshToken', result.refreshToken);
    }

    yield put(loginSucceeded(result.user));
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    yield put(loginFailed(message));
  }
}

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Something went wrong. Please try again.';
}

export function* authSaga() {
  yield takeLatest(loginRequested.type, handleLogin);
}

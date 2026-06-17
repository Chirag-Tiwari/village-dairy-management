import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { monthlyPaymentApi, MonthlyRegisterParams } from '@/services/monthlyPayment.service';
import { MonthlyPaymentRegister } from '@/types';
import {
  fetchRegisterRequested,
  fetchRegisterSucceeded,
  fetchRegisterFailed,
  verifyRequested,
  approveRequested,
  actionSucceeded,
  actionFailed,
} from '../slices/monthlyPaymentSlice';

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Something went wrong. Please try again.';
}

function* handleFetchRegister(action: PayloadAction<MonthlyRegisterParams>) {
  try {
    const register: MonthlyPaymentRegister = yield call(monthlyPaymentApi.getRegister, action.payload);
    yield put(fetchRegisterSucceeded(register));
  } catch (error: unknown) {
    yield put(fetchRegisterFailed(extractErrorMessage(error)));
  }
}

function* handleVerify(action: PayloadAction<MonthlyRegisterParams>) {
  try {
    yield call(monthlyPaymentApi.verify, action.payload);
    yield put(actionSucceeded());
    yield put(fetchRegisterRequested(action.payload));
  } catch (error: unknown) {
    yield put(actionFailed(extractErrorMessage(error)));
  }
}

function* handleApprove(action: PayloadAction<MonthlyRegisterParams>) {
  try {
    yield call(monthlyPaymentApi.approve, action.payload);
    yield put(actionSucceeded());
    yield put(fetchRegisterRequested(action.payload));
  } catch (error: unknown) {
    yield put(actionFailed(extractErrorMessage(error)));
  }
}

export function* monthlyPaymentSaga() {
  yield takeLatest(fetchRegisterRequested.type, handleFetchRegister);
  yield takeLatest(verifyRequested.type, handleVerify);
  yield takeLatest(approveRequested.type, handleApprove);
}

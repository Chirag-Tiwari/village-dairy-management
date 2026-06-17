import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { milkApi } from '@/services/milk.service';
import { CreateMilkEntryPayload } from '@/services/milk.service';
import { DailyRegisterResponse, MilkEntry } from '@/types';
import {
  fetchRegisterRequested,
  fetchRegisterSucceeded,
  fetchRegisterFailed,
  submitEntryRequested,
  submitEntrySucceeded,
  submitEntryFailed,
} from '../slices/milkSlice';

function* handleFetchRegister(action: PayloadAction<{ date: string }>) {
  try {
    const register: DailyRegisterResponse = yield call(milkApi.getDailyRegister, action.payload.date);
    yield put(fetchRegisterSucceeded(register));
  } catch (error: unknown) {
    yield put(fetchRegisterFailed(extractErrorMessage(error)));
  }
}

function* handleSubmitEntry(action: PayloadAction<CreateMilkEntryPayload>) {
  try {
    const entry: MilkEntry = yield call(milkApi.createEntry, action.payload);
    yield put(submitEntrySucceeded());
    // Refresh the register for the date just submitted so the new row
    // and updated totals appear without a manual reload.
    yield put(fetchRegisterRequested({ date: action.payload.collectionDate }));
    void entry;
  } catch (error: unknown) {
    yield put(submitEntryFailed(extractErrorMessage(error)));
  }
}

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Something went wrong. Please try again.';
}

export function* milkSaga() {
  yield takeLatest(fetchRegisterRequested.type, handleFetchRegister);
  yield takeLatest(submitEntryRequested.type, handleSubmitEntry);
}

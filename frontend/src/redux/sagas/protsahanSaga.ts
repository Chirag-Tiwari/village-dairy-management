import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { protsahanApi, ProtsahanRegisterParams } from '@/services/protsahan.service';
import { ProtsahanRegister, ProtsahanLedgerEntry } from '@/types';
import {
  fetchRegisterRequested,
  fetchRegisterSucceeded,
  fetchRegisterFailed,
  approveRequested,
  markPaidRequested,
  actionSucceeded,
  actionFailed,
  fetchMyLedgerRequested,
  fetchMyLedgerSucceeded,
} from '../slices/protsahanSlice';

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Something went wrong. Please try again.';
}

function* handleFetchRegister(action: PayloadAction<ProtsahanRegisterParams>) {
  try {
    const register: ProtsahanRegister = yield call(protsahanApi.getRegister, action.payload);
    yield put(fetchRegisterSucceeded(register));
  } catch (error: unknown) {
    yield put(fetchRegisterFailed(extractErrorMessage(error)));
  }
}

function* handleApprove(action: PayloadAction<ProtsahanRegisterParams>) {
  try {
    yield call(protsahanApi.approve, action.payload);
    yield put(actionSucceeded());
    yield put(fetchRegisterRequested(action.payload));
  } catch (error: unknown) {
    yield put(actionFailed(extractErrorMessage(error)));
  }
}

function* handleMarkPaid(action: PayloadAction<ProtsahanRegisterParams>) {
  try {
    yield call(protsahanApi.markPaid, action.payload);
    yield put(actionSucceeded());
    yield put(fetchRegisterRequested(action.payload));
  } catch (error: unknown) {
    yield put(actionFailed(extractErrorMessage(error)));
  }
}

function* handleFetchMyLedger() {
  try {
    const ledger: ProtsahanLedgerEntry[] = yield call(protsahanApi.getMyLedger);
    yield put(fetchMyLedgerSucceeded(ledger));
  } catch {
    // Read-only view for farmers; a silent failure here just leaves
    // the ledger list empty rather than blocking the whole dashboard.
  }
}

export function* protsahanSaga() {
  yield takeLatest(fetchRegisterRequested.type, handleFetchRegister);
  yield takeLatest(approveRequested.type, handleApprove);
  yield takeLatest(markPaidRequested.type, handleMarkPaid);
  yield takeLatest(fetchMyLedgerRequested.type, handleFetchMyLedger);
}

import { all } from 'redux-saga/effects';
import { authSaga } from './sagas/authSaga';
import { milkSaga } from './sagas/milkSaga';
import { monthlyPaymentSaga } from './sagas/monthlyPaymentSaga';
import { protsahanSaga } from './sagas/protsahanSaga';

export function* rootSaga() {
  yield all([authSaga(), milkSaga(), monthlyPaymentSaga(), protsahanSaga()]);
}

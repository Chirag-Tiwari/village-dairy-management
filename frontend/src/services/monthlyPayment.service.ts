import { apiClient } from './apiClient';
import { MonthlyPaymentRegister } from '@/types';

export interface MonthlyRegisterParams {
  year: number;
  month: number;
  dairyId?: string;
}

export const monthlyPaymentApi = {
  getRegister(params: MonthlyRegisterParams) {
    return apiClient
      .get<{ data: MonthlyPaymentRegister }>('/monthly-payments/register', { params })
      .then((res) => res.data.data);
  },
  verify(params: MonthlyRegisterParams) {
    return apiClient.post('/monthly-payments/verify', params).then((res) => res.data.data);
  },
  approve(params: MonthlyRegisterParams) {
    return apiClient.post('/monthly-payments/approve', params).then((res) => res.data.data);
  },
};

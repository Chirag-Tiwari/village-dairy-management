import { apiClient } from './apiClient';
import { ProtsahanRegister, ProtsahanLedgerEntry } from '@/types';

export interface ProtsahanRegisterParams {
  year: number;
  month: number;
  dairyId?: string;
}

export const protsahanApi = {
  getRegister(params: ProtsahanRegisterParams) {
    return apiClient.get<{ data: ProtsahanRegister }>('/protsahan/register', { params }).then((res) => res.data.data);
  },
  approve(params: ProtsahanRegisterParams) {
    return apiClient.post('/protsahan/approve', params).then((res) => res.data.data);
  },
  markPaid(params: ProtsahanRegisterParams) {
    return apiClient.post('/protsahan/mark-paid', params).then((res) => res.data.data);
  },
  getMyLedger() {
    return apiClient.get<{ data: ProtsahanLedgerEntry[] }>('/protsahan/me').then((res) => res.data.data);
  },
};

import { apiClient } from './apiClient';
import { DailyRegisterResponse, MilkEntry } from '@/types';

export interface CreateMilkEntryPayload {
  farmerId: string;
  collectionDate: string;
  milkQuantityL: number;
  fat: number;
  snf: number;
  ratePerLitre: number;
}

export const milkApi = {
  getDailyRegister(date: string) {
    return apiClient
      .get<{ data: DailyRegisterResponse }>('/milk/register', { params: { date } })
      .then((res) => res.data.data);
  },
  createEntry(payload: CreateMilkEntryPayload) {
    return apiClient.post<{ data: MilkEntry }>('/milk', payload).then((res) => res.data.data);
  },
  getMyHistory() {
    return apiClient.get<{ data: MilkEntry[] }>('/milk/me').then((res) => res.data.data);
  },
};

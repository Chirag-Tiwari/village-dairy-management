import { apiClient } from './apiClient';
import { Farmer } from '@/types';

export const farmerApi = {
  listForDairy() {
    return apiClient.get<{ data: Farmer[] }>('/farmers/dairy').then((res) => res.data.data);
  },
  listForRegion() {
    return apiClient.get<{ data: Farmer[] }>('/farmers/region').then((res) => res.data.data);
  },
  register(payload: { name: string; mobileNumber: string; village: string; category: string; password: string }) {
    return apiClient.post<{ data: Farmer }>('/farmers', payload).then((res) => res.data.data);
  },
};

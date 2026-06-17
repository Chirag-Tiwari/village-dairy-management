import { apiClient } from './apiClient';
import { Dairy } from '@/types';

export const dairyApi = {
  listForRegion() {
    return apiClient.get<{ data: Dairy[] }>('/dairies/region').then((res) => res.data.data);
  },
};

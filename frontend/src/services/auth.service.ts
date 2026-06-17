import { apiClient } from './apiClient';
import { AuthUser } from '@/types';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authApi = {
  login(mobileNumber: string, password: string) {
    return apiClient
      .post<{ data: LoginResponse }>('/auth/login', { mobileNumber, password })
      .then((res) => res.data.data);
  },
  logout() {
    return apiClient.post('/auth/logout');
  },
};

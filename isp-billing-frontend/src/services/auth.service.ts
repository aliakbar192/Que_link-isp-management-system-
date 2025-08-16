import api from './api';
import { LoginRequest, LoginResponse, SystemUser } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async getProfile(): Promise<SystemUser> {
    const response = await api.get<SystemUser>('/auth/profile');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getUser(): SystemUser | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: SystemUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },
};
import api from './api';
import { Transaction, CreateTransactionRequest, ApproveTransactionRequest } from '../types';

export const transactionsService = {
  async getAll(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
  },

  async getPending(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions/pending');
    return response.data;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  async create(transaction: CreateTransactionRequest): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', transaction);
    return response.data;
  },

  async approve(approval: ApproveTransactionRequest): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions/approve', approval);
    return response.data;
  },

  async getDailyCollectionReport(date: string): Promise<any[]> {
    const response = await api.get('/transactions/reports/daily', {
      params: { date },
    });
    return response.data;
  },

  async getMonthlyCollectionReport(year: number, month: number): Promise<any[]> {
    const response = await api.get('/transactions/reports/monthly', {
      params: { year, month },
    });
    return response.data;
  },
};
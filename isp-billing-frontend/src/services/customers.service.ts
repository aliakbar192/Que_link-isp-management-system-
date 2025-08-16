import api from './api';
import { Customer, CreateCustomerRequest } from '../types';

export const customersService = {
  async getAll(): Promise<Customer[]> {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  async getById(id: string): Promise<Customer> {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  async create(customer: CreateCustomerRequest): Promise<Customer> {
    const response = await api.post<Customer>('/customers', customer);
    return response.data;
  },

  async update(id: string, customer: Partial<CreateCustomerRequest>): Promise<Customer> {
    const response = await api.patch<Customer>(`/customers/${id}`, customer);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
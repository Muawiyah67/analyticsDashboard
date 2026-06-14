import { apiClient } from './client';
import { ApiResponse } from '@nexus/shared';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  created_at: string;
}

export interface CustomerMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
}

export class CustomerService {
  static async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<{ data: Customer[]; meta: CustomerMeta }>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    
    const qs = query.toString();
    return apiClient.get(`/customers${qs ? '?' + qs : ''}`);
  }

  static async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.get(`/customers/${id}`);
  }

  static async createCustomer(data: CreateCustomerData): Promise<ApiResponse<Customer>> {
    return apiClient.post('/customers', data);
  }

  static async updateCustomer(id: string, data: Partial<CreateCustomerData>): Promise<ApiResponse<Customer>> {
    return apiClient.put(`/customers/${id}`, data);
  }

  static async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/customers/${id}`);
  }

  static async getStats(): Promise<ApiResponse<CustomerStats>> {
    return apiClient.get('/customers/stats');
  }
}
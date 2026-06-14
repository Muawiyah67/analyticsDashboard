import { apiClient } from './client';
import { User, CreateUserDto, UpdateUserDto, UserListFilter, ApiResponse, PaginatedResponse } from '@nexus/shared';

interface ApiClientWithBaseUrl {
  baseUrl: string;
  get: <T>(url: string) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  delete: <T>(url: string) => Promise<ApiResponse<T>>;
}

const typedApiClient = apiClient as ApiClientWithBaseUrl;

export class UserService {
  private static readonly BASE_ENDPOINT = '/users';

  static async getUsers(
    page: number = 1,
    limit: number = 10,
    filters?: UserListFilter
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.role) params.append('role', filters.role);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return typedApiClient.get<PaginatedResponse<User>>(`${this.BASE_ENDPOINT}${query}`);
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    return typedApiClient.get<User>(`${this.BASE_ENDPOINT}/${id}`);
  }

  static async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    return typedApiClient.post<User>(`${this.BASE_ENDPOINT}`, data);
  }

  static async updateUser(id: string, data: UpdateUserDto): Promise<ApiResponse<User>> {
    return typedApiClient.put<User>(`${this.BASE_ENDPOINT}/${id}`, data);
  }

  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return typedApiClient.delete<void>(`${this.BASE_ENDPOINT}/${id}`);
  }

  static async bulkDeleteUsers(ids: string[]): Promise<ApiResponse<{ success: boolean; count: number }>> {
    return typedApiClient.post(`${this.BASE_ENDPOINT}/bulk/delete`, { ids });
  }

  static async getUserStats(): Promise<ApiResponse<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    suspended: number;
    admins: number;
  }>> {
    return typedApiClient.get(`${this.BASE_ENDPOINT}/stats`);
  }

  static async resetPassword(id: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return typedApiClient.post(`${this.BASE_ENDPOINT}/${id}/reset-password`, { newPassword });
  }

  static async exportUsers(format: 'csv' | 'xlsx', filters?: UserListFilter): Promise<Response> {
    const params = new URLSearchParams({ format });
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.role) params.append('role', filters.role);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const url = `${typedApiClient.baseUrl}${this.BASE_ENDPOINT}/export${query}`;
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }
}
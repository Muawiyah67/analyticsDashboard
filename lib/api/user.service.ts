import { apiClient } from './client';
import { User, CreateUserDto, UpdateUserDto, UserListFilter, ApiResponse, PaginatedResponse } from '@/lib/types';

// Define the apiClient interface to expose baseUrl safely
interface ApiClient {
  baseUrl: string;
  get: <T>(url: string) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>;
  delete: <T>(url: string) => Promise<ApiResponse<T>>;
}

// Cast the imported apiClient to our interface
const typedApiClient = apiClient as ApiClient;

export class UserService {
  private static readonly BASE_ENDPOINT = '/users';

  /**
   * Get paginated list of users
   */
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

    const query = `?${params.toString()}`;
    return typedApiClient.get<PaginatedResponse<User>>(`${this.BASE_ENDPOINT}${query}`);
  }

  /**
   * Get single user by ID
   */
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    return typedApiClient.get<User>(`${this.BASE_ENDPOINT}/${id}`);
  }

  /**
   * Create new user
   */
  static async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    return typedApiClient.post<User>(`${this.BASE_ENDPOINT}`, data);
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UpdateUserDto): Promise<ApiResponse<User>> {
    return typedApiClient.put<User>(`${this.BASE_ENDPOINT}/${id}`, data);
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return typedApiClient.delete<void>(`${this.BASE_ENDPOINT}/${id}`);
  }

  /**
   * Bulk delete users
   */
  static async bulkDeleteUsers(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    return typedApiClient.post<{ deletedCount: number }>(`${this.BASE_ENDPOINT}/bulk-delete`, { ids });
  }

  /**
   * Export users to file
   */
  static async exportUsers(format: 'csv' | 'xlsx', filters?: UserListFilter): Promise<Response> {
    const params = new URLSearchParams({ format });
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.role) params.append('role', filters.role);
    }
    const query = `?${params.toString()}`;
    const url = `${typedApiClient.baseUrl}${this.BASE_ENDPOINT}/export${query}`;
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  }>> {
    return typedApiClient.get(`${this.BASE_ENDPOINT}/stats`);
  }

  /**
   * Reset user password
   */
  static async resetPassword(id: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    return typedApiClient.post(`${this.BASE_ENDPOINT}/${id}/reset-password`, {});
  }

  /**
   * Update user status (activate/suspend)
   */
  static async updateUserStatus(id: string, status: string): Promise<ApiResponse<User>> {
    return typedApiClient.patch<User>(`${this.BASE_ENDPOINT}/${id}/status`, { status });
  }
}
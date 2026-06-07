import { apiClient } from './client';
import { Order, CreateOrderDto, UpdateOrderDto, OrderListFilter, ApiResponse, PaginatedResponse } from '@/lib/types';

export class OrderService {
  private static readonly BASE_ENDPOINT = '/orders';

  /**
   * Get paginated list of orders
   */
  static async getOrders(
    page: number = 1,
    limit: number = 10,
    filters?: OrderListFilter
  ): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
      if (filters.minAmount) params.append('minAmount', String(filters.minAmount));
      if (filters.maxAmount) params.append('maxAmount', String(filters.maxAmount));
    }

    const query = `?${params.toString()}`;
    return apiClient.get<PaginatedResponse<Order>>(`${this.BASE_ENDPOINT}${query}`);
  }

  /**
   * Get single order by ID
   */
  static async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`${this.BASE_ENDPOINT}/${id}`);
  }

  /**
   * Get orders by customer ID
   */
  static async getOrdersByCustomer(customerId: string): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>(`${this.BASE_ENDPOINT}/customer/${customerId}`);
  }

  /**
   * Create new order
   */
  static async createOrder(data: CreateOrderDto): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`${this.BASE_ENDPOINT}`, data);
  }

  /**
   * Update order
   */
  static async updateOrder(id: string, data: UpdateOrderDto): Promise<ApiResponse<Order>> {
    return apiClient.put<Order>(`${this.BASE_ENDPOINT}/${id}`, data);
  }

  /**
   * Cancel order
   */
  static async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`${this.BASE_ENDPOINT}/${id}/cancel`, { reason });
  }

  /**
   * Ship order
   */
  static async shipOrder(id: string, trackingNumber: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`${this.BASE_ENDPOINT}/${id}/ship`, { trackingNumber });
  }

  /**
   * Delete order
   */
  static async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_ENDPOINT}/${id}`);
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  }>> {
    return apiClient.get<{
      total: number;
      pending: number;
      processing: number;
      completed: number;
      cancelled: number;
      totalRevenue: number;
    }>(`${this.BASE_ENDPOINT}/stats`);
  }

  /**
   * Export orders to file
   */
  static async exportOrders(format: 'csv' | 'xlsx', filters?: OrderListFilter): Promise<Response> {
    const params = new URLSearchParams({ format });
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.customerId) params.append('customerId', filters.customerId);
    }
    const query = `?${params.toString()}`;
    const url = `${apiClient.baseUrl}${this.BASE_ENDPOINT}/export${query}`;
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }

  /**
   * Generate invoice for order
   */
  static async generateInvoice(id: string): Promise<Response> {
    const url = `${apiClient.baseUrl}${this.BASE_ENDPOINT}/${id}/invoice`;
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }

  /**
   * Send order confirmation email
   */
  static async sendConfirmationEmail(id: string): Promise<ApiResponse<{ sent: boolean }>> {
    return apiClient.post<{ sent: boolean }>(`${this.BASE_ENDPOINT}/${id}/send-confirmation`, {});
  }
}
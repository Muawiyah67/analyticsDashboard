import { apiClient } from './client';
import { DashboardStats, RevenueChart, TrafficData, TopPage, TopProduct, AnalyticsDateRange, ApiResponse, PaginatedResponse } from '@/lib/types';

export class AnalyticsService {
  private static readonly BASE_ENDPOINT = '/analytics';

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(dateRange?: AnalyticsDateRange): Promise<ApiResponse<DashboardStats>> {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('startDate', dateRange.startDate.toISOString());
      params.append('endDate', dateRange.endDate.toISOString());
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<DashboardStats>(`${this.BASE_ENDPOINT}/stats${query}`);
  }

  /**
   * Get revenue chart data
   */
  static async getRevenueData(period: 'weekly' | 'monthly' | 'quarterly' | 'annual'): Promise<ApiResponse<RevenueChart[]>> {
    return apiClient.get<RevenueChart[]>(`${this.BASE_ENDPOINT}/revenue?period=${period}`);
  }

  /**
   * Get traffic data
   */
  static async getTrafficData(period: 'week' | 'month'): Promise<ApiResponse<TrafficData[]>> {
    return apiClient.get<TrafficData[]>(`${this.BASE_ENDPOINT}/traffic?period=${period}`);
  }

  /**
   * Get top pages
   */
  static async getTopPages(limit: number = 10): Promise<ApiResponse<TopPage[]>> {
    return apiClient.get<TopPage[]>(`${this.BASE_ENDPOINT}/top-pages?limit=${limit}`);
  }

  /**
   * Get top products
   */
  static async getTopProducts(limit: number = 10): Promise<ApiResponse<TopProduct[]>> {
    return apiClient.get<TopProduct[]>(`${this.BASE_ENDPOINT}/top-products?limit=${limit}`);
  }

  /**
   * Get custom analytics data
   */
  static async getCustomAnalytics(
    metric: string,
    filters?: Record<string, unknown>
  ): Promise<ApiResponse<unknown>> {
    const params = new URLSearchParams({ metric });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<unknown>(`${this.BASE_ENDPOINT}/custom${query}`);
  }

  /**
   * Export analytics report
   */
  static async exportAnalytics(
    format: 'pdf' | 'csv' | 'xlsx',
    filters?: Record<string, unknown>
  ): Promise<Response> {
    const params = new URLSearchParams({ format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const url = `${apiClient.baseUrl}${this.BASE_ENDPOINT}/export${query}`;
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }
}
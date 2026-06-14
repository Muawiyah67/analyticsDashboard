import { apiClient } from './client';
import { Product, CreateProductDto, UpdateProductDto, ProductListFilter, ApiResponse, PaginatedResponse } from '@nexus/shared';

export class ProductService {
  private static readonly BASE_ENDPOINT = '/products';

  static async getProducts(
    page: number = 1,
    limit: number = 10,
    filters?: ProductListFilter
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    }

    const query = `?${params.toString()}`;
    return apiClient.get<PaginatedResponse<Product>>(`${this.BASE_ENDPOINT}${query}`);
  }

  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`${this.BASE_ENDPOINT}/${id}`);
  }

  static async getProductBySku(sku: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`${this.BASE_ENDPOINT}/sku/${sku}`);
  }

  static async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`${this.BASE_ENDPOINT}/categories`);
  }

  static async getLowStock(limit: number = 10): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`${this.BASE_ENDPOINT}/low-stock?limit=${limit}`);
  }

  static async getProductStats(): Promise<ApiResponse<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalStock: number;
    averagePrice: number;
  }>> {
    return apiClient.get(`${this.BASE_ENDPOINT}/stats`);
  }

  static async createProduct(data: CreateProductDto): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>(`${this.BASE_ENDPOINT}`, data);
  }

  static async updateProduct(id: string, data: UpdateProductDto): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`${this.BASE_ENDPOINT}/${id}`, data);
  }

  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_ENDPOINT}/${id}`);
  }

  static async bulkUpdateStatus(ids: string[], status: string): Promise<ApiResponse<{ success: boolean; count: number }>> {
    return apiClient.post(`${this.BASE_ENDPOINT}/bulk/update`, { ids, status });
  }

  static async bulkDelete(ids: string[]): Promise<ApiResponse<{ success: boolean; count: number }>> {
    return apiClient.post(`${this.BASE_ENDPOINT}/bulk/delete`, { ids });
  }
}
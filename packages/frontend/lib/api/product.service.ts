import { apiClient } from './client';
import { Product, CreateProductDto, UpdateProductDto, ProductListFilter, ApiResponse, PaginatedResponse } from '@/lib/types';

export class ProductService {
  private static readonly BASE_ENDPOINT = '/products';

  /**
   * Get paginated list of products
   */
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
      if (filters.inStock !== undefined) params.append('inStock', String(filters.inStock));
    }

    const query = `?${params.toString()}`;
    return apiClient.get<PaginatedResponse<Product>>(`${this.BASE_ENDPOINT}${query}`);
  }

  /**
   * Get single product by ID
   */
  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`${this.BASE_ENDPOINT}/${id}`);
  }

  /**
   * Get product by SKU
   */
  static async getProductBySku(sku: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`${this.BASE_ENDPOINT}/sku/${sku}`);
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`${this.BASE_ENDPOINT}/category/${category}`);
  }

  /**
   * Create new product
   */
  static async createProduct(data: CreateProductDto): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>(`${this.BASE_ENDPOINT}`, data);
  }

  /**
   * Update product
   */
  static async updateProduct(id: string, data: UpdateProductDto): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`${this.BASE_ENDPOINT}/${id}`, data);
  }

  /**
   * Update product stock
   */
  static async updateStock(id: string, quantity: number): Promise<ApiResponse<Product>> {
    return apiClient.patch<Product>(`${this.BASE_ENDPOINT}/${id}/stock`, { quantity });
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_ENDPOINT}/${id}`);
  }

  /**
   * Bulk update product status
   */
  static async bulkUpdateStatus(ids: string[], status: string): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.post<{ updatedCount: number }>(`${this.BASE_ENDPOINT}/bulk-update-status`, { ids, status });
  }

  /**
   * Get product statistics
   */
  static async getProductStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    totalValue: number;
  }>> {
    return apiClient.get<{
      total: number;
      active: number;
      inactive: number;
      outOfStock: number;
      totalValue: number;
    }>(`${this.BASE_ENDPOINT}/stats`);
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(limit: number = 20): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`${this.BASE_ENDPOINT}/low-stock?limit=${limit}`);
  }

  /**
   * Get categories
   */
  static async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`${this.BASE_ENDPOINT}/categories`);
  }

  /**
   * Export products to file
   */
  static async exportProducts(format: 'csv' | 'xlsx', filters?: ProductListFilter): Promise<Response> {
    const params = new URLSearchParams({ format });
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
    }
    const query = `?${params.toString()}`;
    const url = `${apiClient.baseUrl}${this.BASE_ENDPOINT}/export${query}`;
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }

  /**
   * Bulk delete products
   */
  static async bulkDeleteProducts(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    return apiClient.post<{ deletedCount: number }>(`${this.BASE_ENDPOINT}/bulk-delete`, { ids });
  }
}
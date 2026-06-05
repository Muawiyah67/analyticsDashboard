/**
 * API Services Index
 * Export all services for easy importing
 */

export { apiClient, ApiClient } from './client';
export { AuthService } from './auth.service';
export { AnalyticsService } from './analytics.service';
export { UserService } from './user.service';
export { OrderService } from './order.service';
export { ProductService } from './product.service';

// Re-export all types
export * from '@/lib/types';

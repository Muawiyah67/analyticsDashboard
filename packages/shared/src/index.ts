/* ============================================================================
   PAGINATION & COMMON TYPES
   ============================================================================ */

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

/* ============================================================================
   USER TYPES
   ============================================================================ */

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer',
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserDto {
  email: string;
  name: string;
  phone?: string;
  role?: UserRole;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserListFilter {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  dateFrom?: Date;
  dateTo?: Date;
}

/* ============================================================================
   ORDER TYPES
   ============================================================================ */

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: User;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export interface CreateOrderDto {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  notes?: string;
  shippingAddress?: string;
  billingAddress?: string;
}

export interface OrderListFilter {
  search?: string;
  status?: OrderStatus;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

/* ============================================================================
   PRODUCT TYPES
   ============================================================================ */

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  images?: string[];
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  lowStockThreshold?: number;
  images?: string[];
  status?: ProductStatus;
}

export interface UpdateProductDto {
  sku?: string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  cost?: number;
  stock?: number;
  lowStockThreshold?: number;
  status?: ProductStatus;
  images?: string[];
}

export interface ProductListFilter {
  search?: string;
  category?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/* ============================================================================
   ANALYTICS TYPES
   ============================================================================ */
export interface DashboardStats {
  totalRevenue: number;
  activeCustomers: number;
  totalOrders: number;
  totalProducts: number;
  pageViews: number;
  revenueChange?: number;
  usersChange?: number;
  ordersChange?: number;
  pageViewsChange?: number;
  conversionRate?: number;
  avgSessionDuration?: number;
}


export interface RevenueChart {
  month: string;
  revenue: number;
  expenses: number;
}

export interface TrafficData {
  day: string;
  organic: number;
  paid: number;
  referral: number;
}

export interface TopPage {
  url: string;
  views: number;
  uniqueVisitors: number;
  avgDuration: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  rating: number;
}

export interface AnalyticsDateRange {
  startDate: Date;
  endDate: Date;
}

/* ============================================================================
   REPORT TYPES
   ============================================================================ */

export enum ReportType {
  SALES = 'sales',
  REVENUE = 'revenue',
  ANALYTICS = 'analytics',
  PRODUCTS = 'products',
  CUSTOMERS = 'customers',
  FORECAST = 'forecast',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed',
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  status: ReportStatus;
  generatedBy: string;
  fileUrl?: string;
  fileSize?: number;
  fileContent?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  filters?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
   slug?: string;
}

export interface CreateReportDto {
  name: string;
  type: ReportType;
  description?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  filters?: Record<string, unknown>;
}

export interface ReportListFilter {
  type?: ReportType;
  status?: ReportStatus;
  dateFrom?: string;
  dateTo?: string;
}

/* ============================================================================
   AUTHENTICATION TYPES
   ============================================================================ */

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
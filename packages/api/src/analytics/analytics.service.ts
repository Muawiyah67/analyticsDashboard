import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getDashboardStats(companyId: string) {
    if (!companyId) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        activeCustomers: 0,
        totalProducts: 0,
        pageViews: 0,
        revenueChange: 0,
        usersChange: 0,
        ordersChange: 0,
        pageViewsChange: 0,
      };
    }

    const { data: orders } = await this.supabase
      .getClient()
      .from('orders')
      .select('total_amount, status')
      .eq('company_id', companyId);

    const { data: customers } = await this.supabase
      .getClient()
      .from('customers')
      .select('id')
      .eq('company_id', companyId);

    const { data: products } = await this.supabase
      .getClient()
      .from('products')
      .select('id, status')
      .eq('company_id', companyId);

    const { data: events } = await this.supabase
      .getClient()
      .from('analytics_events')
      .select('event_type')
      .eq('company_id', companyId);

    const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const activeCustomers = customers?.length || 0;
    const totalProducts = products?.length || 0;
    const pageViews = events?.filter(e => e.event_type === 'page_view').length || 0;

    return {
      totalRevenue,
      totalOrders,
      activeCustomers,
      totalProducts,
      pageViews,
      revenueChange: 0,
      usersChange: 0,
      ordersChange: 0,
      pageViewsChange: 0,
    };
  }

  async getRevenueData(companyId: string, period: string = 'month') {
    if (!companyId) return [];

    const { data, error } = await this.supabase
      .getClient()
      .from('orders')
      .select('created_at, total_amount')
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    const grouped = data?.reduce((acc, order) => {
      const date = new Date(order.created_at);
      const key = period === 'week' 
        ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      acc[key] = (acc[key] || 0) + (order.total_amount || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped || {}).map(([month, revenue]) => ({
      month,
      revenue,
      expenses: revenue * 0.6,
    }));
  }

  async getTrafficData(companyId: string, period: string = 'month') {
    if (!companyId) return [];

    const { data, error } = await this.supabase
      .getClient()
      .from('analytics_events')
      .select('created_at, event_type')
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    const grouped = data?.reduce((acc, event) => {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { organic: 0, paid: 0, referral: 0, direct: 0 };
      acc[date]['direct'] += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(grouped || {}).map(([day, sources]) => ({
      day,
      ...sources,
    }));
  }

  async getTopPages(companyId: string, limit = 5) {
    if (!companyId) return [];

    const { data, error } = await this.supabase
      .getClient()
      .from('analytics_events')
      .select('page_url')
      .eq('company_id', companyId)
      .eq('event_type', 'page_view');

    if (error) throw new Error(error.message);

    const counts = data?.reduce((acc, event) => {
      acc[event.page_url] = (acc[event.page_url] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([url, views]) => ({ url, views }));
  }

  async getTopProducts(companyId: string, limit = 5) {
    if (!companyId) return [];

    const { data, error } = await this.supabase
      .getClient()
      .from('order_items')
      .select('product_id, quantity, products(name)')
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);

    const counts = (data as any[])?.reduce((acc, item) => {
      const productName = item.products?.name || item.product_id;
      acc[productName] = (acc[productName] || 0) + (item.quantity || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts || {})
      .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
      .slice(0, limit)
      .map(([name, sales]: [string, any]) => ({ name, sales }));
  }

  async exportAnalytics(companyId: string, format: string = 'csv') {
    const stats = await this.getDashboardStats(companyId);
    const revenue = await this.getRevenueData(companyId);
    const topProducts = await this.getTopProducts(companyId);

    return {
      stats,
      revenue,
      topProducts,
      exportedAt: new Date().toISOString(),
      format,
    };
  }
}
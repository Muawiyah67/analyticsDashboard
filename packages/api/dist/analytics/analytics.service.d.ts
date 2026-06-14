import { SupabaseService } from '../supabase/supabase.service';
export declare class AnalyticsService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    getDashboardStats(companyId: string): Promise<{
        totalRevenue: any;
        totalOrders: number;
        activeCustomers: number;
        totalProducts: number;
        pageViews: number;
        revenueChange: number;
        usersChange: number;
        ordersChange: number;
        pageViewsChange: number;
    }>;
    getRevenueData(companyId: string, period?: string): Promise<{
        month: string;
        revenue: number;
        expenses: number;
    }[]>;
    getTrafficData(companyId: string, period?: string): Promise<any[]>;
    getTopPages(companyId: string, limit?: number): Promise<{
        url: string;
        views: number;
    }[]>;
    getTopProducts(companyId: string, limit?: number): Promise<{
        name: string;
        sales: any;
    }[]>;
    exportAnalytics(companyId: string, format?: string): Promise<{
        stats: {
            totalRevenue: any;
            totalOrders: number;
            activeCustomers: number;
            totalProducts: number;
            pageViews: number;
            revenueChange: number;
            usersChange: number;
            ordersChange: number;
            pageViewsChange: number;
        };
        revenue: {
            month: string;
            revenue: number;
            expenses: number;
        }[];
        topProducts: {
            name: string;
            sales: any;
        }[];
        exportedAt: string;
        format: string;
    }>;
}

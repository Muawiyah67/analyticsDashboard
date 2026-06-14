import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStats(companyId: string): Promise<{
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
    getRevenue(companyId: string, period?: string): Promise<{
        month: string;
        revenue: number;
        expenses: number;
    }[]>;
    getTraffic(companyId: string, period?: string): Promise<any[]>;
    getTopPages(companyId: string, limit?: string): Promise<{
        url: string;
        views: number;
    }[]>;
    getTopProducts(companyId: string, limit?: string): Promise<{
        name: string;
        sales: any;
    }[]>;
    getDashboard(companyId: string): Promise<{
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
    }>;
    export(companyId: string, format?: string): Promise<{
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

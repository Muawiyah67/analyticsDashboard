export declare enum RevenuePeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    ANNUAL = "annual"
}
export declare enum TrafficPeriod {
    WEEK = "week",
    MONTH = "month"
}
export declare enum TopItemType {
    PRODUCTS = "products",
    PAGES = "pages"
}
export declare class AnalyticsStatsQueryDto {
    startDate?: string;
    endDate?: string;
}
export declare class RevenueQueryDto {
    period?: RevenuePeriod;
    startDate?: string;
    endDate?: string;
}
export declare class TrafficQueryDto {
    period?: TrafficPeriod;
    startDate?: string;
    endDate?: string;
}
export declare class TopItemsQueryDto {
    limit?: number;
    type?: TopItemType;
}

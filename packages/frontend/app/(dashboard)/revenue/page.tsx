"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ArrowUpRight, DollarSign, Download, TrendingUp, Percent } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsService } from "@/lib/api/analytics.service";

const RevenueChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => ({ default: m.RevenueChart })),
  { ssr: false }
);

interface RevenueMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

interface RevenueDay {
  date: string;
  amount: number;
}

interface ProductRevenue {
  name: string;
  amount: number;
}

interface DashboardStats {
  totalRevenue?: number;
  activeCustomers?: number;
  totalOrders?: number;
  totalProducts?: number;
  pageViews?: number;
}

interface TopProduct {
  name: string;
  sales: number;
}

export default function RevenuePage() {
  const [period, setPeriod] = useState("monthly");
  const [metrics, setMetrics] = useState<RevenueMetric[]>([]);
  const [topRevenueDays, setTopRevenueDays] = useState<RevenueDay[]>([]);
  const [revenueByProduct, setRevenueByProduct] = useState<ProductRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, revenueRes, productsRes] = await Promise.all([
          AnalyticsService.getDashboardStats(),
          AnalyticsService.getRevenueData(period as "daily" | "weekly" | "monthly" | "quarterly" | "annual"),
          AnalyticsService.getTopProducts(5),
        ]);

        if (statsRes.success && statsRes.data) {
          const stats = statsRes.data as DashboardStats;
          const totalRevenue = stats.totalRevenue || 0;
          const totalOrders = stats.totalOrders || 0;
          const pageViews = stats.pageViews || 1;
          const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          const conversionRate = (totalOrders / Math.max(pageViews, 1)) * 100;
          
          setMetrics([
            {
              label: "Total Revenue",
              value: `$${totalRevenue.toLocaleString()}`,
              change: 12.5,
              icon: DollarSign,
            },
            {
              label: "Average Order Value",
              value: `$${avgOrderValue.toFixed(2)}`,
              change: 3.2,
              icon: TrendingUp,
            },
            {
              label: "Revenue Growth",
              value: `+$${(totalRevenue * 0.147).toFixed(0)}`,
              change: 18.7,
              icon: TrendingUp,
            },
            {
              label: "Conversion Rate",
              value: `${conversionRate.toFixed(1)}%`,
              change: 2.3,
              icon: Percent,
            },
          ]);
        }

        if (revenueRes.success && revenueRes.data) {
          const revenueData = revenueRes.data as RevenueDataPoint[];
          const sorted = [...revenueData]
            .sort((a: RevenueDataPoint, b: RevenueDataPoint) => b.revenue - a.revenue)
            .slice(0, 4)
            .map((d: RevenueDataPoint) => ({
              date: new Date(d.month).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              amount: d.revenue,
            }));
          setTopRevenueDays(sorted);
        }

        if (productsRes.success && productsRes.data) {
          const products = (productsRes.data as TopProduct[]).map((p: TopProduct) => ({
            name: p.name || 'Unknown',
            amount: p.sales * 50,
          }));
          setRevenueByProduct(products);
        }
      } catch (err) {
        console.error("Failed to fetch revenue data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const csvContent = [
        ["Revenue Report", new Date().toLocaleDateString()],
        ["Period", period],
        [],
        ["Metric", "Value", "Change"],
        ...metrics.map((m) => [m.label, m.value, `+${m.change}%`]),
        [],
        ["Top Revenue Days", "Amount"],
        ...topRevenueDays.map((d) => [d.date, `$${d.amount.toLocaleString()}`]),
        [],
        ["Revenue by Product", "Amount"],
        ...revenueByProduct.map((p) => [p.name, `$${p.amount.toLocaleString()}`]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-report-${period}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const maxDayAmount = Math.max(...topRevenueDays.map((d) => d.amount), 1);
  const maxProductAmount = Math.max(...revenueByProduct.map((p) => p.amount), 1);

  if (loading) return <div className="p-8">Loading revenue data...</div>;

  return (
    <>
      <PageHeader
        title="Revenue"
        description="Revenue trends and financial performance"
        action={{
          label: exporting ? "Exporting..." : "Export",
          icon: Download,
          onClick: handleExport,
          disabled: exporting,
        }}
      />

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="h-9 bg-muted">
          <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly" className="text-xs">Quarterly</TabsTrigger>
          <TabsTrigger value="annual" className="text-xs">Annual</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{metric.value}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">+{metric.change}%</span>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RevenueChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Revenue Days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topRevenueDays.length > 0 ? topRevenueDays.map((day) => (
              <div key={day.date}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{day.date}</span>
                  <span className="text-sm font-semibold text-card-foreground">${day.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-2 rounded-full bg-primary" 
                    style={{ width: `${(day.amount / maxDayAmount) * 100}%` }} 
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No revenue data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue by Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueByProduct.length > 0 ? revenueByProduct.map((product) => (
              <div key={product.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{product.name}</span>
                  <span className="text-sm font-semibold text-card-foreground">${product.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-2 rounded-full bg-primary" 
                    style={{ width: `${(product.amount / maxProductAmount) * 100}%` }} 
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No product data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
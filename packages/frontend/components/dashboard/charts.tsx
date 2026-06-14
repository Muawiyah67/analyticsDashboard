"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsService } from "@/lib/api/analytics.service";
import { ProductService } from "@/lib/api/product.service";
import { RevenueChart as RevenueChartData, TrafficData, TopProduct } from "@nexus/shared";

const formatCurrency = (value: number) =>
  `$${(value / 1000).toFixed(0)}k`;

// --- Revenue Chart (real data from AnalyticsService) ---
export function RevenueChart() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "quarterly" | "annual">("monthly");
  const [data, setData] = useState<RevenueChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const res = await AnalyticsService.getRevenueData(period);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch revenue:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [period]);

  if (loading) {
    return (
      <Card className="border border-border shadow-sm col-span-1 lg:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-card-foreground">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading revenue data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm col-span-1 lg:col-span-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">Revenue Overview</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-0.5">
              Revenue vs expenses comparison
            </CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList className="h-8 bg-muted">
              <TabsTrigger value="weekly" className="text-xs h-6 px-3">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-6 px-3">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly" className="text-xs h-6 px-3">Quarterly</TabsTrigger>
              <TabsTrigger value="annual" className="text-xs h-6 px-3">Annual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "currentColor" }} axisLine={false} tickLine={false} className="text-muted-foreground" />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "currentColor" }} axisLine={false} tickLine={false} className="text-muted-foreground" />
           <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
           />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revenueGradient)" />
            <Area type="monotone" dataKey="expenses" stroke="#94a3b8" strokeWidth={2} fill="url(#expensesGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// --- Traffic Chart (real data from AnalyticsService) ---
export function TrafficChart() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [data, setData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraffic = async () => {
      setLoading(true);
      try {
        const res = await AnalyticsService.getTrafficData(period);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch traffic:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraffic();
  }, [period]);

  if (loading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-card-foreground">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading traffic data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">Traffic Sources</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-0.5">
              Visitor acquisition this {period}
            </CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList className="h-8 bg-muted">
              <TabsTrigger value="week" className="text-xs h-6 px-3">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs h-6 px-3">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "currentColor" }} axisLine={false} tickLine={false} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 12, fill: "currentColor" }} axisLine={false} tickLine={false} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
            />
            <Bar dataKey="organic" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="paid" stackId="a" fill="#10b981" />
            <Bar dataKey="referral" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 justify-center">
          {[
            { label: "Organic", color: "#3b82f6" },
            { label: "Paid", color: "#10b981" },
            { label: "Referral", color: "#f59e0b" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Category Chart (real data from products + top products) ---
export function CategoryChart() {
  const [categoryData, setCategoryData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch products to get categories, and top products for sales
        const [productsRes, topProductsRes] = await Promise.all([
          ProductService.getProducts(1, 1000),
          AnalyticsService.getTopProducts(10),
        ]);

        if (productsRes.success && productsRes.data && topProductsRes.success && topProductsRes.data) {
          const products = productsRes.data.data;
          const topProducts = topProductsRes.data;

          // Build a map of product ID to category
          const productCategoryMap = new Map<string, string>();
          products.forEach((p) => {
            productCategoryMap.set(p.id, p.category || "Uncategorized");
          });

          // Aggregate sales by category
          const categorySales = new Map<string, number>();
          topProducts.forEach((product: TopProduct) => {
            const cat = productCategoryMap.get(product.id) || "Uncategorized";
            categorySales.set(cat, (categorySales.get(cat) || 0) + product.sales);
          });

          const total = Array.from(categorySales.values()).reduce((a, b) => a + b, 0) || 1;
          const data = Array.from(categorySales.entries()).map(([name, sales], i) => ({
            name,
            value: Math.round((sales / total) * 100),
            color: colors[i % colors.length],
          }));

          data.sort((a, b) => b.value - a.value);
          setCategoryData(data);
        }
      } catch (err) {
        console.error("Failed to fetch category data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, []);

  if (loading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-card-foreground">Sales by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading category data...</p>
        </CardContent>
      </Card>
    );
  }

  if (categoryData.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-card-foreground">Sales by Category</CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-0.5">
            No sales data yet
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[180px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Create orders to see category distribution</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-card-foreground">Sales by Category</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-0.5">
          Distribution this quarter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-1">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
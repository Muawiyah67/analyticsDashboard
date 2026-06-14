"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Download, Eye, TrendingUp, Users, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsService } from "@/lib/api/analytics.service";
import { DashboardStats, TopPage, TrafficData } from "@nexus/shared";

const AnalyticsChart = dynamic(
  () =>
    import("@/components/dashboard/charts").then((m) => ({
      default: m.RevenueChart,
    })),
  { ssr: false }
);

const iconMap: Record<string, React.ElementType> = {
  "Page Views": Eye,
  "Unique Visitors": Users,
  "Conversion Rate": TrendingUp,
  "Avg. Session Duration": Clock,
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("month");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [traffic, setTraffic] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, pagesRes, trafficRes] = await Promise.all([
          AnalyticsService.getDashboardStats(),
          AnalyticsService.getTopPages(5),
          AnalyticsService.getTrafficData(
            period === "week" ? "week" : "month"
          ),
        ]);
        if (statsRes.success) setStats(statsRes.data!);
        if (pagesRes.success) setTopPages(pagesRes.data!);
        if (trafficRes.success) setTraffic(trafficRes.data!);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  // Calculate traffic source distribution from real data
  const trafficSources = (() => {
    if (traffic.length === 0) return [];
    
    const totals = { organic: 0, paid: 0, referral: 0 };
    traffic.forEach((t) => {
      totals.organic += t.organic;
      totals.paid += t.paid;
      totals.referral += t.referral;
    });
    
    const total = totals.organic + totals.paid + totals.referral || 1;
    
    return [
      { source: "Organic", visits: `${((totals.organic / total) * 100).toFixed(1)}%`, color: "bg-blue-500" },
      { source: "Paid", visits: `${((totals.paid / total) * 100).toFixed(1)}%`, color: "bg-emerald-500" },
      { source: "Referral", visits: `${((totals.referral / total) * 100).toFixed(1)}%`, color: "bg-amber-500" },
    ];
  })();

  // Calculate conversion rate from existing stats
  const conversionRate = stats && stats.activeCustomers > 0
    ? ((stats.totalOrders / stats.activeCustomers) * 100).toFixed(2)
    : "0.00";

  const handleExport = async () => {
    setExporting(true);
    try {
      const csvContent = [
        ["Analytics Report", new Date().toLocaleDateString()],
        ["Period", period],
        [],
        ["Metric", "Value", "Change"],
        stats
          ? [
              ["Page Views", stats.pageViews.toLocaleString(), `${stats.pageViewsChange ?? 0}%`],
              ["Unique Visitors", stats.activeCustomers.toLocaleString(), `${stats.usersChange ?? 0}%`],
              ["Conversion Rate", `${conversionRate}%`, "N/A"],
              ["Avg. Session Duration", "N/A", "N/A"],
            ]
          : [],
        [],
        ["Top Pages", "Views", "Unique Visitors", "Avg Duration"],
        ...topPages.map((p) => [
          p.url,
          p.views.toLocaleString(),
          p.uniqueVisitors?.toLocaleString() || "0",
          `${p.avgDuration || 0}s`,
        ]),
        [],
        ["Traffic Source", "Percentage"],
        ...trafficSources.map((t) => [t.source, t.visits]),
      ]
        .flat()
        .map((row) => (Array.isArray(row) ? row.join(",") : row))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-report-${period}-${new Date().toISOString().split("T")[0]}.csv`;
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

  const metrics = stats
    ? [
        {
          label: "Page Views",
          value: stats.pageViews.toLocaleString(),
          change: stats.pageViewsChange ?? 0,
          icon: iconMap["Page Views"],
        },
        {
          label: "Unique Visitors",
          value: stats.activeCustomers.toLocaleString(),
          change: stats.usersChange ?? 0,
          icon: iconMap["Unique Visitors"],
        },
        {
          label: "Conversion Rate",
          value: `${conversionRate}%`,
          change: 0,
          icon: iconMap["Conversion Rate"],
        },
        {
          label: "Avg. Session Duration",
          value: "N/A",
          change: 0,
          icon: iconMap["Avg. Session Duration"],
        },
      ]
    : [];

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Detailed performance metrics and insights"
        action={{
          label: exporting ? "Exporting..." : "Export Report",
          icon: Download,
          onClick: handleExport,
          disabled: exporting,
        }}
      />

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="h-9 bg-muted">
          <TabsTrigger value="week" className="text-xs">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="text-xs">
            This Month
          </TabsTrigger>
          <TabsTrigger value="quarter" className="text-xs">
            This Quarter
          </TabsTrigger>
          <TabsTrigger value="year" className="text-xs">
            This Year
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  {metric.change !== 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600">
                        +{metric.change}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs last period
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnalyticsChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topPages.map((page) => (
              <div
                key={page.url}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50"
              >
                <span className="text-sm font-medium text-card-foreground">
                  {page.url}
                </span>
                <span className="text-sm text-muted-foreground">
                  {page.views.toLocaleString()} views
                </span>
              </div>
            ))}
            {topPages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No page data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Traffic Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${source.color}`} />
                <span className="flex-1 text-sm font-medium text-card-foreground">
                  {source.source}
                </span>
                <span className="text-sm font-semibold text-card-foreground">
                  {source.visits}
                </span>
              </div>
            ))}
            {trafficSources.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No traffic data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
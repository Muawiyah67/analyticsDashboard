"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Download, Eye, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalyticsChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => ({ default: m.RevenueChart })),
  { ssr: false }
);

const metrics = [
  { label: "Page Views", value: "1.2M", change: 18.7, icon: Eye },
  { label: "Unique Visitors", value: "324K", change: 12.3, icon: Users },
  { label: "Conversion Rate", value: "3.24%", change: 2.1, icon: TrendingUp },
  { label: "Avg. Session Duration", value: "4m 32s", change: 8.5, icon: TrendingUp },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("month");

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Detailed performance metrics and insights"
        action={{ label: "Export Report", icon: Download }}
      />

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="h-9 bg-muted">
          <TabsTrigger value="week" className="text-xs">This Week</TabsTrigger>
          <TabsTrigger value="month" className="text-xs">This Month</TabsTrigger>
          <TabsTrigger value="quarter" className="text-xs">This Quarter</TabsTrigger>
          <TabsTrigger value="year" className="text-xs">This Year</TabsTrigger>
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
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
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

      <AnalyticsChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["/", "/products", "/pricing", "/about"].map((page, index) => (
              <div key={page} className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50">
                <span className="text-sm font-medium text-card-foreground">{page}</span>
                <span className="text-sm text-muted-foreground">{[24521, 18943, 12384, 9284][index].toLocaleString()} views</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Traffic Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { source: "Direct", visits: "42.5%", color: "bg-blue-500" },
              { source: "Google Search", visits: "32.1%", color: "bg-emerald-500" },
              { source: "Social Media", visits: "18.3%", color: "bg-amber-500" },
              { source: "Other", visits: "7.1%", color: "bg-muted-foreground" },
            ].map((source) => (
              <div key={source.source} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${source.color}`} />
                <span className="flex-1 text-sm font-medium text-card-foreground">{source.source}</span>
                <span className="text-sm font-semibold text-card-foreground">{source.visits}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

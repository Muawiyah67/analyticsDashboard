"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowUpRight, DollarSign, Download, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RevenueChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => ({ default: m.RevenueChart })),
  { ssr: false }
);

const revenueMetrics = [
  { label: "Total Revenue", value: "$84,254", change: 12.5, icon: DollarSign },
  { label: "Average Order Value", value: "$156.42", change: 3.2, icon: TrendingUp },
  { label: "Revenue Growth", value: "+$12,384", change: 18.7, icon: TrendingUp },
  { label: "Profit Margin", value: "34.2%", change: 5.1, icon: DollarSign },
];

export default function RevenuePage() {
  const [period, setPeriod] = useState("monthly");

  return (
    <>
      <PageHeader
        title="Revenue"
        description="Revenue trends and financial performance"
        action={{ label: "Export", icon: Download }}
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
        {revenueMetrics.map((metric) => (
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
        {[
          { title: "Top Revenue Days", rows: ["Jun 15, 2026", "Jun 10, 2026", "Jun 8, 2026", "Jun 3, 2026"] },
          { title: "Revenue by Product", rows: ["Enterprise Plan", "Pro Plan", "Support Services", "Other"] },
        ].map((section) => (
          <Card key={section.title} className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.rows.map((row, index) => (
                <div key={row}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">{row}</span>
                    <span className="text-sm font-semibold text-card-foreground">{["$12,384", "$11,294", "$9,824", "$8,475"][index]}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${80 - index * 12}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

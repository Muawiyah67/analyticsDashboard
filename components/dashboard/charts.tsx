"use client";

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
import { useState } from "react";

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 51000, expenses: 32000 },
  { month: "Mar", revenue: 47000, expenses: 29000 },
  { month: "Apr", revenue: 63000, expenses: 35000 },
  { month: "May", revenue: 58000, expenses: 33000 },
  { month: "Jun", revenue: 72000, expenses: 40000 },
  { month: "Jul", revenue: 69000, expenses: 38000 },
  { month: "Aug", revenue: 84000, expenses: 44000 },
  { month: "Sep", revenue: 78000, expenses: 42000 },
  { month: "Oct", revenue: 91000, expenses: 48000 },
  { month: "Nov", revenue: 87000, expenses: 46000 },
  { month: "Dec", revenue: 102000, expenses: 54000 },
];

const weeklyData = [
  { month: "Mon", revenue: 8200, expenses: 5100 },
  { month: "Tue", revenue: 9400, expenses: 5800 },
  { month: "Wed", revenue: 7800, expenses: 4900 },
  { month: "Thu", revenue: 11200, expenses: 6700 },
  { month: "Fri", revenue: 10500, expenses: 6200 },
  { month: "Sat", revenue: 6800, expenses: 4100 },
  { month: "Sun", revenue: 5400, expenses: 3300 },
];

const trafficData = [
  { day: "Mon", organic: 3200, paid: 1400, referral: 800 },
  { day: "Tue", organic: 3800, paid: 1600, referral: 900 },
  { day: "Wed", organic: 3500, paid: 1200, referral: 750 },
  { day: "Thu", organic: 4200, paid: 1800, referral: 1100 },
  { day: "Fri", organic: 3900, paid: 1700, referral: 1000 },
  { day: "Sat", organic: 2800, paid: 1100, referral: 650 },
  { day: "Sun", organic: 2400, paid: 900, referral: 500 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#3b82f6" },
  { name: "Clothing", value: 25, color: "#10b981" },
  { name: "Home & Garden", value: 20, color: "#f59e0b" },
  { name: "Sports", value: 12, color: "#ef4444" },
  { name: "Books", value: 8, color: "#8b5cf6" },
];

const formatCurrency = (value: number) =>
  `$${(value / 1000).toFixed(0)}k`;

export function RevenueChart() {
  const [period, setPeriod] = useState("monthly");
  const data = period === "monthly" ? revenueData : weeklyData;

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
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="h-8 bg-muted">
              <TabsTrigger value="weekly" className="text-xs h-6 px-3">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-6 px-3">Monthly</TabsTrigger>
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

export function TrafficChart() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-card-foreground">Traffic Sources</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-0.5">
          Visitor acquisition this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trafficData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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

export function CategoryChart() {
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

"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnalyticsService } from "@/lib/api/analytics.service";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, change, changeLabel, icon: Icon, iconBg, iconColor }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span className={cn("text-xs font-semibold", isPositive ? "text-emerald-600" : "text-red-600")}>
                {isPositive ? "+" : ""}{change}%
              </span>
              <span className="text-xs text-muted-foreground">{changeLabel}</span>
            </div>
          </div>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid() {
  const [stats, setStats] = useState<StatCardProps[]>([
    {
      title: "Total Revenue",
      value: "$0",
      change: 0,
      changeLabel: "vs last month",
      icon: DollarSign,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Active Customers",
      value: "0",
      change: 0,
      changeLabel: "vs last month",
      icon: Users,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Total Orders",
      value: "0",
      change: 0,
      changeLabel: "vs last month",
      icon: ShoppingCart,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      title: "Page Views",
      value: "0",
      change: 0,
      changeLabel: "vs last month",
      icon: Eye,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await AnalyticsService.getDashboardStats();
        if (res.success && res.data) {
          const data = res.data;
          setStats([
            {
              title: "Total Revenue",
              value: `$${data.totalRevenue?.toLocaleString() || "0"}`,
              change: data.revenueChange ?? 0,
              changeLabel: "vs last month",
              icon: DollarSign,
              iconBg: "bg-blue-500/10",
              iconColor: "text-blue-500",
            },
            {
              title: "Active Customers",
              value: data.activeCustomers?.toLocaleString() || "0",
              change: data.usersChange ?? 0,
              changeLabel: "vs last month",
              icon: Users,
              iconBg: "bg-emerald-500/10",
              iconColor: "text-emerald-500",
            },
            {
              title: "Total Orders",
              value: data.totalOrders?.toLocaleString() || "0",
              change: data.ordersChange ?? 0,
              changeLabel: "vs last month",
              icon: ShoppingCart,
              iconBg: "bg-amber-500/10",
              iconColor: "text-amber-500",
            },
            {
              title: "Page Views",
              value: data.pageViews ? `${(data.pageViews / 1000000).toFixed(1)}M` : "0",
              change: data.pageViewsChange ?? 0,
              changeLabel: "vs last month",
              icon: Eye,
              iconBg: "bg-rose-500/10",
              iconColor: "text-rose-500",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
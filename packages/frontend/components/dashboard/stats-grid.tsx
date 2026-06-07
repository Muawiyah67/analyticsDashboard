"use client";

import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const stats: StatCardProps[] = [
  {
    title: "Total Revenue",
    value: "$84,254",
    change: 12.5,
    changeLabel: "vs last month",
    icon: DollarSign,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Active Users",
    value: "24,521",
    change: 8.2,
    changeLabel: "vs last month",
    icon: Users,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "Total Orders",
    value: "3,847",
    change: -2.4,
    changeLabel: "vs last month",
    icon: ShoppingCart,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    title: "Page Views",
    value: "1.2M",
    change: 18.7,
    changeLabel: "vs last month",
    icon: Eye,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
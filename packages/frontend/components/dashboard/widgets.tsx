"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, UserCheck, UserPlus, TrendingUp } from "lucide-react";

const topUsers = [
  { name: "Alice Johnson", role: "Enterprise", revenue: "$12,400", avatar: "AJ", color: "from-blue-500 to-cyan-400" },
  { name: "Bob Martinez", role: "Pro", revenue: "$8,950", avatar: "BM", color: "from-emerald-500 to-teal-400" },
  { name: "Carol White", role: "Enterprise", revenue: "$7,200", avatar: "CW", color: "from-amber-500 to-orange-400" },
  { name: "David Lee", role: "Pro", revenue: "$5,800", avatar: "DL", color: "from-rose-500 to-pink-400" },
];

const goals = [
  { label: "Monthly Revenue", current: 84254, target: 100000, color: "bg-blue-500" },
  { label: "New Customers", current: 347, target: 500, color: "bg-emerald-500" },
  { label: "Order Fulfillment", current: 94, target: 100, color: "bg-amber-500" },
];

const recentActivity = [
  { icon: UserPlus, label: "New user registered", time: "2 min ago", color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
  { icon: TrendingUp, label: "Revenue milestone hit", time: "15 min ago", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: UserCheck, label: "Order #1247 fulfilled", time: "32 min ago", color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
  { icon: UserPlus, label: "5 new users today", time: "1 hr ago", color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10" },
];

export function TopCustomers() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">Top Customers</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-0.5">By revenue this month</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1 text-xs h-8">
            View all <ArrowUpRight className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topUsers.map((user, i) => (
          <div key={user.name} className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground w-4">{i + 1}</span>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground leading-none truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user.role}</p>
            </div>
            <span className="text-sm font-semibold text-card-foreground">{user.revenue}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function GoalsProgress() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">Monthly Goals</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-0.5">Progress towards targets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{goal.label}</span>
                <span className="text-sm font-semibold text-card-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-muted-foreground">
                  {typeof goal.current === "number" && goal.current > 1000
                    ? "$" + goal.current.toLocaleString()
                    : goal.current}
                </span>
                <span className="text-xs text-muted-foreground">
                  {typeof goal.target === "number" && goal.target > 1000
                    ? "$" + goal.target.toLocaleString()
                    : goal.target}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function ActivityFeed() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">Recent Activity</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-0.5">Latest platform events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivity.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
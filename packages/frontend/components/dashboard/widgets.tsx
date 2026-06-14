"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, UserCheck, UserPlus, TrendingUp, ShoppingCart } from "lucide-react";
import { CustomerService, Customer } from "@/lib/api/customers.service";
import { OrderService } from "@/lib/api/order.service";
import { Order } from "@nexus/shared";

// --- GoalsProgress (kept as manual config) ---
const goals = [
  { label: "Monthly Revenue", current: 84254, target: 100000, color: "bg-blue-500" },
  { label: "New Customers", current: 347, target: 500, color: "bg-emerald-500" },
  { label: "Order Fulfillment", current: 94, target: 100, color: "bg-amber-500" },
];

export function GoalsProgress() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">Goals Progress</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-0.5">
          Monthly targets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.map((goal) => (
          <div key={goal.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{goal.label}</span>
              <span className="font-medium text-foreground">
                {goal.label.includes("Revenue") ? `$${goal.current.toLocaleString()}` : goal.current}
                <span className="text-muted-foreground"> / {goal.label.includes("Revenue") ? `$${goal.target.toLocaleString()}` : goal.target}</span>
              </span>
            </div>
            <Progress value={(goal.current / goal.target) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// --- TopCustomers (real data) ---
export function TopCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await CustomerService.getCustomers({ page: 1, limit: 5 });
        if (res.success && res.data) {
          setCustomers(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">Top Customers</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Loading customers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">Top Customers</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-0.5">
              {customers.length} active customers
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1 text-xs h-8" asChild>
            <Link href="/customers">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">
                    {customer.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{customer.status}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          ))}
          {customers.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No customers found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- ActivityFeed (real data from orders) ---
export function ActivityFeed() {
  const [activities, setActivities] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderService.getOrders(1, 5);
        if (res.success && res.data) {
          setActivities(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case "completed": return <UserCheck className="w-4 h-4 text-emerald-500" />;
      case "pending": return <UserPlus className="w-4 h-4 text-amber-500" />;
      case "processing": return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      default: return <TrendingUp className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Loading activity...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">Recent Activity</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-0.5">
          Latest order updates
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {getIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  Order <span className="font-medium">{activity.orderNumber}</span> is {activity.status}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.customer?.name || "Unknown customer"} • {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No recent activity.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
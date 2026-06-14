"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderService } from "@/lib/api/order.service";
import { Order, OrderStatus } from "@nexus/shared";

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  processing: { label: "Processing", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  shipped: { label: "Shipped", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const avatarColors = [
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
  "from-violet-500 to-purple-400",
  "from-slate-500 to-slate-400",
];

export function RecentOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderService.getOrders(1, 6);
        if (res.success && res.data) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Card className="border border-border shadow-sm col-span-1 lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Loading orders...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm col-span-1 lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">Recent Orders</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-0.5">
              {orders.length} orders this week
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary hover:bg-primary/10 gap-1 text-xs h-8"
            onClick={() => router.push("/orders")}
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {orders.map((ord, i) => {
                const config = statusConfig[ord.status] || statusConfig.pending;
                return (
                  <tr 
                    key={ord.id} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer" 
                    onClick={() => router.push("/orders")}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className={cn("text-white text-xs font-semibold bg-gradient-to-br", avatarColors[i % avatarColors.length])}>
                            {initials(ord.customer?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{ord.customer?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground truncate hidden sm:block">{ord.customer?.email || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {ord.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground">
                        ${ord.totalAmount?.toLocaleString() || "0"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("text-xs font-medium capitalize", config.className)}>
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                          <DropdownMenuItem onClick={() => router.push("/orders")}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push("/orders")}>Edit order</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => router.push("/orders")}>Cancel order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
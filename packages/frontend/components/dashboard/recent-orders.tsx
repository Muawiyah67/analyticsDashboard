"use client";

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

type OrderStatus = "completed" | "pending" | "processing" | "cancelled";

interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: string;
  status: OrderStatus;
  date: string;
}

const orders: Order[] = [
  { id: "#ORD-001", customer: "Alice Johnson", email: "alice@email.com", product: "Pro Plan", amount: "$299", status: "completed", date: "Jun 3, 2026" },
  { id: "#ORD-002", customer: "Bob Martinez", email: "bob@email.com", product: "Enterprise", amount: "$1,299", status: "processing", date: "Jun 3, 2026" },
  { id: "#ORD-003", customer: "Carol White", email: "carol@email.com", product: "Starter Plan", amount: "$49", status: "pending", date: "Jun 2, 2026" },
  { id: "#ORD-004", customer: "David Lee", email: "david@email.com", product: "Pro Plan", amount: "$299", status: "completed", date: "Jun 2, 2026" },
  { id: "#ORD-005", customer: "Emma Davis", email: "emma@email.com", product: "Enterprise", amount: "$1,299", status: "cancelled", date: "Jun 1, 2026" },
  { id: "#ORD-006", customer: "Frank Wilson", email: "frank@email.com", product: "Starter Plan", amount: "$49", status: "completed", date: "Jun 1, 2026" },
];

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  processing: { label: "Processing", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
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
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1 text-xs h-8">
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
              {orders.map((order, i) => {
                const { label, className } = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className={cn("text-white text-xs font-semibold bg-gradient-to-br", avatarColors[i % avatarColors.length])}>
                            {initials(order.customer)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{order.customer}</p>
                          <p className="text-xs text-muted-foreground truncate hidden sm:block">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{order.product}</span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{order.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground">{order.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("text-xs font-medium", className)}>
                        {label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit order</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Cancel order</DropdownMenuItem>
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
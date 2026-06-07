"use client";

import { useState } from "react";
import { MoreHorizontal, Package, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const orders = [
  { id: "#ORD-001", customer: "Alice Johnson", product: "Pro Plan", amount: "$299", status: "completed", date: "Jun 3, 2026" },
  { id: "#ORD-002", customer: "Bob Martinez", product: "Enterprise", amount: "$1,299", status: "processing", date: "Jun 3, 2026" },
  { id: "#ORD-003", customer: "Carol White", product: "Starter Plan", amount: "$49", status: "pending", date: "Jun 2, 2026" },
  { id: "#ORD-004", customer: "David Lee", product: "Pro Plan", amount: "$299", status: "completed", date: "Jun 2, 2026" },
  { id: "#ORD-005", customer: "Emma Davis", product: "Enterprise", amount: "$1,299", status: "cancelled", date: "Jun 1, 2026" },
  { id: "#ORD-006", customer: "Frank Wilson", product: "Starter Plan", amount: "$49", status: "completed", date: "Jun 1, 2026" },
];

const statusConfig = {
  completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  processing: "border-blue-500/20 bg-blue-500/10 text-blue-500",
  cancelled: "border-red-500/20 bg-red-500/10 text-red-500",
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        action={{ label: "New Order", icon: Plus }}
      />

      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID, customer, or product..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="border-0 text-sm focus-visible:ring-0"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Product</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-3.5 w-3.5" />
                        {order.product}
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-muted-foreground sm:table-cell">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.amount}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("text-xs font-medium capitalize", statusConfig[order.status as keyof typeof statusConfig])}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit order</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Cancel order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

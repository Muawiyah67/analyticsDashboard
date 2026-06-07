"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const products = [
  { name: "Pro Plan", sku: "PRO-001", category: "Subscription", price: "$299", stock: 842, sales: 1284, status: "active" },
  { name: "Enterprise Plan", sku: "ENT-001", category: "Subscription", price: "$1,299", stock: 219, sales: 432, status: "active" },
  { name: "Starter Plan", sku: "STR-001", category: "Subscription", price: "$49", stock: 1420, sales: 2891, status: "active" },
  { name: "Priority Support", sku: "SUP-001", category: "Service", price: "$199", stock: 64, sales: 183, status: "low" },
  { name: "Data Export", sku: "ADD-003", category: "Add-on", price: "$29", stock: 0, sales: 95, status: "out" },
];

const statusConfig = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  low: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  out: "border-red-500/20 bg-red-500/10 text-red-500",
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage products, pricing, and availability"
        action={{ label: "Add Product", icon: Plus }}
      />

      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
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
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredProducts.map((product) => (
                  <tr key={product.sku} className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-muted-foreground md:table-cell">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{product.price}</td>
                    <td className="hidden px-6 py-4 lg:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        {product.sales.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("text-xs font-medium capitalize", statusConfig[product.status as keyof typeof statusConfig])}>
                        {product.status === "out" ? "Out of stock" : product.status}
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
                          <DropdownMenuItem>Edit product</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Delete product</DropdownMenuItem>
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

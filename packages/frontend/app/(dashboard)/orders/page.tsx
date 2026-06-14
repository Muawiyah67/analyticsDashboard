"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Package, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OrderService } from "@/lib/api/order.service";
import { ProductService } from "@/lib/api/product.service";
import { CustomerService, Customer } from "@/lib/api/customers.service";
import { Order, OrderStatus, Product } from "@nexus/shared";

const statusConfig: Record<string, string> = {
  completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  processing: "border-blue-500/20 bg-blue-500/10 text-blue-500",
  shipped: "border-purple-500/20 bg-purple-500/10 text-purple-500",
  cancelled: "border-red-500/20 bg-red-500/10 text-red-500",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number; price: number }[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [submitting, setSubmitting] = useState(false);

  // View Details
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, customersRes, productsRes] = await Promise.all([
          OrderService.getOrders(1, 50),
          CustomerService.getCustomers({ page: 1, limit: 100 }),
          ProductService.getProducts(1, 100),
        ]);

        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data.data);
        }
        if (customersRes.success && customersRes.data) {
          setCustomers(customersRes.data.data);
        }
        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setSelectedCustomerId("");
    setOrderItems([]);
    setShippingAddress("");
    setBillingAddress("");
    setOrderStatus(OrderStatus.PENDING);
    setEditingOrder(null);
    setIsEditMode(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (order: Order) => {
    setEditingOrder(order);
    setIsEditMode(true);
    setSelectedCustomerId(order.customerId);
    setShippingAddress(order.shippingAddress);
    setBillingAddress(order.billingAddress);
    setOrderStatus(order.status);
    setOrderItems(order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })));
    setIsDialogOpen(true);
  };

  const handleAddOrderItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof typeof orderItems[0], value: string | number) => {
    const newItems = [...orderItems];
    if (field === "productId") {
      const productId = value as string;
      newItems[index].productId = productId;
      const product = products.find(p => p.id === productId);
      if (product) newItems[index].price = product.price;
    } else if (field === "quantity") {
      newItems[index].quantity = value as number;
    } else if (field === "price") {
      newItems[index].price = value as number;
    }
    setOrderItems(newItems);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || orderItems.length === 0 || !shippingAddress || !billingAddress) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (orderItems.some(item => !item.productId)) {
      toast.error("Please select products for all items.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await OrderService.createOrder({
        customerId: selectedCustomerId,
        items: orderItems,
        shippingAddress,
        billingAddress,
      });

      if (res.success && res.data) {
        toast.success("Order created successfully!");
        setOrders(prev => [res.data!, ...prev]);
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(res.message || "Failed to create order.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    
    setSubmitting(true);
    try {
      const res = await OrderService.updateOrder(editingOrder.id, {
        status: orderStatus,
        shippingAddress,
        billingAddress,
      });
      if (res.success && res.data) {
        toast.success("Order updated successfully!");
        setOrders(prev => prev.map(o => o.id === editingOrder.id ? res.data! : o));
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(res.message || "Failed to update order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await OrderService.deleteOrder(id);
      if (res.success) {
        toast.success("Order deleted successfully!");
        setOrders(prev => prev.filter(o => o.id !== id));
      } else {
        toast.error(res.message || "Failed to delete order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    `${order.orderNumber} ${order.customer?.name || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        action={{ 
          label: "New Order", 
          icon: Plus,
          onClick: openAddDialog
        }}
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
                      <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customer?.name || 'Unknown'}</p>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-3.5 w-3.5" />
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-muted-foreground sm:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ${order.totalAmount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("text-xs font-medium capitalize", statusConfig[order.status] || statusConfig.pending)}>
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
                          <DropdownMenuItem onClick={() => setViewOrder(order)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(order)}>Edit order</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteOrder(order.id)}>Cancel order</DropdownMenuItem>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background text-foreground border border-border">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Order" : "New Order"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditMode ? "Update order status and details." : "Create a manual order for a customer."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={isEditMode ? handleEditOrder : handleCreateOrder} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <select
                id="customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                required
                disabled={isEditMode}
              >
                <option value="" className="bg-background text-foreground">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id} className="bg-background text-foreground">
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            {!isEditMode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Order Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddOrderItem} className="h-7 gap-1 text-xs">
                    <Plus className="h-3 w-3" /> Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-end gap-3">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground">Product</Label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                          required
                        >
                          <option value="" className="bg-background text-foreground">Select product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id} className="bg-background text-foreground">
                              {product.name} (${product.price})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-20 space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground">Qty</Label>
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))} className="h-9" required />
                      </div>
                      <div className="w-24 space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground">Price</Label>
                        <Input type="number" value={item.price} readOnly className="h-9 bg-muted/50" />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOrderItem(index)} className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {orderItems.length === 0 && (
                    <p className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg">No items added to the order.</p>
                  )}
                </div>
              </div>
            )}

            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value as OrderStatus)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground">
                  <option value={OrderStatus.PENDING} className="bg-background text-foreground">Pending</option>
                  <option value={OrderStatus.PROCESSING} className="bg-background text-foreground">Processing</option>
                  <option value={OrderStatus.SHIPPED} className="bg-background text-foreground">Shipped</option>
                  <option value={OrderStatus.COMPLETED} className="bg-background text-foreground">Completed</option>
                  <option value={OrderStatus.CANCELLED} className="bg-background text-foreground">Cancelled</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Input id="shippingAddress" placeholder="123 Street, City, Country" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="bg-transparent" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input id="billingAddress" placeholder="Same as shipping or different" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="bg-transparent" required />
              </div>
            </div>

            {!isEditMode && (
              <div className="pt-2 border-t border-border mt-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Total Amount</span>
                  <span className="text-lg font-bold">${orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}</span>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Order" : "Create Order")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="sm:max-w-[500px] bg-background text-foreground border border-border">
          <DialogHeader><DialogTitle>Order Details</DialogTitle></DialogHeader>
          {viewOrder && (
            <div className="space-y-3 py-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Order #:</span><span className="font-medium">{viewOrder.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Customer:</span><span>{viewOrder.customer?.name || 'Unknown'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge variant="outline" className={cn("text-xs", statusConfig[viewOrder.status])}>{viewOrder.status}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total:</span><span className="font-semibold">${viewOrder.totalAmount?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping:</span><span className="text-sm">{viewOrder.shippingAddress}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Billing:</span><span className="text-sm">{viewOrder.billingAddress}</span></div>
              <div className="pt-2 border-t border-border"><span className="text-muted-foreground">Items:</span>
                <div className="mt-1 space-y-1">
                  {viewOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm"><span>{item.quantity}x Product</span><span>${(item.quantity * item.price).toLocaleString()}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewOrder(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductService } from "@/lib/api/product.service";
import { Product, ProductStatus } from "@nexus/shared";

// Extended type for products with sales data from API
interface ProductWithSales extends Product {
  sales?: number;
}

const statusConfig: Record<string, string> = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  inactive: "border-gray-500/20 bg-gray-500/10 text-gray-500",
  out_of_stock: "border-red-500/20 bg-red-500/10 text-red-500",
  discontinued: "border-purple-500/20 bg-purple-500/10 text-purple-500",
  low: "border-amber-500/20 bg-amber-500/10 text-amber-500",
};

function getDisplayStatus(product: ProductWithSales): { label: string; className: string } {
  if (product.status === ProductStatus.OUT_OF_STOCK) return { label: "Out of stock", className: statusConfig.out_of_stock };
  if (product.status === ProductStatus.DISCONTINUED) return { label: "Discontinued", className: statusConfig.discontinued };
  if (product.status === ProductStatus.INACTIVE) return { label: "Inactive", className: statusConfig.inactive };
  if (product.stock <= 10) return { label: "Low stock", className: statusConfig.low };
  return { label: "Active", className: statusConfig.active };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithSales[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Add/Edit Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithSales | null>(null);
  
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState<ProductStatus>(ProductStatus.ACTIVE);
  const [submitting, setSubmitting] = useState(false);

  // View Details Dialog
  const [viewProduct, setViewProduct] = useState<ProductWithSales | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ProductService.getProducts(1, 50);
        if (res.success && res.data) {
          setProducts(res.data.data as ProductWithSales[]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const resetForm = () => {
    setSku("");
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setCost("");
    setStock("");
    setStatus(ProductStatus.ACTIVE);
    setEditingProduct(null);
    setIsEditMode(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: ProductWithSales) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setSku(product.sku);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setPrice(String(product.price));
    setCost(product.cost ? String(product.cost) : "");
    setStock(String(product.stock));
    setStatus(product.status);
    setIsDialogOpen(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !description || !category || !price || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await ProductService.createProduct({
        sku,
        name,
        description,
        category,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : undefined,
        stock: parseInt(stock),
        status: status,
      });
      if (res.success && res.data) {
        toast.success("Product added successfully!");
        setProducts((prev) => [...prev, res.data! as ProductWithSales]);
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(res.message || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !sku || !name || !description || !category || !price || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await ProductService.updateProduct(editingProduct.id, {
        sku,
        name,
        description,
        category,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : undefined,
        stock: parseInt(stock),
        status,
      });
      if (res.success && res.data) {
        toast.success("Product updated successfully!");
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? (res.data! as ProductWithSales) : p)));
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(res.message || "Failed to update product.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await ProductService.deleteProduct(id);
      if (res.success) {
        toast.success("Product deleted successfully!");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(res.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting.");
    }
  };

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage products, pricing, and availability"
        action={{
          label: "Add Product",
          icon: Plus,
          onClick: openAddDialog,
        }}
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
                {filteredProducts.map((product) => {
                  const displayStatus = getDisplayStatus(product);
                  return (
                    <tr key={product.id} className="transition-colors hover:bg-muted/50">
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
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">${product.price.toLocaleString()}</td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          {product.sales?.toLocaleString() || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn("text-xs font-medium capitalize", displayStatus.className)}>
                          {displayStatus.label}
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
                            <DropdownMenuItem onClick={() => setViewProduct(product)}>View details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(product)}>Edit product</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteProduct(product.id)}>
                              Delete product
                            </DropdownMenuItem>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background text-foreground border border-border">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditMode ? "Update product details." : "Create a new product listing in your catalog."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={isEditMode ? handleEditProduct : handleAddProduct} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Pro Plan" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="e.g. PRO-PLAN-01" value={sku} onChange={(e) => setSku(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Subscriptions" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter product description details" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" min="0" placeholder="299.00" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($) (Optional)</Label>
                <Input id="cost" type="number" step="0.01" min="0" placeholder="50.00" value={cost} onChange={(e) => setCost(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input id="stock" type="number" min="0" placeholder="100" value={stock} onChange={(e) => setStock(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground">
                <option value={ProductStatus.ACTIVE} className="bg-background text-foreground">Active</option>
                <option value={ProductStatus.INACTIVE} className="bg-background text-foreground">Inactive</option>
                <option value={ProductStatus.OUT_OF_STOCK} className="bg-background text-foreground">Out of Stock</option>
                <option value={ProductStatus.DISCONTINUED} className="bg-background text-foreground">Discontinued</option>
              </select>
            </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="text-foreground">Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Product" : "Add Product")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="sm:max-w-[450px] bg-background text-foreground border border-border">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-3 py-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium">{viewProduct.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">SKU:</span><span>{viewProduct.sku}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span>{viewProduct.category}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Price:</span><span>${viewProduct.price.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stock:</span><span>{viewProduct.stock}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge variant="outline" className={cn("text-xs", getDisplayStatus(viewProduct).className)}>{getDisplayStatus(viewProduct).label}</Badge></div>
              <div className="pt-2 border-t border-border"><span className="text-muted-foreground">Description:</span><p className="mt-1 text-sm">{viewProduct.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewProduct(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
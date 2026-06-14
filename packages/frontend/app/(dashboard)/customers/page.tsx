"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
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
import { CustomerService, Customer } from "@/lib/api/customers.service";

const statusConfig: Record<string, string> = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  inactive: "border-gray-500/20 bg-gray-500/10 text-gray-500",
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-500",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("active");
  const [submitting, setSubmitting] = useState(false);

  // View Details
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await CustomerService.getCustomers({ page: 1, limit: 50 });
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setStatus("active");
    setEditingCustomer(null);
    setIsEditMode(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditMode(true);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone || "");
    setCompany(customer.company || "");
    setStatus(customer.status);
    setIsDialogOpen(true);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await CustomerService.createCustomer({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        status,
      });
      if (res.success && res.data) {
        toast.success("Customer added successfully!");
        setCustomers((prev) => [...prev, res.data!]);
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(res.message || "Failed to add customer.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !name || !email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await CustomerService.updateCustomer(editingCustomer.id, {
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        status,
      });
      if (res.success && res.data) {
        toast.success("Customer updated successfully!");
        setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? res.data! : c)));
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(res.message || "Failed to update customer.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await CustomerService.deleteCustomer(id);
      if (res.success) {
        toast.success("Customer deleted successfully!");
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(res.message || "Failed to delete customer.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting.");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage customer profiles, details, and activity"
        action={{
          label: "Add Customer",
          icon: Plus,
          onClick: openAddDialog,
        }}
      />

      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or email..."
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
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Phone</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-bold text-primary">
                            {customer.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{customer.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell text-sm text-muted-foreground">
                      {customer.phone || "-"}
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-muted-foreground sm:table-cell">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("text-xs font-medium capitalize", statusConfig[customer.status] || statusConfig.active)}>
                        {customer.status}
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
                          <DropdownMenuItem onClick={() => setViewCustomer(customer)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(customer)}>Edit details</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteCustomer(customer.id)}>
                            Delete customer
                          </DropdownMenuItem>
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
        <DialogContent className="sm:max-w-[425px] bg-background text-foreground border border-border">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Customer" : "Add Customer"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditMode ? "Update customer details." : "Create a new customer account profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={isEditMode ? handleEditCustomer : handleAddCustomer} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter customer name" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter customer email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input id="company" placeholder="Enter company name" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-transparent border border-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground">
                <option value="active" className="bg-background text-foreground">Active</option>
                <option value="inactive" className="bg-background text-foreground">Inactive</option>
                <option value="pending" className="bg-background text-foreground">Pending</option>
              </select>
            </div>
            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="text-foreground">Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Customer" : "Add Customer")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent className="sm:max-w-[400px] bg-background text-foreground border border-border">
          <DialogHeader><DialogTitle>Customer Details</DialogTitle></DialogHeader>
          {viewCustomer && (
            <div className="space-y-3 py-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium">{viewCustomer.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><span>{viewCustomer.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><span>{viewCustomer.phone || "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Company:</span><span>{viewCustomer.company || "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge variant="outline" className={cn("text-xs", statusConfig[viewCustomer.status])}>{viewCustomer.status}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Joined:</span><span>{new Date(viewCustomer.created_at).toLocaleDateString()}</span></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewCustomer(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
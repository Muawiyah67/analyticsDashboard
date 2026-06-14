"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  TrendingUp,
  Package,
  ChevronRight,
  UserCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/dashboard/user-nav";
import { AuthService } from "@/lib/api/auth.service";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Analytics", icon: BarChart3, href: "/analytics", badge: "New" },
  { label: "Customers", icon: UserCheck, href: "/customers" },
  { label: "Orders", icon: ShoppingCart, href: "/orders", badge: "12" },
  { label: "Products", icon: Package, href: "/products" },
  { label: "Revenue", icon: TrendingUp, href: "/revenue" },
  { label: "Reports", icon: FileText, href: "/reports" },
];

const bottomItems = [
  { label: "Notifications", icon: Bell, href: "/notifications", badge: "3" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Help", icon: HelpCircle, href: "/help" },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = "/login";
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sidebar-foreground font-semibold text-sm leading-none">Nexus</p>
          <p className="text-sidebar-foreground/60 text-xs mt-0.5">Analytics Pro</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground")} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge
                  className={cn(
                    "text-xs px-1.5 py-0 h-5 font-medium",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                      : "bg-sidebar-accent text-sidebar-foreground/80 hover:bg-sidebar-accent"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              {isActive && <ChevronRight className="w-3 h-3 text-primary-foreground/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="text-xs px-1.5 py-0 h-5 bg-red-500 text-white hover:bg-red-500">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout button */}
      <div className="px-3 pb-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>

      {/* User profile */}
      <div className="px-3 pb-4">
        <UserNav />
      </div>
    </aside>
  );
}
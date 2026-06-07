"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:relative lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar />
      </div>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuToggle={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 space-y-6 p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { TopCustomers, GoalsProgress, ActivityFeed } from "@/components/dashboard/widgets";

const RevenueChart = dynamic(() => import("@/components/dashboard/charts").then(m => ({ default: m.RevenueChart })), { ssr: false });
const TrafficChart = dynamic(() => import("@/components/dashboard/charts").then(m => ({ default: m.TrafficChart })), { ssr: false });
const CategoryChart = dynamic(() => import("@/components/dashboard/charts").then(m => ({ default: m.CategoryChart })), { ssr: false });

export default function DashboardPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good morning, John!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <TrafficChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <CategoryChart />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TopCustomers />
        <GoalsProgress />
        <ActivityFeed />
      </div>
    </>
  );
}

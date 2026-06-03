"use client";

import { useState } from "react";
import { Calendar, Clock, Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const reports = [
  { title: "Monthly Sales Report", description: "Comprehensive sales metrics for June 2026", date: "Jun 30, 2026", type: "Sales", status: "ready", generated: "3 days ago" },
  { title: "Customer Acquisition Analysis", description: "Breakdown of new customer channels", date: "Jun 29, 2026", type: "Analytics", status: "ready", generated: "4 days ago" },
  { title: "Revenue Forecast Q3", description: "Predictive revenue analysis for Q3", date: "Jun 25, 2026", type: "Forecast", status: "ready", generated: "1 week ago" },
  { title: "Product Performance Report", description: "Performance metrics for all products", date: "Jun 20, 2026", type: "Products", status: "generating", generated: "2 weeks ago" },
];

export default function ReportsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? reports : reports.filter((report) => report.type === filter);

  return (
    <>
      <PageHeader
        title="Reports"
        description="View and download generated reports"
        action={{ label: "Generate Report", icon: FileText }}
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="h-9 bg-muted">
          <TabsTrigger value="all" className="text-xs">All Reports</TabsTrigger>
          <TabsTrigger value="Sales" className="text-xs">Sales</TabsTrigger>
          <TabsTrigger value="Analytics" className="text-xs">Analytics</TabsTrigger>
          <TabsTrigger value="Forecast" className="text-xs">Forecast</TabsTrigger>
          <TabsTrigger value="Products" className="text-xs">Products</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.map((report) => (
          <Card key={report.title} className="border border-border shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <h3 className="truncate text-base font-semibold text-foreground">{report.title}</h3>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">{report.type}</Badge>
                    <Badge
                      variant="outline"
                      className={report.status === "ready" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" : "border-amber-500/20 bg-amber-500/10 text-amber-500"}
                    >
                      {report.status === "ready" ? "Ready" : "Generating"}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {report.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {report.generated}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1 text-xs" disabled={report.status !== "ready"}>
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

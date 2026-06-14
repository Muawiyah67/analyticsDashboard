"use client";

import { useState, useEffect } from "react";
import { Calendar, Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ReportService } from "@/lib/api/report.service";
import { Report, ReportType, ReportStatus } from "@nexus/shared";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState<ReportType>(ReportType.SALES);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const res = await ReportService.getReports();
        if (isMounted) {
          if (res.success && res.data?.data && Array.isArray(res.data.data)) {
            setReports(res.data.data);
          } else {
            console.warn("Reports API returned unexpected data:", res);
            setReports([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        if (isMounted) setReports([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await ReportService.generateReport({
        name: reportName,
        type: reportType,
        description,
      });

      if (res.success && res.data) {
        toast.success("Report generated successfully!");
        setReports(prev => [res.data as Report, ...prev]);
        setIsDialogOpen(false);
        setReportName("");
        setDescription("");
      } else {
        toast.error(res.message || "Failed to generate report.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (report: Report) => {
    if (!report.slug) {
      toast.error("Report slug not available");
      return;
    }
    
    try {
      const blob = await ReportService.downloadReport(report.slug);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Report downloaded!");
    } catch (err) {
      toast.error("Failed to download report");
    }
  };

  const filtered = Array.isArray(reports)
    ? (filter === "all" ? reports : reports.filter((report) => report.type === filter))
    : [];

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Just now';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Just now';
      return date.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <PageHeader
        title="Reports"
        description="View and download generated reports"
        action={{ 
          label: "Generate Report", 
          icon: FileText,
          onClick: () => setIsDialogOpen(true)
        }}
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="h-9 bg-muted">
          <TabsTrigger value="all" className="text-xs">All Reports</TabsTrigger>
          <TabsTrigger value={ReportType.SALES} className="text-xs">Sales</TabsTrigger>
          <TabsTrigger value={ReportType.ANALYTICS} className="text-xs">Analytics</TabsTrigger>
          <TabsTrigger value={ReportType.REVENUE} className="text-xs">Revenue</TabsTrigger>
          <TabsTrigger value={ReportType.PRODUCTS} className="text-xs">Products</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.map((report) => (
          <Card key={report.id} className="border border-border shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <h3 className="truncate text-base font-semibold text-foreground">{report.name}</h3>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary uppercase">{report.type}</Badge>
                    <Badge
                      variant="outline"
                      className={report.status === ReportStatus.READY ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" : "border-amber-500/20 bg-amber-500/10 text-amber-500"}
                    >
                      {report.status === ReportStatus.READY ? "Ready" : "Generating"}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-xs" 
                  disabled={report.status !== ReportStatus.READY || !report.slug}
                  onClick={() => handleDownload(report)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            No reports found.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background text-foreground border border-border">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select report parameters to generate a new data export.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerateReport} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Report Name</Label>
              <Input
                id="name"
                placeholder="e.g. Q2 Performance Audit"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Report Type</Label>
              <select
                id="type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                required
              >
                <option value={ReportType.SALES} className="bg-background text-foreground">Sales Report</option>
                <option value={ReportType.REVENUE} className="bg-background text-foreground">Revenue Analysis</option>
                <option value={ReportType.ANALYTICS} className="bg-background text-foreground">Traffic Analytics</option>
                <option value={ReportType.PRODUCTS} className="bg-background text-foreground">Product Performance</option>
                <option value={ReportType.CUSTOMERS} className="bg-background text-foreground">Customer Behavior</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description (Optional)</Label>
              <Textarea
                id="desc"
                placeholder="Briefly describe the purpose of this report"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Generating..." : "Generate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
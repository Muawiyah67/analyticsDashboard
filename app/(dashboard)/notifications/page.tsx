import { Bell, CheckCircle2, DollarSign, Package, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const notifications = [
  { title: "New enterprise order", description: "Bob Martinez upgraded to Enterprise.", time: "2 min ago", icon: DollarSign, tone: "text-emerald-500 bg-emerald-500/10", status: "New" },
  { title: "Low stock alert", description: "Priority Support seats are below threshold.", time: "18 min ago", icon: Package, tone: "text-amber-500 bg-amber-500/10", status: "Inventory" },
  { title: "New team member", description: "Jane Smith accepted the workspace invite.", time: "1 hr ago", icon: Users, tone: "text-blue-500 bg-blue-500/10", status: "Team" },
  { title: "Report generated", description: "Monthly Sales Report is ready to download.", time: "3 hrs ago", icon: CheckCircle2, tone: "text-primary bg-primary/10", status: "Report" },
];

export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Notifications" description="Review recent alerts and platform activity" />

      <div className="space-y-3">
        {notifications.map((item) => (
          <Card key={item.title} className="border border-border shadow-sm">
            <CardContent className="flex items-start gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
                  <Badge variant="outline" className="text-xs">{item.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border bg-muted/40 shadow-sm">
        <CardContent className="flex items-center gap-3 p-5">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Notification preferences are available in Settings.</p>
        </CardContent>
      </Card>
    </>
  );
}

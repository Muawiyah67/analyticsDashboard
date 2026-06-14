"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, DollarSign, Package, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  tone: string;
  status: string;
  read: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  Package,
  Users,
  CheckCircle2,
  Bell,
};

const toneMap: Record<string, string> = {
  "New": "text-emerald-500 bg-emerald-500/10",
  "Inventory": "text-amber-500 bg-amber-500/10",
  "Team": "text-blue-500 bg-blue-500/10",
  "Report": "text-primary bg-primary/10",
  "System": "text-gray-500 bg-gray-500/10",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // FIX: Wrap localStorage reads in setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("nexus_notifications");
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        const defaults = [
          { id: "1", title: "New enterprise order", description: "Bob Martinez upgraded to Enterprise.", time: "2 min ago", icon: "DollarSign", tone: "New", status: "New", read: false },
          { id: "2", title: "Low stock alert", description: "Priority Support seats are below threshold.", time: "18 min ago", icon: "Package", tone: "Inventory", status: "Inventory", read: false },
          { id: "3", title: "New team member", description: "Jane Smith accepted the workspace invite.", time: "1 hr ago", icon: "Users", tone: "Team", status: "Team", read: false },
          { id: "4", title: "Report generated", description: "Monthly Sales Report is ready to download.", time: "3 hrs ago", icon: "CheckCircle2", tone: "Report", status: "Report", read: false },
        ];
        setNotifications(defaults);
        localStorage.setItem("nexus_notifications", JSON.stringify(defaults));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem("nexus_notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("nexus_notifications", JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("nexus_notifications", JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem("nexus_notifications", JSON.stringify([]));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`Review recent alerts and platform activity ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        action={{
          label: "Mark All Read",
          icon: CheckCircle2, // FIX: Added required icon prop
          onClick: markAllAsRead,
          disabled: unreadCount === 0,
        }}
      />

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="border border-border shadow-sm">
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Bell className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((item) => {
            const Icon = iconMap[item.icon] || Bell;
            const toneClass = toneMap[item.status] || toneMap["System"];
            return (
              <Card
                key={item.id}
                className={cn(
                  "border border-border shadow-sm transition-colors",
                  item.read ? "bg-muted/30" : "bg-card"
                )}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className={cn("text-sm font-semibold", item.read ? "text-muted-foreground" : "text-foreground")}>
                        {item.title}
                      </h2>
                      <Badge variant="outline" className="text-xs">{item.status}</Badge>
                      {!item.read && <Badge className="bg-primary text-xs">New</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                    <div className="flex gap-1">
                      {!item.read && (
                        <button
                          onClick={() => markAsRead(item.id)}
                          className="rounded p-1 text-muted-foreground hover:text-primary"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(item.id)}
                        className="rounded p-1 text-muted-foreground hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
            Clear All Notifications
          </Button>
        </div>
      )}

      <Card className="border border-border bg-muted/40 shadow-sm">
        <CardContent className="flex items-center gap-3 p-5">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Notification preferences are available in Settings.</p>
        </CardContent>
      </Card>
    </>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
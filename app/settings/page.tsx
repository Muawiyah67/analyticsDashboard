"use client";

import { useState } from "react";
import { Bell, Lock, Monitor, Moon, Palette, Save, Settings as SettingsIcon, Sun, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const sections = [
  { id: "account", label: "Account", icon: SettingsIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "team", label: "Team", icon: Users },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("account");
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and dashboard preferences" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-1 lg:col-span-1">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors",
                tab === item.id
                  ? "border border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              type="button"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {tab === "account" && (
            <SettingsCard title="Account Settings" description="Manage your account information">
              <Field label="Full Name" defaultValue="John Doe" />
              <Field label="Email Address" defaultValue="john@company.com" type="email" />
              <Field label="Company" defaultValue="Acme Corporation" />
              <Field label="Phone" defaultValue="+1 (555) 000-0000" type="tel" />
              <SaveButton label="Save Changes" />
            </SettingsCard>
          )}

          {tab === "notifications" && (
            <SettingsCard title="Notifications" description="Configure how you receive updates">
              {[
                ["New Orders", "Get notified when a new order is placed", true],
                ["Order Updates", "Receive updates on order status changes", true],
                ["Low Stock Alerts", "Alerts when product inventory is low", true],
                ["Revenue Reports", "Weekly revenue and sales reports", false],
              ].map(([label, description, enabled]) => (
                <div key={String(label)} className="flex items-center justify-between gap-4 rounded-lg p-3 hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                  <Switch defaultChecked={Boolean(enabled)} />
                </div>
              ))}
              <SaveButton label="Save Preferences" />
            </SettingsCard>
          )}

          {tab === "security" && (
            <SettingsCard title="Security" description="Manage your security and privacy settings">
              <Field label="Current Password" placeholder="Password" type="password" />
              <Field label="New Password" placeholder="New password" type="password" />
              <Field label="Confirm New Password" placeholder="Confirm password" type="password" />
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Strong passwords include uppercase, lowercase, numbers, and special characters.</p>
              </div>
              <SaveButton label="Update Password" />
            </SettingsCard>
          )}

          {tab === "team" && (
            <SettingsCard title="Team & Permissions" description="Manage team members and access">
              {[
                ["John Doe", "john@company.com", "Admin"],
                ["Jane Smith", "jane@company.com", "Editor"],
                ["Bob Johnson", "bob@company.com", "Viewer"],
              ].map(([name, email, role]) => (
                <div key={email} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                  <span className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{role}</span>
                </div>
              ))}
              <Button className="gap-2">
                <Users className="h-4 w-4" />
                Invite Team Member
              </Button>
            </SettingsCard>
          )}

          {tab === "appearance" && (
            <SettingsCard title="Appearance" description="Customize dashboard theme">
              <div className="space-y-2">
                <Label className="font-medium text-foreground">Theme</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { name: "Light", value: "light", icon: Sun },
                    { name: "Dark", value: "dark", icon: Moon },
                    { name: "System", value: "system", icon: Monitor },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        theme === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      type="button"
                    >
                      <option.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SettingsCard>
          )}
        </div>
      </div>
    </>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-foreground">{label}</Label>
      <Input className="h-9" {...props} />
    </div>
  );
}

function SaveButton({ label }: { label: string }) {
  return (
    <div className="border-t border-border pt-4">
      <Button className="gap-2">
        <Save className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}

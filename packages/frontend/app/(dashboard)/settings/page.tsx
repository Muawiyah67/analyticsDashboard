"use client";

import { useState, useEffect } from "react";
import { Bell, Lock, Monitor, Moon, Palette, Save, Settings as SettingsIcon, Sun, Users, Trash2, Plus } from "lucide-react";
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

interface UserSettings {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  notifications: {
    newOrders: boolean;
    orderUpdates: boolean;
    lowStockAlerts: boolean;
    revenueReports: boolean;
  };
  theme: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const [tab, setTab] = useState("account");
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    notifications: {
      newOrders: true,
      orderUpdates: true,
      lowStockAlerts: true,
      revenueReports: false,
    },
    theme: "system",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  // FIX: Wrap localStorage reads in setTimeout to avoid setState during render
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedSettings = localStorage.getItem("nexus_settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      const savedTeam = localStorage.getItem("nexus_team");
      if (savedTeam) {
        setTeamMembers(JSON.parse(savedTeam));
      } else {
        const defaultTeam = [
          { id: "1", name: "John Doe", email: "john@company.com", role: "Admin" },
          { id: "2", name: "Jane Smith", email: "jane@company.com", role: "Editor" },
          { id: "3", name: "Bob Johnson", email: "bob@company.com", role: "Viewer" },
        ];
        setTeamMembers(defaultTeam);
        localStorage.setItem("nexus_team", JSON.stringify(defaultTeam));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("nexus_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveNotifications = () => {
    localStorage.setItem("nexus_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Passwords don't match!");
      return;
    }
    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    alert("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const inviteMember = () => {
    if (!inviteEmail.includes("@")) {
      alert("Please enter a valid email!");
      return;
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem("nexus_team", JSON.stringify(updated));
    setInviteEmail("");
    setInviteRole("Viewer");
  };

  const removeMember = (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    localStorage.setItem("nexus_team", JSON.stringify(updated));
  };

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
              <div className="space-y-2">
                <Label className="font-medium text-foreground">Full Name</Label>
                <Input
                  className="h-9"
                  value={settings.fullName}
                  onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-foreground">Email Address</Label>
                <Input
                  className="h-9"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-foreground">Company</Label>
                <Input
                  className="h-9"
                  value={settings.company}
                  onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-foreground">Phone</Label>
                <Input
                  className="h-9"
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="border-t border-border pt-4">
                <Button onClick={saveSettings} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </SettingsCard>
          )}

          {tab === "notifications" && (
            <SettingsCard title="Notifications" description="Configure how you receive updates">
              {[
                { key: "newOrders", label: "New Orders", description: "Get notified when a new order is placed" },
                { key: "orderUpdates", label: "Order Updates", description: "Receive updates on order status changes" },
                { key: "lowStockAlerts", label: "Low Stock Alerts", description: "Alerts when product inventory is low" },
                { key: "revenueReports", label: "Revenue Reports", description: "Weekly revenue and sales reports" },
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between gap-4 rounded-lg p-3 hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                  <Switch
                    checked={settings.notifications[key as keyof typeof settings.notifications]}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [key]: checked,
                        },
                      })
                    }
                  />
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <Button onClick={saveNotifications} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Preferences"}
                </Button>
              </div>
            </SettingsCard>
          )}

          {tab === "security" && (
            <SettingsCard title="Security" description="Manage your security and privacy settings">
              <div className="space-y-2">
                <Label className="font-medium text-foreground">Current Password</Label>
                <Input
                  className="h-9"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Current password"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-foreground">New Password</Label>
                <Input
                  className="h-9"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="New password"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-foreground">Confirm New Password</Label>
                <Input
                  className="h-9"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm password"
                />
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Strong passwords include uppercase, lowercase, numbers, and special characters.</p>
              </div>
              <div className="border-t border-border pt-4">
                <Button onClick={updatePassword} className="gap-2">
                  <Lock className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </SettingsCard>
          )}

          {tab === "team" && (
            <SettingsCard title="Team & Permissions" description="Manage team members and access">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{member.role}</span>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="rounded p-1 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Invite Team Member</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="h-9"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  <Button onClick={inviteMember} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
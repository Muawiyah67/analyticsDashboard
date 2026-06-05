import { BookOpen, LifeBuoy, Mail, MessageCircle, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const helpCards = [
  { title: "Documentation", description: "Browse setup guides, dashboard workflows, and reporting references.", icon: BookOpen },
  { title: "Contact Support", description: "Send a ticket to the support team for account or billing issues.", icon: LifeBuoy },
  { title: "Community", description: "Ask implementation questions and compare dashboard practices.", icon: MessageCircle },
  { title: "Email Us", description: "Reach the team directly at support@nexus.example.", icon: Mail },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader title="Help" description="Find answers and support resources" />

      <Card className="border border-border shadow-sm">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-10 pl-9" placeholder="Search help articles..." />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {helpCards.map((item) => (
          <Card key={item.title} className="border border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ["How do I export analytics?", "Open Analytics or Reports and use the export action in the page header."],
            ["Can I change the dashboard theme?", "Yes. Use the header toggle or choose Light, Dark, or System in Settings."],
            ["Where are notification settings?", "Open Settings and select the Notifications section."],
          ].map(([question, answer]) => (
            <div key={question} className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-foreground">{question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

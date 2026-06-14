"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, LifeBuoy, Mail, MessageCircle, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const helpCards = [
  { title: "Documentation", description: "Browse setup guides, dashboard workflows, and reporting references.", icon: BookOpen, link: "#docs" },
  { title: "Contact Support", description: "Send a ticket to the support team for account or billing issues.", icon: LifeBuoy, link: "#support" },
  { title: "Community", description: "Ask implementation questions and compare dashboard practices.", icon: MessageCircle, link: "#community" },
  { title: "Email Us", description: "Reach the team directly at support@nexus.example.", icon: Mail, link: "mailto:support@nexus.example" },
];

interface FAQ {
  question: string;
  answer: string;
  open: boolean;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: "How do I export analytics?", answer: "Open Analytics or Reports and use the export action in the page header. You can export as CSV, PDF, or Excel.", open: false },
    { question: "Can I change the dashboard theme?", answer: "Yes. Use the header toggle or choose Light, Dark, or System in Settings > Appearance.", open: false },
    { question: "Where are notification settings?", answer: "Open Settings and select the Notifications section to configure email and in-app alerts.", open: false },
    { question: "How do I invite team members?", answer: "Go to Settings > Team and enter the email address of the person you want to invite. Choose their role (Admin, Editor, or Viewer).", open: false },
    { question: "How do I generate reports?", answer: "Navigate to Reports, click Generate Report, select the type (Sales, Revenue, Products, etc.), and configure filters.", open: false },
    { question: "Can I download reports as PDF?", answer: "Yes. After generating a report, click the Download PDF button on the report card.", open: false },
  ]);

  const toggleFaq = (index: number) => {
    setFaqs(faqs.map((f, i) => i === index ? { ...f, open: !f.open } : { ...f, open: false }));
  };

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCards = helpCards.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Help" description="Find answers and support resources" />

      <Card className="border border-border shadow-sm">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 pl-9"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredCards.map((item) => (
          <a key={item.title} href={item.link} className="block">
            <Card className="border border-border shadow-sm transition-colors hover:bg-muted/50">
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
          </a>
        ))}
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredFaqs.length === 0 ? (
            // FIX: Use backticks instead of quotes to avoid unescaped entities
            <p className="text-sm text-muted-foreground text-center py-4">No results found for &quot;{searchQuery}&quot;</p>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div key={faq.question} className="rounded-lg border border-border">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-medium text-foreground">{faq.question}</span>
                  {faq.open ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {faq.open && (
                  <div className="border-t border-border px-4 pb-4 pt-2">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
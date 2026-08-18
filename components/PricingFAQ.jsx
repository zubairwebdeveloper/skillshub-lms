"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  CreditCard,
  Award,
  ArrowUpCircle,
  GraduationCap,
  Smartphone,
  Users,
  ShieldCheck,
  MessageCircle,
  SearchX,
} from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: "item-1",
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can cancel your subscription at any time from your account settings. You'll keep access until the end of your current billing period.",
    icon: CreditCard,
    category: "Billing",
  },
  {
    id: "item-2",
    question: "Do I get certificates?",
    answer:
      "Pro and Business members can earn certificates after completing eligible courses, each with a unique verification link you can share.",
    icon: Award,
    category: "Certificates",
  },
  {
    id: "item-3",
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can upgrade your plan whenever you need more courses and features. The price difference is prorated automatically.",
    icon: ArrowUpCircle,
    category: "Billing",
  },
  {
    id: "item-4",
    question: "Are the courses beginner friendly?",
    answer:
      "Yes. We provide beginner, intermediate and advanced learning paths, so you can start wherever fits your current skill level.",
    icon: GraduationCap,
    category: "Courses",
  },
  {
    id: "item-5",
    question: "Can I access courses on my phone?",
    answer:
      "Yes. Our platform works on any device with a browser, and you can also use our mobile app for iOS and Android, including offline downloads.",
    icon: Smartphone,
    category: "Access",
  },
  {
    id: "item-6",
    question: "Can a team or business track employee progress?",
    answer:
      "Business plans include an admin dashboard where you can assign courses, set deadlines, and track each team member's progress.",
    icon: Users,
    category: "Business",
  },
  {
    id: "item-7",
    question: "Is there a free trial before I subscribe?",
    answer:
      "Yes. New accounts get a 7-day free trial with full access to Pro features, no credit card required to start.",
    icon: ShieldCheck,
    category: "Billing",
  },
];

export default function PricingFAQ() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section>
      <div className="container mx-auto max-w-3xl px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>

          <p className="mt-3 text-muted-foreground">
            Everything you need to know about our plans.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-6 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="h-11 rounded-xl pl-9"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <Accordion type="single" collapsible className="mt-10">
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>
                    <span className="flex items-center font-bold text-md gap-3 text-left">
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      {item.question}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-2 pl-7">
                      <Badge variant="secondary" className="text-sm">
                        {item.category}
                      </Badge>
                      <p>{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="mt-14 flex flex-col items-center gap-2 text-center text-muted-foreground">
            <SearchX className="h-6 w-6" />
            <p>No questions match &quot;{query}&quot;.</p>
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 p-8 text-center">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Still have questions?</h3>
          <p className="max-w-sm text-md text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Our team is
            happy to help.
          </p>
          <Link href={"/contact"}>
            <Button className="mt-1 rounded-xl">Contact support</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

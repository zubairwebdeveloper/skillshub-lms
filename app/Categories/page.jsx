import Link from "next/link";
import {
  Code2,
  Bot,
  BrainCircuit,
  Database,
  Smartphone,
  BriefcaseBusiness,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    title: "Web Development",
    description: "Build modern websites and web applications.",
    icon: Code2,
    courses: "12 Courses",
  },
  {
    id: 2,
    title: "AI & Automation",
    description: "Learn AI tools and business automation.",
    icon: Bot,
    courses: "8 Courses",
  },
  {
    id: 3,
    title: "Artificial Intelligence",
    description: "Explore modern AI and intelligent applications.",
    icon: BrainCircuit,
    courses: "10 Courses",
  },
  {
    id: 4,
    title: "Backend Development",
    description: "Master APIs, databases and backend systems.",
    icon: Database,
    courses: "9 Courses",
  },
  {
    id: 5,
    title: "Mobile Development",
    description: "Create modern mobile applications.",
    icon: Smartphone,
    courses: "7 Courses",
  },
  {
    id: 6,
    title: "Business & Freelancing",
    description: "Build your freelance and online business career.",
    icon: BriefcaseBusiness,
    courses: "6 Courses",
  },
];

export default function CategoriesPage() {
  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">
            LEARNING CATEGORIES
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Skills & Categories
          </h2>

          <p className="mt-4 text-muted-foreground">
            Choose a category and start learning practical, career-focused
            skills.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link href="/categories" key={category.id} className="group">
                <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg border bg-background p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {category.courses}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-semibold">
                      {category.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>

                    <div className="mt-5 text-sm font-medium text-primary">
                      Explore category →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

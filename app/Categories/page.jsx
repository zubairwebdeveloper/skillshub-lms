import Link from "next/link";

import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  Globe2,
  Layers3,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const categories = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Build modern websites, responsive interfaces, and powerful web applications.",
    icon: Code2,
    courses: "12 Courses",
    skills: ["React", "Next.js", "JavaScript"],
    featured: true,
  },
  {
    id: 2,
    title: "AI & Automation",
    description:
      "Learn AI tools, chatbot development, and business automation workflows.",
    icon: Bot,
    courses: "8 Courses",
    skills: ["Chatbots", "ManyChat", "AI Tools"],
    featured: true,
  },
  {
    id: 3,
    title: "Artificial Intelligence",
    description:
      "Explore modern AI concepts and build intelligent applications.",
    icon: BrainCircuit,
    courses: "10 Courses",
    skills: ["AI", "Machine Learning", "LLMs"],
    featured: false,
  },
  {
    id: 4,
    title: "Backend Development",
    description:
      "Master APIs, databases, authentication, and scalable backend systems.",
    icon: Database,
    courses: "9 Courses",
    skills: ["Node.js", "Firebase", "APIs"],
    featured: false,
  },
  {
    id: 5,
    title: "Mobile Development",
    description:
      "Create modern, responsive, and production-ready mobile applications.",
    icon: Smartphone,
    courses: "7 Courses",
    skills: ["React Native", "Expo", "Mobile"],
    featured: false,
  },
  {
    id: 6,
    title: "Business & Freelancing",
    description:
      "Build your freelance career, find clients, and grow your online business.",
    icon: BriefcaseBusiness,
    courses: "6 Courses",
    skills: ["Freelancing", "Clients", "Business"],
    featured: false,
  },
];

export default function CategoriesPage() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================
            HEADER
        ========================================= */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="rounded-full px-4 py-5">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Learning Categories
          </Badge>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Explore Skills & Categories
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Choose a category and start learning practical, career-focused
            skills through real-world projects.
          </p>
        </div>

        {/* =========================================
            CATEGORY GRID
        ========================================= */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Card
                key={category.id}
                className="
                  group relative h-full overflow-hidden
                  rounded-2xl border bg-card
                  transition-all duration-500 ease-out
                  hover:-translate-y-2
                  hover:border-primary/30
                  hover:shadow-2xl
                "
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <CardContent className="relative flex h-full flex-col p-6 sm:p-7 ">
                  {/* Top */}
                  <div className="flex items-start justify-between  gap-4">
                    {/* Icon */}
                    <div
                      className="
                        flex h-14 w-14 items-center  justify-center
                        rounded-2xl border bg-primary/5 text-primary
                        shadow-sm
                        transition-all duration-500
                        group-hover:scale-110
                        group-hover:border-primary/30
                        group-hover:bg-primary
                        group-hover:text-primary-foreground
                        group-hover:shadow-lg
                      "
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Course count */}
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 py-1 text-md "
                    >
                      <Layers3 className="mr-1.5 h-3.5 w-3.5" />
                      {category.courses}
                    </Badge>
                  </div>

                  {/* Featured */}
                  {category.featured && (
                    <div className="mt-5 md:text-start text-center">
                      <Badge
                        className="
                          rounded-full
                          bg-primary/10
                          text-primary
                          shadow-none
                          hover:bg-primary/10 
                        "
                      >
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        Popular Category
                      </Badge>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="mt-5 text-xl font-bold tracking-tight md:text-start text-center ">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 min-h-[72px] text-md leading-6 text-muted-foreground md:text-start text-center">
                    {category.description}
                  </p>

                  {/* Skills */}
                  <div className="mt-5 flex items-center justify-around md:items-start flex-wrap  gap-6">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="
                          rounded-full
                          px-3 py-4.5
                          text-md
                          transition-colors duration-300
                          group-hover:bg-primary/10
                        "
                      >
                        <CheckCircle2 className="mr-1.5 h-3 w-3 text-primary" />
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Divider */}
                  <Separator className="my-6" />

                  {/* Bottom CTA */}
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                      <p className="text-md text-muted-foreground">
                        Start learning
                      </p>

                      <p className="mt-0.5 text-md font-semibold">
                        Explore courses
                      </p>
                    </div>

                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="
                        h-10 w-10
                        cursor-pointer
                        rounded-full
                        transition-all duration-300
                        group-hover:scale-110
                        group-hover:border-primary
                        group-hover:bg-primary
                        group-hover:text-primary-foreground
                      "
                    >
                      <Link
                        href={`/categories/${category.title
                          .toLowerCase()
                          .replace(/&/g, "and")
                          .replace(/\s+/g, "-")}`}
                        aria-label={`Explore ${category.title}`}
                      >
                        <ArrowUpRight
                          className="
                            h-4 w-4
                            transition-transform duration-300
                            group-hover:rotate-12
                          "
                        />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* =========================================
            BOTTOM CTA
        ========================================= */}
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="
              cursor-pointer
              rounded-full
              px-6
              transition-all duration-300
              hover:-translate-y-1
              hover:border-primary
              hover:shadow-lg
            "
          >
            <Link href="/categories">
              View All Categories
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

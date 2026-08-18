import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    id: 1,
    title: "Expert Courses",
    description:
      "Structured courses covering modern technologies with clear lessons and practical learning paths.",
    icon: BookOpen,
    tag: "Learn",
  },
  {
    id: 2,
    title: "Real Projects",
    description:
      "Build portfolio-ready projects that help you turn knowledge into practical development skills.",
    icon: Code2,
    tag: "Build",
  },
  {
    id: 3,
    title: "Career Growth",
    description:
      "Develop valuable skills and practical experience that move you closer to your professional goals.",
    icon: Rocket,
    tag: "Grow",
  },
  {
    id: 4,
    title: "Learning Community",
    description:
      "Learn alongside other students and developers, share ideas, and grow together.",
    icon: Users,
    tag: "Connect",
  },
];

export default function AboutFeatures() {
  return (
    <section className="relative overflow-hidden border-b bg-muted/20 py-16 sm:py-20 lg:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================
            HEADER
        ========================================= */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
            What We Offer
          </Badge>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for
            <span className="text-primary"> Modern Learners</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Everything you need to learn practical technology skills, build real
            projects, and take the next step in your career.
          </p>
        </div>

        {/* =========================================
            FEATURE CARDS
        ========================================= */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.id}
                className="
                  group relative h-full overflow-hidden
                  rounded-2xl
                  border
                  bg-background/80
                  shadow-sm
                  backdrop-blur
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:border-primary/30
                  hover:shadow-2xl
                "
              >
                {/* Top Accent */}
                <div
                  className="
                    absolute inset-x-0 top-0 h-1
                    origin-left scale-x-0
                    bg-primary
                    transition-transform duration-500
                    group-hover:scale-x-100
                  "
                />

                <CardContent className="p-6">
                  {/* Icon + Number */}
                  <div className="flex items-start justify-between">
                    <div
                      className="
                        flex h-12 w-12
                        items-center justify-center
                        rounded-xl
                        border
                        bg-primary/5
                        text-primary
                        transition-all duration-300
                        group-hover:scale-110
                        group-hover:bg-primary
                        group-hover:text-primary-foreground
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <Badge
                      variant="outline"
                      className="rounded-full px-3 text-[10px]"
                    >
                      {String(feature.id).padStart(2, "0")}
                    </Badge>
                  </div>

                  {/* Tag */}
                  <Badge
                    variant="secondary"
                    className="mt-6 rounded-full bg-primary/10 text-primary"
                  >
                    {feature.tag}
                  </Badge>

                  {/* Title */}
                  <h3 className="mt-4 text-lg font-bold tracking-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-md leading-6 text-muted-foreground">
                    {feature.description}
                  </p>

                  <Separator className="my-5" />

                  {/* Bottom */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Included
                    </div>

                    <ArrowRight
                      className="
                        h-4 w-4
                        text-muted-foreground
                        transition-all duration-300
                        group-hover:translate-x-1
                        group-hover:text-primary
                      "
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* =========================================
            BOTTOM CTA
        ========================================= */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border bg-background/70 p-6 shadow-sm backdrop-blur sm:flex-row sm:p-7">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>

              <h3 className="font-bold">Ready to start learning?</h3>
            </div>

            <p className="mt-2 text-md text-muted-foreground">
              Explore practical courses and start building your skills today.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="
              w-full cursor-pointer rounded-xl
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-lg
              sm:w-auto
            "
          >
            <Link href="/courses">
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

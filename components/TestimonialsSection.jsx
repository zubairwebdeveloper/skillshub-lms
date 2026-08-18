import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const testimonials = [
  {
    id: 1,
    name: "Areeba Zubair",
    role: "Full Stack Developer",
    course: "Full Stack Web Development",
    quote:
      "The practical projects and step-by-step lessons helped me build confidence and start creating real-world full-stack applications.",
  },
  {
    id: 2,
    name: "Ali Khan",
    role: "Frontend Developer",
    course: "React & Next.js",
    quote:
      "The practical projects helped me understand React and Next.js much better. I finally started building real applications.",
  },
  {
    id: 3,
    name: "Sara Ahmed",
    role: "Freelance Developer",
    course: "Full Stack Web Development",
    quote:
      "I went from knowing the basics to confidently building full-stack projects for my portfolio.",
  },
  {
    id: 4,
    name: "Hamza Malik",
    role: "Web Developer",
    course: "Next.js Mastery",
    quote:
      "The course structure is simple, practical, and easy to follow. The projects were the best part.",
  },
  {
    id: 5,
    name: "Ayesha Noor",
    role: "AI Automation Developer",
    course: "AI & Chatbot Automation",
    quote:
      "I learned how to turn what I knew into actual automation projects and client-ready solutions.",
  },
  {
    id: 6,
    name: "Usman Raza",
    role: "Junior Web Developer",
    course: "JavaScript & React",
    quote:
      "The lessons made difficult concepts much easier to understand. I especially liked the real-world coding examples.",
  },
  {
    id: 7,
    name: "Hina Fatima",
    role: "UI Developer",
    course: "Tailwind CSS & Shadcn UI",
    quote:
      "I improved my UI development skills and learned how to create modern, responsive interfaces much faster.",
  },
  {
    id: 8,
    name: "Bilal Ahmed",
    role: "SaaS Developer",
    course: "Next.js & Firebase",
    quote:
      "The combination of Next.js, Firebase, and practical projects gave me everything I needed to start building SaaS applications.",
  },
  {
    id: 9,
    name: "Maham Tariq",
    role: "Chatbot Developer",
    course: "ManyChat & AI Automation",
    quote:
      "The chatbot automation lessons were practical and easy to follow. I can now design automation workflows for real businesses.",
  },
  {
    id: 10,
    name: "Danish Iqbal",
    role: "Full Stack Developer",
    course: "MERN Stack Development",
    quote:
      "The project-based learning approach helped me connect frontend and backend concepts and build complete applications.",
  },
];

function TestimonialCard({ testimonial }) {
  const initials = testimonial.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      className="
        group w-[320px] shrink-0 overflow-hidden rounded-2xl
        border bg-background/90 shadow-sm backdrop-blur
        transition-all duration-500
        hover:-translate-y-2
        hover:border-primary/30
        hover:shadow-2xl
      "
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="
              flex h-11 w-11 items-center justify-center rounded-xl
              bg-primary/10 text-primary
              transition-all duration-300
              group-hover:scale-110
              group-hover:bg-primary
              group-hover:text-primary-foreground
            "
          >
            <Quote className="h-5 w-5" />
          </div>

          <Badge
            variant="secondary"
            className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        </div>

        {/* Rating */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-4 w-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <span className="text-md font-medium text-muted-foreground">5.0</span>
        </div>

        {/* Quote */}
        <p className="mt-5 min-h-[100px] text-md leading-6 text-muted-foreground">
          “{testimonial.quote}”
        </p>

        <Separator className="my-5" />

        {/* Student */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-full bg-primary/10 text-md font-bold text-primary
              ring-4 ring-primary/5
            "
          >
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-md font-semibold">{testimonial.name}</p>

            <p className="truncate text-md text-muted-foreground">
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Course */}
        {testimonial.course && (
          <div
            className="
              mt-5 rounded-xl border bg-muted/30 p-3
              transition-colors duration-300
              group-hover:bg-primary/5
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Completed Course
                </p>

                <p className="mt-1 truncate text-md font-semibold">
                  {testimonial.course}
                </p>
              </div>

              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TestimonialsSection() {
  const stats = [
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
    },
    {
      icon: Users,
      value: "1,000+",
      label: "Active Students",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Completion Rate",
    },
    {
      icon: CheckCircle2,
      value: "50+",
      label: "Projects Built",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b bg-muted/20 py-16 sm:py-20 lg:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Student Success
          </Badge>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Loved by Students
            <span className="text-primary"> Like You</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Real progress from people who started exactly where you are today
            and decided to build something better.
          </p>

          {/* Rating */}
          <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            <span className="text-md font-bold">4.9/5</span>

            <Separator orientation="vertical" className="h-4" />

            <span className="text-md text-muted-foreground">
              From 1,000+ learners
            </span>
          </div>
        </div>

        {/* Infinite Marquee */}
        <div className="relative mt-12 overflow-hidden">
          {/* Left Fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-muted/20 to-transparent sm:w-32 lg:w-48" />

          {/* Right Fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-muted/20 to-transparent sm:w-32 lg:w-48" />

          <div className="group flex w-max animate-marquee hover:[animation-play-state:paused]">
            {/* First Set */}
            <div className="flex gap-5 pr-5">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
            </div>

            {/* Duplicate Set */}
            <div className="flex gap-5 pr-5" aria-hidden="true">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={`duplicate-${testimonial.id}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="
                  group rounded-2xl bg-background/80 shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:shadow-lg
                "
              >
                <CardContent className="flex items-center justify-center md:justify-start  gap-4 p-5">
                  <div
                    className="
                      flex h-11 w-11 shrink-0 items-center justify-center
                      rounded-xl bg-primary/10 text-primary
                      transition-all duration-300
                      group-hover:scale-110
                      group-hover:bg-primary
                      group-hover:text-primary-foreground
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xl font-bold tracking-tight">
                      {stat.value}
                    </p>

                    <p className="mt-0.5 text-md text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden rounded-2xl border bg-background/80 shadow-sm">
            <CardContent className="flex flex-col items-center justify-between gap-5 p-6 text-center sm:flex-row sm:p-7 sm:text-left">
              <div>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <h3 className="font-bold">
                    Your success story could be next.
                  </h3>
                </div>

                <p className="mt-2 text-md text-muted-foreground">
                  Start learning, build real projects, and grow your skills.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="
                  group
                  cursor-pointer
                  rounded-xl
                  px-6
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

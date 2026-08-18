"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Users,
  Check,
  Sparkles,
  Star,
  Quote,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FeaturesSection from "@/components/FeaturesSection";
import AboutHero from "@/components/AboutHero";
import AboutMission from "@/components/AboutMission";
import AboutFeatures from "@/components/AboutFeatures";
import CategoriesPage from "./categories/page";
import MyCoursesPage from "./courses/page";
import PricingPlans from "@/components/PricingPlans";
import ContactForm from "@/components/ContactForm";

import { Button } from "@/components/ui/button";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";

/* =====================================================
   HERO / VALUE SECTIONS
===================================================== */

const sections = [
  {
    id: 1,
    badge: "🚀 Premium LMS",
    title: "Master In-Demand Tech Skills",
    description:
      "Learn Full Stack Web Development, AI, Chatbot Automation, SaaS Development and modern technologies through practical project-based courses.",
    button: "Explore Courses",
    href: "/courses",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
  },
  {
    id: 2,
    badge: "📚 Featured Courses",
    title: "Learn From Beginner to Advanced",
    description:
      "Master HTML, CSS, JavaScript, React, Next.js, Firebase, AI and real-world development projects with structured learning paths.",
    button: "Browse Courses",
    href: "/courses",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  },
  {
    id: 3,
    badge: "⭐ Why Skills Hub",
    title: "Everything You Need to Succeed",
    description:
      "Get practical projects, certificates, quizzes, progress tracking, learning resources and community support in one platform.",
    button: "See Benefits",
    href: "/about",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80",
  },
  {
    id: 4,
    badge: "💼 Career Growth",
    title: "Build a Portfolio & Grow Your Career",
    description:
      "Create professional projects, improve your portfolio, prepare for interviews and develop skills that can help you start freelancing.",
    button: "Start Learning",
    href: "/courses",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
  },
  {
    id: 5,
    badge: "🎓 Learn Anywhere",
    title: "Start Learning at Your Own Pace",
    description:
      "Access your courses whenever you want and build valuable digital skills from anywhere with a modern learning experience.",
    button: "Get Started",
    href: "/courses",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
  },
];

/* =====================================================
   TRUST ITEMS
===================================================== */

const trustItems = [
  {
    id: 1,
    icon: GraduationCap,
    title: "Practical Courses",
    description: "Learn by building real projects.",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Structured Learning",
    description: "Follow clear learning paths.",
  },
  {
    id: 3,
    icon: Users,
    title: "Growing Community",
    description: "Learn with other developers.",
  },
  {
    id: 4,
    icon: CheckCircle2,
    title: "Career Focused",
    description: "Build skills for real opportunities.",
  },
];

/* =====================================================
   STATS (SOCIAL PROOF)
===================================================== */

const stats = [
  { id: 1, value: "10K+", label: "Active Learners" },
  { id: 2, value: "150+", label: "Practical Courses" },
  { id: 3, value: "40+", label: "Expert Instructors" },
  { id: 4, value: "500+", label: "Projects Completed" },
  { id: 5, value: "95%", label: "Course Completion" },
  { id: 6, value: "4.9/5", label: "Average Rating" },
  { id: 7, value: "25+", label: "Learning Paths" },
  { id: 8, value: "24/7", label: "Learn Anytime" },
];

const features = [
  "Project Based",
  "Beginner Friendly",
  "Career Focused",
  "Real-World Skills",
];

/* =====================================================
   HOME PAGE
===================================================== */

export default function HomeSections() {
  return (
    <>
      {/* =================================================
          HERO / VALUE SECTIONS
      ================================================= */}
      <section className="relative overflow-hidden   ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section, index) => (
            <section key={section.id} className="relative py-12 sm:py-16">
              <div
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  index % 2 === 1 && "lg:[&>div:first-child]:order-2",
                )}
              >
                {/* Content */}
                <div>
                  <div className="flex  text-md items-center gap-2">
                    <Badge variant="secondary">
                      {section.badge || "Premium LMS"}
                    </Badge>

                    <Badge variant="outline">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Learn & Build
                    </Badge>
                  </div>

                  <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl md:text-start text-center">
                    {section.title}
                  </h2>

                  <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-start text-center">
                    {section.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="mt-7 flex flex-wrap md:items-start items-center justify-center md:justify-start gap-3 ">
                    {features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="rounded-full px-4 py-6 text-md font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary "
                      >
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="mt-8 flex flex-wrap gap-3 md:items-start items-center justify-around md:justify-start">
                    <Button
                      size="lg"
                      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      asChild
                    >
                      <Link href={section.href}>
                        {section.button}

                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>

                    {index === 0 && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        asChild
                      >
                        <Link href="/about">Learn More</Link>
                      </Button>
                    )}
                  </div>

                  {/* Trust / Stats */}
                  <div className="mt-8 flex flex-wrap items-center gap-6 md:items-start  justify-center md:justify-start">
                    <div>
                      <p className="text-2xl font-bold">1K+</p>
                      <p className="text-xs text-muted-foreground">
                        Active Students
                      </p>
                    </div>

                    <Separator
                      orientation="vertical"
                      className="hidden h-10 sm:block"
                    />

                    <div>
                      <p className="text-2xl font-bold">50+</p>
                      <p className="text-xs text-muted-foreground">
                        Practical Projects
                      </p>
                    </div>

                    <Separator
                      orientation="vertical"
                      className="hidden h-10 sm:block"
                    />

                    <div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-2xl font-bold">4.9</span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Student Rating
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-3xl" />

                  <Card
                    className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                bg-background/80
                p-0
                shadow-xl
                backdrop-blur
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-2xl
              "
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] overflow-hidden ">
                        <Image
                          src={section.image}
                          alt={section.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index === 0}
                          loading={index === 0 ? undefined : "lazy"}
                          quality={75}
                          className="
      object-cover
      transition-transform
      duration-700
      ease-out
      group-hover:scale-110
    "
                        />

                        {/* Dark Gradient */}
                        <div
                          className="
      absolute inset-0
      bg-gradient-to-t
      from-black/70
      via-black/20
      to-transparent
      opacity-80
      transition-opacity
      duration-500
      group-hover:opacity-100
    "
                        />

                        {/* Top Badge */}
                        <div className="absolute left-4 top-4">
                          <Badge
                            className="
        rounded-full
        border border-white/20
        bg-black/40
        px-4 py-4.5
        text-white
        shadow-lg
        backdrop-blur-md
      "
                          >
                            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                            Premium Learning
                          </Badge>
                        </div>

                        {/* Slide Number */}
                        <div className="absolute right-4 top-4">
                          <Badge
                            variant="secondary"
                            className="
        
        bg-background/80
      
        font-medium
        shadow-sm
        backdrop-blur-md
      "
                          >
                            {String(index + 1).padStart(2, "0")} /{" "}
                            {String(sections.length).padStart(2, "0")}
                          </Badge>
                        </div>

                        {/* Bottom Content */}
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                          <div className="flex items-end justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                                Skills Hub
                              </p>

                              <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-white sm:text-xl">
                                {section.title}
                              </h3>
                            </div>

                            <Button
                              size="icon"
                              variant="secondary"
                              className="
          h-10 w-10
          shrink-0
          cursor-pointer
          rounded-full
          shadow-xl
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-primary
          group-hover:text-primary-foreground
        "
                              asChild
                            >
                              <Link
                                href={section.href}
                                aria-label={`Explore ${section.title}`}
                              >
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Floating Info Card */}
                  <Card
                    className="
                absolute
                -bottom-20
                -left-12
                hidden
                w-52
                border
                bg-background/90
                shadow-xl
                backdrop-blur
                sm:block
              "
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            Learn by Doing
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Real-world projects
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* =================================================
          STATS / SOCIAL PROOF
      ================================================= */}

      <section className="relative overflow-hidden rounded-2xl border bg-muted/40 shadow-sm">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <Badge variant="secondary">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Our Growing Community
            </Badge>

            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Learning by the Numbers
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Thousands of learners are building real skills and creating
              real-world projects.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon || Sparkles;

              return (
                <Card
                  key={stat.id}
                  className="
              group
              cursor-pointer
              border-border/60
              bg-background/80
              shadow-sm
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-1.5
              hover:border-primary/30
              hover:bg-primary/[0.03]
              hover:shadow-xl
            "
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className="
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-xl bg-primary/10 text-primary
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:bg-primary
                    group-hover:text-primary-foreground
                  "
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div>
                        <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                          {stat.value}
                        </p>

                        <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                          {stat.label}
                        </p>
                      </div>
                    </div>

                    {/* Bottom line */}
                    <div className="mt-5 h-1 overflow-hidden rounded-full bg-primary/10">
                      <div
                        className="
                    h-full w-1/3 rounded-full bg-primary/50
                    transition-all duration-500
                    group-hover:w-full
                  "
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================
          COURSES — moved up so students can browse
          courses right after the hero, without digging
      ================================================= */}

      <section id="courses" className="scroll-mt-20 border-b">
        <MyCoursesPage />
      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <section id="categories" className="scroll-mt-20 border-b">
        <CategoriesPage />
      </section>

      {/* =================================================
          TRUST / BENEFITS
      ================================================= */}
      <section className="relative overflow-hidden border-b bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Why Learn With Us
            </Badge>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Grow
            </h2>

            <p className="mt-4 text-muted-foreground">
              Learn practical skills with a modern learning experience designed
              for real-world success.
            </p>
          </div>
        </div>

        {/* Infinite Slider */}
        <div className="relative mt-12 overflow-hidden">
          {/* Left Fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent sm:w-32" />

          {/* Right Fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent sm:w-32" />

          {/* Moving Track */}
          <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
            {[...trustItems, ...trustItems].map((item, index) => {
              const Icon = item.icon;

              return (
                <Card
                  key={`${item.id}-${index}`}
                  className="
              group w-[280px] shrink-0
              rounded-2xl border
              bg-background/80
              shadow-sm backdrop-blur
              transition-all duration-300
              hover:-translate-y-1
              hover:border-primary/30
              hover:shadow-xl
            "
                >
                  <CardContent className="p-6">
                    {/* Top */}
                    <div className="flex md:items-start items-center  justify-between">
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

                      <Badge variant="outline" className="rounded-full">
                        0{(index % trustItems.length) + 1}
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-lg font-bold md:text-start text-center">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground md:text-start text-center">
                      {item.description}
                    </p>

                    <Separator className="my-5" />

                    {/* Bottom */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-primary/10 text-primary"
                      >
                        <CheckCircle2 className="mr-1.5 h-3 w-3" />
                        Included
                      </Badge>

                      <ArrowUpRight
                        className="
                    h-4 w-4
                    text-muted-foreground
                    transition-all duration-300
                    group-hover:-translate-y-1
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
        </div>
      </section>

      {/* =================================================
          FEATURES
      ================================================= */}

      <FeaturesSection />

      {/* =================================================
          ABOUT
      ================================================= */}

      <AboutHero />
      <AboutMission />
      <AboutFeatures />

      {/* =================================================
          TESTIMONIALS
      ================================================= */}

      <TestimonialsSection />

      {/* =================================================
          PRICING
      ================================================= */}

      <PricingPlans />

      {/* =================================================
          NEWSLETTER CTA
      ================================================= */}

      <NewsletterSection />

      {/* =================================================
          CONTACT
      ================================================= */}

      <ContactForm />
    </>
  );
}

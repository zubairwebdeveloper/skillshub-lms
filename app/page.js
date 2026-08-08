"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Users,
} from "lucide-react";

import FeaturesSection from "@/components/FeaturesSection";
import AboutHero from "@/components/AboutHero";
import AboutMission from "@/components/AboutMission";
import AboutFeatures from "@/components/AboutFeatures";
import CategoriesPage from "./Categories/page";
import CouresesPage from "./Courses/page";
import PricingPlans from "@/components/PricingPlans";
import ContactForm from "@/components/ContactForm";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CoursesPage from "./Courses/page";

/* =====================================================
   HOME SECTIONS DATA
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
   HOME PAGE
===================================================== */

export default function HomeSections() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =================================================
          HERO / 5 VALUE SECTIONS
      ================================================= */}

      <div>
        {sections.map((section, index) => (
          <section key={section.id} className="border-b">
            <div
              className={`mx-auto grid max-w-7xl items-center gap-12 px-6 md:py-20 py-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Content */}

              <div className="max-w-2xl">
                <Badge variant="secondary" className="rounded-full px-4 py-2">
                  {section.badge}
                </Badge>

                <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {section.title}
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  {section.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link href={section.href}>
                      {section.button}

                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {index === 0 && (
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/about">Learn More</Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <Card className="group overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg p-0">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                        loading={index === 0 ? undefined : "lazy"}
                        quality={75}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* =================================================
          TRUST / BENEFITS
      ================================================= */}

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.id} className="bg-background shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <h3 className="mt-5 font-semibold">{item.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
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
          CATEGORIES
      ================================================= */}

      <CategoriesPage />

      {/* =================================================
          COURSES
      ================================================= */}

      <CoursesPage />

      {/* =================================================
          PRICING
      ================================================= */}

      <PricingPlans />

      {/* =================================================
          CONTACT
      ================================================= */}

      <ContactForm />
    </main>
  );
}

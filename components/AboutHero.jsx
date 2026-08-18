import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b bg-muted/20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* =========================================
              CONTENT
          ========================================= */}
          <div className="w-full text-center md:w-auto md:text-start">
            <Badge
              variant="secondary"
              className="
                
                shadow-sm
              "
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              About Skills Hub
            </Badge>

            <h1
              className="
                mt-6
                text-4xl
                font-bold
                tracking-tight
                sm:text-5xl
                lg:text-6xl
                lg:leading-[1.08]
              "
            >
              Learn. Build.
              <span className="block text-primary">Grow.</span>
            </h1>

            <p
              className="
                mt-6
                max-w-xl
                text-base
                leading-7
                text-muted-foreground
                sm:text-lg
                sm:leading-8
              "
            >
              Skills Hub is a modern learning platform focused on practical
              technology education. We help learners develop real-world skills
              through structured courses, projects, and hands-on learning.
            </p>

            {/* Feature Points */}
            <div className="mt-7 grid gap-6 sm:grid-cols-2 md:justify-start justify-center">
              {[
                "Project-based learning",
                "Career-focused courses",
                "Modern technologies",
                "Learn at your own pace",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-md font-medium"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-9 flex  justify-around gap-3">
              <Button
                asChild
                size="lg"
                className="
                  cursor-pointer
                  rounded-xl
                  px-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="
                  cursor-pointer
                  rounded-xl
                  px-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                "
              >
                <Link href="/contact">
                  Get Started
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust Stats */}
            <div className="mt-10">
              <Separator />

              <div className="mt-6 grid grid-cols-3 gap-4 justify-around w-full">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold">50+</span>
                  </div>

                  <p className="mt-1 text-md text-muted-foreground">Courses</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold">1K+</span>
                  </div>

                  <p className="mt-1 text-md text-muted-foreground">Learners</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold">100%</span>
                  </div>

                  <p className="mt-1 text-md text-muted-foreground">
                    Practical
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              IMAGE
          ========================================= */}
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            {/* Glow */}
            <div className="absolute inset-8 rounded-[2rem] bg-primary/20 blur-3xl" />

            {/* Main Image Card */}
            <Card
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                bg-background
                p-2
                shadow-2xl
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-2xl
              "
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                  alt="Students learning together"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Top Badge */}
                <div className="absolute left-5 top-5">
                  <Badge
                    className="
                     
                      border-white/20
                      bg-black/40
                      
                      text-white
                      shadow-lg
                      backdrop-blur-md
                      hover:bg-black/40
                    "
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Learn by Building
                  </Badge>
                </div>

                {/* Image Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-md text-white/70">
                    Skills Hub Learning Experience
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Build skills that create opportunities.
                  </h2>
                </div>
              </div>
            </Card>

            {/* =========================================
                FLOATING LEARNING CARD
            ========================================= */}
            <Card
              className="
                absolute
                -bottom-6
                left-3
                w-[220px]
                rounded-2xl
                border
                bg-background/95
                shadow-xl
                backdrop-blur
                transition-transform
                duration-300
                hover:-translate-y-1
                sm:left-6
              "
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    <BookOpenCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-md text-muted-foreground">
                      Learning Mode
                    </p>

                    <p className="text-md font-bold">Project Based</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-primary" />
                  </div>

                  <span className="text-md font-semibold">85%</span>
                </div>
              </CardContent>
            </Card>

            {/* =========================================
                FLOATING COMMUNITY CARD
            ========================================= */}
            <Card
              className="
                absolute
                -right-3
                -top-5
                hidden
                rounded-2xl
                border
                bg-background/95
                shadow-xl
                backdrop-blur
                sm:block
                lg:-right-6
              "
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-md text-muted-foreground">Community</p>

                  <p className="text-md font-bold">Growing Together</p>
                </div>
              </CardContent>
            </Card>

            {/* Decorative Dot */}
            <div className="absolute -bottom-2 -right-2 hidden h-16 w-16 rounded-full border-4 border-background bg-primary/10 sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

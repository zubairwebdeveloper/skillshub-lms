import Image from "next/image";
import {
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    id: 1,
    title: "Learn by Building",
    description:
      "Follow practical lessons and build real-world projects instead of only watching theory.",
    icon: BookOpenCheck,
  },
  {
    id: 2,
    title: "Track Your Progress",
    description:
      "Keep your learning organized with progress tracking and a personal dashboard.",
    icon: BarChart3,
  },
  {
    id: 3,
    title: "Earn Certificates",
    description:
      "Complete courses and showcase your achievements with professional certificates.",
    icon: Award,
  },
  {
    id: 4,
    title: "Learning Community",
    description:
      "Connect with other learners, share projects and grow together.",
    icon: UsersRound,
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden border-b bg-muted/20 py-16 sm:py-20 lg:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* =========================================
              IMAGE SIDE
          ========================================= */}
          <div className="relative">
            {/* Main Image Card */}
            <Card
              className="
                group relative overflow-hidden
                rounded-3xl border
                bg-background
                p-2
                shadow-xl
                transition-all duration-500
                hover:-translate-y-2
                hover:shadow-2xl
              "
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                  alt="Students learning together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Image Badge */}
                <div className="absolute left-5 top-5">
                  <Badge
                    className="
                      
                      border border-white/20
                      bg-black/40
                     
                      text-white
                      backdrop-blur-md
                      hover:bg-black/40
                    "
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Modern Learning
                  </Badge>
                </div>

                {/* Image Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="max-w-md">
                    <p className="text-md font-medium text-white/70">
                      Skills Hub
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                      Learn. Build. Grow.
                    </h3>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating Progress Card */}
            <Card
              className="
                absolute -bottom-6 left-4
                w-[210px]
                rounded-2xl
                border
                bg-background/95
                shadow-xl
                backdrop-blur
                transition-transform duration-500
                hover:-translate-y-1
                sm:left-8
              "
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Learning Progress
                    </p>

                    <p className="text-md font-bold">Keep Growing 🚀</p>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[78%] rounded-full bg-primary" />
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Stay consistent and improve every day.
                </p>
              </CardContent>
            </Card>

            {/* Floating Certificate */}
            <Card
              className="
                absolute -right-3 -top-5
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Achievement</p>

                  <p className="text-md font-bold">Certificate Ready</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* =========================================
              CONTENT SIDE
          ========================================= */}
          <div>
            <Badge variant="secondary" >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Why Skills Hub
            </Badge>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything You Need to Grow Your Skills
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A modern learning platform designed for developers, creators,
              entrepreneurs, and anyone who wants to build valuable digital
              skills.
            </p>

            {/* Feature Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.id}
                    className="
                      group h-full
                      rounded-2xl
                      border
                      bg-background/80
                      shadow-sm
                      backdrop-blur-sm
                      transition-all duration-500
                      hover:-translate-y-1
                      hover:border-primary/30
                      hover:shadow-xl
                    "
                  >
                    <CardContent className="p-5">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="
                            flex h-11 w-11
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
                          className="rounded-full text-[10px]"
                        >
                          0{feature.id}
                        </Badge>
                      </div>

                      <h3 className="mt-5 font-bold tracking-tight">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-md leading-6 text-muted-foreground">
                        {feature.description}
                      </p>

                      <Separator className="my-4" />

                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Included with learning
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap justify-around items-center gap-4">
              {/* Explore Courses */}
              <Button
                asChild
                size="lg"
                className="
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
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>

              {/* Learn More */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="
      cursor-pointer
      rounded-xl
      px-6
      transition-all duration-300
      hover:-translate-y-1
      hover:border-primary/40
      hover:bg-primary/5
    "
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

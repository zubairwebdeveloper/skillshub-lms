import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  HeartHandshake,
  Lightbulb,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const missionPoints = [
  {
    id: 1,
    icon: Lightbulb,
    title: "Practical Learning",
    description:
      "Learn by creating real projects, solving real problems, and applying skills in practical situations.",
  },
  {
    id: 2,
    icon: Target,
    title: "Career Focused",
    description:
      "Build valuable skills that can help you grow professionally and prepare for real opportunities.",
  },
  {
    id: 3,
    icon: Rocket,
    title: "Modern Technology",
    description:
      "Stay current with modern web development, AI, automation, and other in-demand technologies.",
  },
  {
    id: 4,
    icon: HeartHandshake,
    title: "Accessible Education",
    description:
      "Make quality technology education simple, approachable, and accessible to more learners.",
  },
];

export default function AboutMission() {
  return (
    <section className="relative overflow-hidden border-b bg-muted/20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-40 top-20 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* =========================================
              IMAGE SIDE
          ========================================= */}
          <div className="relative order-2 lg:order-1">
            {/* Glow */}
            <div className="absolute inset-8 rounded-[2rem] bg-primary/20 blur-3xl" />

            {/* Main Image */}
            <Card
              className="
                group relative overflow-hidden
                rounded-3xl
                border
                bg-background
                p-2
                shadow-xl
                transition-all duration-500
                hover:-translate-y-2
                hover:shadow-2xl 
              "
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998"
                  alt="Students collaborating and learning"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Badge */}
                <div className="absolute left-5 top-5 ">
                  <Badge
                    className="
                      
                      border-white/20
                      bg-black/40
                       
                      text-white
                      backdrop-blur-md
                      hover:bg-black/40
                    "
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Our Mission
                  </Badge>
                </div>

                {/* Image Text */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-md text-white/70 ">Skills Hub</p>

                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Learn skills that create real impact.
                  </h3>
                </div>
              </div>
            </Card>

            {/* =========================================
                FLOATING MISSION CARD
            ========================================= */}
            <Card
              className="
                absolute -bottom-6 left-3
                w-[230px]
                rounded-2xl
                border
                bg-background/95
                shadow-xl
                backdrop-blur
                transition-transform duration-300
                hover:-translate-y-1
                sm:left-6
              "
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 ">
                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Target className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-md text-muted-foreground">Our Goal</p>

                    <p className="text-md font-bold">Skills That Matter</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-md">
                    <span className="text-muted-foreground">
                      Mission Progress
                    </span>

                    <span className="font-semibold">Growing</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Technology Card */}
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
                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Code2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-md text-muted-foreground">Focus</p>

                  <p className="text-md font-bold">Modern Skills</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* =========================================
              CONTENT SIDE
          ========================================= */}
          <div className="order-1 lg:order-2 w-full text-center md:w-auto md:text-start">
            <Badge variant="secondary" >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Our Mission
            </Badge>

            <h2
              className="
                mt-5
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Making Modern Skills
              <span className="block text-primary mt-3">
                Accessible to Everyone
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-7
                text-muted-foreground
                sm:text-lg
                sm:leading-8
              "
            >
              Technology changes quickly. Our goal is to make modern skills
              easier to learn through practical, structured, and accessible
              education.
            </p>

            {/* Mission Stats */}
            <div className="mt-7 flex flex-wrap gap-6 items-center justify-around ">
              <Badge variant="outline" >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Project Based
              </Badge>

              <Badge variant="outline" >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Career Ready
              </Badge>

              <Badge variant="outline" >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Modern Tech
              </Badge>
            </div>

            {/* Mission Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {missionPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.id}
                    className="
                      group
                      h-full
                      rounded-2xl
                      border
                      bg-background/80
                      shadow-sm
                      backdrop-blur
                      transition-all duration-500
                      hover:-translate-y-1
                      hover:border-primary/30
                      hover:shadow-xl
                    "
                  >
                    <CardContent className="p-5">
                      <div className="flex md:items-start items-center  justify-between">
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
                          0{item.id}
                        </Badge>
                      </div>

                      <h3 className="mt-5 font-bold tracking-tight">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-md leading-6 text-muted-foreground">
                        {item.description}
                      </p>

                      <Separator className="my-4" />

                      <div className="flex items-center gap-1.5 text-md font-medium text-primary justify-center md:justify-start">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Part of our mission
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-8">
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
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

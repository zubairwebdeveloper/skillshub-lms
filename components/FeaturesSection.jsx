import Image from "next/image";
import { Award, BarChart3, BookOpenCheck, UsersRound } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

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
    <section className="bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden rounded-xl border">
            <div className="relative aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998"
                alt="Online learning platform"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold text-primary">WHY SKILLS HUB</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Grow Your Skills
            </h2>

            <p className="mt-4 text-muted-foreground">
              A modern learning platform designed for developers, creators,
              entrepreneurs and anyone who wants to build valuable digital
              skills.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <h3 className="font-semibold">{feature.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { BookOpen, Code2, Rocket, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    id: 1,
    title: "Expert Courses",
    description: "Structured courses covering modern technologies.",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Real Projects",
    description: "Build projects that demonstrate your practical skills.",
    icon: Code2,
  },
  {
    id: 3,
    title: "Career Growth",
    description: "Develop skills that help you move toward your career goals.",
    icon: Rocket,
  },
  {
    id: 4,
    title: "Community",
    description: "Learn and grow alongside other students and developers.",
    icon: Users,
  },
];

export default function AboutFeatures() {
  return (
    <section>
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">WHAT WE OFFER</p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Built for Modern Learners
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.id}>
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="mt-5 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

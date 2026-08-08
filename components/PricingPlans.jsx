import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    id: 1,
    name: "Free",
    price: "$0",
    description: "Start learning with essential resources.",
    features: [
      "Selected free courses",
      "Learning dashboard",
      "Course progress",
      "Community access",
    ],
  },
  {
    id: 2,
    name: "Pro",
    price: "$19",
    description: "Perfect for serious learners.",
    popular: true,
    features: [
      "All premium courses",
      "Unlimited learning",
      "Project resources",
      "Certificates",
      "Progress tracking",
      "Priority support",
    ],
  },
  {
    id: 3,
    name: "Business",
    price: "$49",
    description: "Built for teams and organizations.",
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Multiple learners",
      "Team analytics",
      "Priority support",
      "Custom learning paths",
    ],
  },
];

export default function PricingPlans() {
  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg" : "shadow-sm"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute right-5 top-5">Most Popular</Badge>
              )}

              <CardHeader className="md:text-start text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>

                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="pt-5">
                  <span className="text-5xl font-bold">{plan.price}</span>

                  {plan.price !== "$0" && (
                    <span className="ml-2 text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="">
                <div className="space-y-4 ">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm justify-center md:justify-start mt-5"
                    >
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  className="mt-8 w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/contact">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

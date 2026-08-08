import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    id: 1,
    name: "Starter",
    price: "$9",
    description: "For learners getting started.",
    features: [
      "Access to selected courses",
      "Learning dashboard",
      "Course progress tracking",
      "Community access",
    ],
  },
  {
    id: 2,
    name: "Pro",
    price: "$19",
    description: "For serious learners and developers.",
    popular: true,
    features: [
      "Access to all courses",
      "Unlimited learning",
      "Certificates",
      "Project resources",
      "Priority support",
    ],
  },
  {
    id: 3,
    name: "Business",
    price: "$49",
    description: "For teams and organizations.",
    features: [
      "Team learning",
      "All premium courses",
      "Team dashboard",
      "Progress analytics",
      "Priority support",
    ],
  },
];

export default function SubscriptionPage() {
  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">SUBSCRIPTION</p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            One Subscription. Unlimited Learning.
          </h2>

          <p className="mt-4 text-muted-foreground">
            Choose the plan that fits your learning goals.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute right-5 top-5">Most Popular</Badge>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>

                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="pt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>

                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="rounded-full border p-1">
                        <Check className="h-3 w-3 text-primary" />
                      </div>

                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  className="mt-8 w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/pricing">Choose {plan.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

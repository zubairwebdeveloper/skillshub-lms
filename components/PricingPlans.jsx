import Link from "next/link";
import {
  ArrowRight,
  Check,
  Crown,
  Headphones,
  Sparkles,
  Users,
  Zap,
  BookOpen,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const plans = [
  {
    id: 1,
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Start learning with essential resources.",
    icon: BookOpen,
    features: [
      "Selected free courses",
      "Learning dashboard",
      "Course progress",
      "Community access",
    ],
    button: "Start Learning",
    href: "/courses",
  },
  {
    id: 2,
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Perfect for serious learners.",
    popular: true,
    icon: Crown,
    features: [
      "All premium courses",
      "Unlimited learning",
      "Project resources",
      "Professional certificates",
      "Advanced progress tracking",
      "Priority support",
    ],
    button: "Get Pro Access",
    href: "/contact",
  },
  {
    id: 3,
    name: "Business",
    price: "$49",
    period: "/month",
    description: "Built for teams and organizations.",
    icon: Users,
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Multiple learners",
      "Team analytics",
      "Priority support",
      "Custom learning paths",
    ],
    button: "Get Started",
    href: "/contact",
  },
];

export default function PricingPlans() {
  return (
    <section className="relative overflow-hidden border-b bg-muted/20 py-20 sm:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ==============================
            HEADER
        ============================== */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Simple Pricing
          </Badge>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Choose the Right Plan
            
            <span className="block mt-5 text-primary">
              for Your Learning Journey
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Start for free and upgrade whenever you&apos;re ready. Get access to
            practical courses, projects, certificates, and more.
          </p>

          {/* Trust */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <Badge variant="outline" >
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
              No hidden fees
            </Badge>

            <Badge variant="outline" >
              <Zap className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Upgrade anytime
            </Badge>

            <Badge variant="outline" >
              <Headphones className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Friendly support
            </Badge>
          </div>
        </div>

        {/* ==============================
            PRICING CARDS
        ============================== */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <Card
                key={plan.id}
                className={`
                  group relative flex h-full flex-col  overflow-hidden
                  rounded-2xl border bg-background
                  transition-all duration-500 ease-out
                  hover:-translate-y-2
                  hover:shadow-2xl
                  ${
                    plan.popular
                      ? "border-primary/50 shadow-xl shadow-primary/10"
                      : "shadow-sm hover:border-primary/30"
                  }
                `}
              >
                {/* Popular Top Line */}
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                )}

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute right-5 top-5">
                    <Badge className="rounded-full px-3 py-1 shadow-sm">
                      <Crown className="mr-1.5 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="p-6 pb-4 text-center md:text-start">
                  {/* Icon */}
                  <div
                    className={`
                      flex h-12 w-12 items-center justify-center
                      rounded-xl border
                      transition-all duration-300
                      group-hover:scale-110
                      ${
                        plan.popular
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/5 text-primary"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Plan */}
                  <div className="mt-6 ">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>

                    <CardDescription className="mt-2 leading-6">
                      {plan.description}
                    </CardDescription>
                  </div>

                  {/* Price */}
                  <div className="mt-6 flex items-end gap-2 justify-center md:justify-start ">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>

                    <span className="pb-1 text-md text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>

                  {/* Small Label */}
                  {plan.popular ? (
                    <Badge
                      variant="secondary"
                      className="mt-4 w-fit rounded-full bg-primary/10 text-primary"
                    >
                      <Sparkles className="mr-1.5 h-3 w-3" />
                      Best value for learners
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="mt-4 md:w-fit rounded-full text-center md:text-start w-full"
                    >
                      {plan.name === "Free"
                        ? "Start with zero cost"
                        : "For growing teams"}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="flex min-h-[300px] flex-1 flex-col p-6 pt-2 text-center md:text-left">
                  <Separator className="mb-6" />

                  <p className="mb-4 text-md font-semibold">
                    What&apos;s included
                  </p>

                  <ul className="flex flex-1 flex-col justify-start ">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="
          group/feature
          flex min-h-10 
          items-center
          justify-center gap-3
          rounded-lg px-3 py-2
          text-center
          transition-colors duration-200
          hover:bg-muted/50
          md:justify-start
          md:text-left
        "
                      >
                        {/* Check */}
                        <span
                          className="
            flex h-5 w-5 shrink-0 items-center justify-center
            rounded-full bg-primary/10 text-primary
            transition-all duration-300
            group-hover/feature:bg-primary
            group-hover/feature:text-primary-foreground
          "
                        >
                          <Check className="h-3 w-3" />
                        </span>

                        {/* Feature */}
                        <span
                          className="
            min-w-0 flex-1
            text-md leading-5
            text-muted-foreground
            transition-colors duration-300
            group-hover/feature:text-foreground
          "
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-6 pt-2 ">
                  <Button
                    asChild
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    className="
                      group/button
                      w-full
                      cursor-pointer
                      rounded-xl
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-lg
                    "
                  >
                    <Link href={plan.href}>
                      {plan.button}

                      <ArrowRight
                        className="
                          ml-2 h-4 w-4
                          transition-transform duration-300
                          group-hover/button:translate-x-1
                        "
                      />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* ==============================
            BOTTOM NOTE
        ============================== */}
        <div className="mx-auto mt-10 max-w-3xl">
          <Card className="rounded-2xl bg-background/70 shadow-sm backdrop-blur">
            <CardContent className="flex flex-col items-center gap-3 p-5 text-center sm:flex-row sm:justify-center sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-5 w-5" />
              </div>

              <div>
                <p className="text-md font-semibold">
                  Start learning without the pressure.
                </p>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Begin with the Free plan and upgrade when you need more
                  courses, resources, and support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

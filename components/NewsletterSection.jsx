import { ArrowRight, BellRing, Check, Mail, Sparkles,BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function NewsletterSection() {
  return (
    <section className="relative overflow-hidden border-b bg-muted/20 py-16 sm:py-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card
          className="
            group relative overflow-hidden rounded-3xl
            border-primary/20
            bg-primary
            text-primary-foreground
            shadow-xl
            transition-all duration-500
            hover:shadow-2xl
          "
        >
          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />

          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <CardContent className="relative p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              {/* Content */}
              <div>
                <div className="flex flex-wrap items-center gap-6">
                  <Badge
                    variant="secondary"
                    className="
                     
                      bg-primary-foreground/10
                      
                      text-primary-foreground
                      backdrop-blur
                      hover:bg-primary-foreground/15
                    "
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Stay Updated
                  </Badge>

                  <span className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
                    <BellRing className="h-3.5 w-3.5" />
                    Weekly updates
                  </span>
                </div>

                <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Get New Courses
                  <span className="block text-primary-foreground/80">
                    Straight to Your Inbox
                  </span>
                </h2>

                <p className="mt-4 max-w-2xl text-md leading-6 text-primary-foreground/75 sm:text-base">
                  No spam — just new course drops, practical learning tips,
                  project ideas, and useful career resources to help you keep
                  growing.
                </p>

                {/* Benefits */}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {[
                    "New course alerts",
                    "Learning resources",
                    "Career tips",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-primary-foreground/80 sm:text-md"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="w-full lg:w-[390px]">
                <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-4 shadow-lg backdrop-blur-md sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex gap-6 h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                      <Mail className="h-5 w-5" />
                    </div>

                    <div >
                      <p className="text-md font-semibold">
                        Join the newsletter
                      </p>

                      <p className="text-sm text-primary-foreground/60">
                        Be the first to know
                      </p>
                    </div>
                  </div>

                  <Separator className="mb-4 bg-primary-foreground/10" />

                  <form className="space-y-8">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="
                          h-11
                          border-0
                          bg-primary-foreground
                          pl-10
                          text-foreground
                          shadow-sm
                          placeholder:text-muted-foreground
                          focus-visible:ring-2
                          focus-visible:ring-primary-foreground/30
                        "
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="secondary"
                      size="lg"
                      className="
                        group/button
                        h-11
                        w-full
                        cursor-pointer
                        rounded-xl
                        font-semibold
                        transition-all duration-300
                        hover:-translate-y-0.5
                        hover:shadow-lg
                      "
                    >
                      Subscribe for Free
                      <ArrowRight
                        className="
                          ml-2 h-4 w-4
                          transition-transform duration-300
                          group-hover/button:translate-x-1
                        "
                      />
                    </Button>
                  </form>

                  <p className="mt-3 text-center text-[11px] text-primary-foreground/50">
                    Unsubscribe anytime. We respect your inbox.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

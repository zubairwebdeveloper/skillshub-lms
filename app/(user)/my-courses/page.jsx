"use client";

import useSWRSubscription from "swr/subscription";
import Link from "next/link";
import { BookOpen, Plus, ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";
import { subscribeToUserCourses } from "@/lib/firebase/courses/read";
import ListView from "./components/listview";

export default function Page() {
  const { user } = useAuth();

  const { data: courses = [], error } = useSWRSubscription(
    user?.uid ? ["user-courses", user.uid] : null,
    ([, uid], { next }) => {
      const unsubscribe = subscribeToUserCourses(
        uid,
        (courses) => next(null, courses),
        (err) => next(err),
      );

      return () => unsubscribe();
    },
  );

  const loading = !!user?.uid && courses === undefined && !error;
  const hasCourses = !loading && !error && courses.length > 0;

  const publishedCount = courses.filter((c) => c.status === "published").length;
  const draftCount = courses.filter((c) => c.status !== "published").length;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-primary/[0.04] p-5 shadow-sm sm:p-6">
          {/* Background Decorations */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT CONTENT */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Course Management
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-primary shadow-sm transition-all duration-300 hover:rotate-3 hover:scale-105">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    My Courses
                  </h1>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your courses and build your curriculum.
                  </p>
                </div>
              </div>

              {/* LIVE STATS — real counts, sirf tab jab data ho */}
              {hasCourses && (
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {courses.length} total
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {publishedCount} published
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {draftCount} draft
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT BUTTON */}
            <Button
              asChild
              size="lg"
              className="group shrink-0 self-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 sm:self-center"
            >
              <Link href="/my-courses/form">
                <Plus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                Create New Course
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* =====================================================
            COURSES — ListView khud loading / error / empty / table
            sab handle karta hai, is liye yahan koi duplicate
            empty-state block nahi rakha
        ====================================================== */}
        <div className="mt-6">
          <ListView courses={courses} loading={loading} error={error} />
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Globe2,
  BarChart3,
  Layers3,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Chapters from "./components/Chapters";

import { getCourseById } from "@/lib/firebase/courses/read";

export default function Page() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    let isCancelled = false;

    const fetchCourse = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCourseById(courseId);

        if (isCancelled) return;

        if (!data) {
          setError("Course not found.");
        } else {
          setCourse(data);
        }
      } catch (err) {
        console.error("Failed to load course:", err);

        if (!isCancelled) {
          setError(err?.message || "Failed to load course.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchCourse();

    return () => {
      isCancelled = true;
    };
  }, [courseId]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading course...
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR / NOT FOUND
  ======================================================= */

  if (error || !course) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-6 text-center">
          <div>
            <h1 className="text-lg font-semibold">
              {error || "Course not found"}
            </h1>

            <p className="mt-1.5 text-sm text-muted-foreground">
              This course may have been removed or the link is incorrect.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/my-courses">
              <ArrowLeft className="h-4 w-4" />
              Back to courses
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const isPublished = course.status === "published";

  return (
    <main className="w-full">
      {/* =================================================
          BACK LINK
      ================================================= */}

      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Button
          asChild
          variant="ghost"
          className="-ml-2 gap-1.5 text-muted-foreground"
        >
          <Link href="/my-courses">
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
        </Button>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="min-w-0 space-y-8">
            {/* THUMBNAIL */}

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted">
              {course.thumbnailUrl ? (
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title || "Course thumbnail"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, calc(100vw - 400px)"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="absolute left-3 top-3">
                <Badge
                  variant={isPublished ? "default" : "secondary"}
                  className="rounded-full capitalize shadow-sm"
                >
                  {course.status || "draft"}
                </Badge>
              </div>
            </div>

            {/* TITLE + META */}

            <div className="min-w-0">
              {course.category && (
                <span className="text-sm font-medium text-primary">
                  {course.category}
                </span>
              )}

              <h1 className="mt-1.5 break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {course.title}
              </h1>

              {course.shortDescription && (
                <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
                  {course.shortDescription}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                {course.level && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4 shrink-0" />
                    <span>{course.level}</span>
                  </div>
                )}

                {course.language && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Globe2 className="h-4 w-4 shrink-0" />
                    <span>{course.language}</span>
                  </div>
                )}

                {course.category && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Layers3 className="h-4 w-4 shrink-0" />
                    <span>{course.category}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* FULL DESCRIPTION */}

            <div className="min-w-0">
              <h2 className="text-lg font-semibold">About this course</h2>

              <div
                className="prose prose-sm mt-4 max-w-none break-words text-foreground prose-headings:font-semibold prose-a:text-primary"
                dangerouslySetInnerHTML={{
                  __html: course.description || "",
                }}
              />
            </div>
          </div>

          {/* =================================================
              CHAPTERS SIDEBAR
          ================================================= */}

          <aside className="w-full min-w-0 lg:sticky lg:top-6 lg:w-[340px] lg:self-start">
            <Chapters courseId={courseId} />
          </aside>
        </div>
      </div>
    </main>
  );
}

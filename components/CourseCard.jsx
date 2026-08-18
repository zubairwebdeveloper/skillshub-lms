"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Heart,
  Globe2,
  Layers3,
  Star,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* =====================================================
   CourseCard
   - Renders a single course card.
   - IMPORTANT: `course.id` must be the Firestore document id
     (see getCourses() — it must map `id: doc.id` from each
     snapshot, otherwise the "View Course" link below will
     point to /courses/undefined and 404).
===================================================== */

export default function CourseCard({ course }) {
  const hasSale =
    course.priceType === "paid" &&
    typeof course.salePrice === "number" &&
    course.salePrice > 0 &&
    course.salePrice < (course.price || 0);

  const discountPercent = hasSale
    ? Math.round(((course.price - course.salePrice) / course.price) * 100)
    : null;

  // Guard: if we somehow don't have an id, don't render a dead link.
  const courseHref = course?.id ? `/courses/${course.id}` : "#";

  return (
    <Card
      className="
        group flex h-full flex-col overflow-hidden
        rounded-2xl border bg-card p-0
        shadow-sm
        transition-all duration-500 ease-out
        hover:-translate-y-2
        hover:border-primary/30
        hover:shadow-2xl
      "
    >
      {/* THUMBNAIL */}
      <div className="relative shrink-0">
        <Link href={courseHref} className="block">
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw
                "
                className="
                  object-cover
                  transition-transform duration-700
                  ease-out
                  group-hover:scale-110
                "
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}

            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-black/70 via-black/10 to-transparent
                opacity-70
                transition-opacity duration-500
                group-hover:opacity-100
              "
            />

            {/* Top Left badges */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              <Badge
                variant={
                  course.status === "published" ? "default" : "secondary"
                }
                className="
                  rounded-full border-0 px-3 py-1
                  capitalize shadow-lg
                  backdrop-blur-md
                "
              >
                {course.status || "draft"}
              </Badge>

              {course.priceType !== "paid" && (
                <Badge
                  className="
                    rounded-full
                    bg-emerald-500
                    px-3 py-1
                    text-white
                    shadow-lg
                    hover:bg-emerald-500
                  "
                >
                  Free
                </Badge>
              )}

              {hasSale && (
                <Badge
                  className="
                    rounded-full
                    bg-rose-500
                    px-3 py-1
                    text-white
                    shadow-lg
                    hover:bg-rose-500
                  "
                >
                  {discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Wishlist */}
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="
                absolute right-3 top-3
                h-9 w-9
                cursor-pointer
                rounded-full
                bg-background/85
                shadow-lg
                backdrop-blur-md
                transition-all duration-300
                hover:scale-110
                hover:bg-background
              "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>

            {/* Bottom image info */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="
                    max-w-[70%]
                    rounded-full
                    bg-black/40
                    px-3 py-1
                    text-white
                    backdrop-blur-md
                  "
                >
                  <Sparkles className="mr-1.5 h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {course.category || "Development"}
                  </span>
                </Badge>

                {course.level && (
                  <Badge
                    variant="outline"
                    className="
                      rounded-full
                      border-white/30
                      bg-black/30
                      px-3 py-1
                      text-white
                      backdrop-blur-md
                    "
                  >
                    {course.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* CARD CONTENT */}
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        {/* TOP */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-muted-foreground">
                Course
              </p>
              <p className="truncate text-sm font-semibold text-primary">
                {course.category || "Online Learning"}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right">
            {course.priceType === "paid" ? (
              hasSale ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-muted-foreground line-through">
                    ${course.price}
                  </span>
                  <p className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                    ${course.salePrice}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-bold tracking-tight">
                  ${course.price}
                </p>
              )
            ) : (
              <Badge
                variant="secondary"
                className="
                  rounded-full
                  bg-emerald-500/10
                  px-3 py-1
                  font-semibold
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                Free
              </Badge>
            )}
          </div>
        </div>

        {/* TITLE */}
        <Link href={courseHref}>
          <h3
            className="
              mt-5
              line-clamp-2
              min-h-[3.5rem]
              text-xl
              font-bold
              leading-7
              tracking-tight
              transition-colors duration-300
              group-hover:text-primary
            "
          >
            {course.title}
          </h3>
        </Link>

        {/* DESCRIPTION */}
        <p
          className="
            mt-3
            line-clamp-2
            min-h-[3rem]
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          {course.shortDescription ||
            "Learn practical skills through structured lessons, hands-on projects, and real-world examples."}
        </p>

        {/* RATING + STUDENTS */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold">
              {course.rating || "New"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{course.studentsCount || 0} students</span>
          </div>
        </div>

        {/* META */}
        <div className="mt-5 flex flex-wrap gap-2">
          {course.level && (
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              <Layers3 className="mr-1.5 h-3.5 w-3.5" />
              {course.level}
            </Badge>
          )}

          {course.language && (
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              <Globe2 className="mr-1.5 h-3.5 w-3.5" />
              {course.language}
            </Badge>
          )}
        </div>

        <div className="flex-1" />

        <Separator className="my-6" />

        {/* CTA */}
        <Button
          asChild
          className="
            w-full
            cursor-pointer
            justify-between
            rounded-xl
            px-4
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-lg
          "
        >
          <Link href={courseHref}>
            <span>View Course</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/10">
              <ArrowRight
                className="
                  h-4 w-4
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Globe2,
  Layers3,
  Star,
  Users,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Clock,
  ShieldCheck,
  Infinity as InfinityIcon,
  Smartphone,
  Award,
  Share2,
  Check,
  CalendarClock,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// NOTE: assumes a single-course reader lives next to getCourses().
// Rename this import if your file exports it under a different name.
import { getCourseById, getCourses } from "@/lib/firebase/courses/read";
import CourseStudentView from "@/app/courses/[courseId]/component/CourseStudentView";

/* =====================================================
   Effective price helper — mirrors the one used on the
   listing page so discount math stays consistent.
===================================================== */

function getEffectivePrice(course) {
  if (!course || course.priceType !== "paid") return 0;

  const hasValidSale =
    typeof course.salePrice === "number" &&
    course.salePrice > 0 &&
    course.salePrice < (course.price || 0);

  return hasValidSale ? course.salePrice : course.price || 0;
}

function formatDate(value) {
  if (!value) return null;
  try {
    const date = value?.toDate ? value.toDate() : new Date(value);
    return date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

/* =====================================================
   PAGE (default export)
===================================================== */

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openModuleIds, setOpenModuleIds] = useState(() => new Set());
  const [copied, setCopied] = useState(false);

  const [relatedCourses, setRelatedCourses] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourseById(courseId);

        if (!data) {
          setError("not-found");
        } else {
          setCourse(data);
        }
      } catch (err) {
        console.error("Failed to load course:", err);
        setError(err?.message || "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Once we know the course's category, fetch other published courses
  // in that same category to show at the bottom of the page.
  useEffect(() => {
    if (!course?.category) return;

    let isCancelled = false;

    const fetchRelated = async () => {
      try {
        setRelatedLoading(true);

        const all = await getCourses();

        if (isCancelled) return;

        const sameCategory = (all || [])
          .filter(
            (c) =>
              c.id !== course.id &&
              c.category === course.category &&
              c.status !== "draft",
          )
          .slice(0, 4);

        setRelatedCourses(sameCategory);
      } catch (err) {
        console.error("Failed to load related courses:", err);
      } finally {
        if (!isCancelled) setRelatedLoading(false);
      }
    };

    fetchRelated();

    return () => {
      isCancelled = true;
    };
  }, [course?.category, course?.id]);

  const hasSale =
    course?.priceType === "paid" &&
    typeof course?.salePrice === "number" &&
    course.salePrice > 0 &&
    course.salePrice < (course.price || 0);

  const discountPercent = hasSale
    ? Math.round(((course.price - course.salePrice) / course.price) * 100)
    : null;

  const effectivePrice = useMemo(() => getEffectivePrice(course), [course]);

  const modules = course?.modules || course?.curriculum || [];

  const lessonCount = useMemo(
    () =>
      modules.reduce(
        (sum, mod) => sum + (mod.lessons?.length || mod.lessonCount || 0),
        0,
      ),
    [modules],
  );

  const reviews = course?.reviews || [];
  const lastUpdated = formatDate(course?.updatedAt);

  const toggleModule = (moduleId) => {
    setOpenModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  /* =====================================================
     ERROR / NOT FOUND
  ===================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-background rounded-md mt-8">
        <div className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-muted">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            {error === "not-found"
              ? "Course not found"
              : "Something went wrong"}
          </h1>

          <p className="mt-2 max-w-md text-md leading-6 text-muted-foreground">
            {error === "not-found"
              ? "This course may have been removed or the link is incorrect."
              : error}
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/courses")}
          >
            <ChevronLeft className="mr-1.5 h-4 w-4" />
            Back to courses
          </Button>
        </div>
      </main>
    );
  }

  if (!course) return null;

  return (
    <main className="min-h-screen bg-background rounded-md mt-8">
      {/* =========================================
          HERO
      ========================================= */}

      <div className="border-b bg-gradient-to-b from-muted/50 to-background rounded-md">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/courses"
              className="font-medium transition-colors hover:text-foreground"
            >
              Courses
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-foreground">
              {course.category || "Course"}
            </span>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-3">
            {/* Left: title / meta */}
            <div className="lg:col-span-2 ">
              <div className="flex flex-wrap  items-center gap-2">
                <Badge
                  variant={
                    course.status === "published" ? "default" : "secondary"
                  }
                  className="rounded-full border-0  capitalize"
                >
                  {course.status || "draft"}
                </Badge>

                <Badge variant="secondary" className="rounded-full ">
                  <Sparkles className="mr-1.5 h-3 w-3" />
                  {course.category || "Development"}
                </Badge>

                {course.level && (
                  <Badge variant="outline" className="rounded-full  capitalize">
                    {course.level}
                  </Badge>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {course.title}
              </h1>

              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                {course.shortDescription ||
                  "Learn practical skills through structured lessons, hands-on projects, and real-world examples."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">
                    {course.rating || "New"}
                  </span>
                  {reviews.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({reviews.length})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{course.studentsCount || 0} students</span>
                </div>

                {course.language && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe2 className="h-3.5 w-3.5" />
                    <span>{course.language}</span>
                  </div>
                )}

                {lessonCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Layers3 className="h-3.5 w-3.5" />
                    <span>{lessonCount} lessons</span>
                  </div>
                )}

                {lastUpdated && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>Updated {lastUpdated}</span>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="mt-6 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-1.5 rounded-full"
                  onClick={() => setIsWishlisted((prev) => !prev)}
                >
                  <Heart
                    className={[
                      "h-3.5 w-3.5",
                      isWishlisted ? "fill-rose-500 text-rose-500" : "",
                    ].join(" ")}
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-1.5 rounded-full"
                  onClick={handleShare}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Share2 className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Share"}
                </Button>
              </div>
            </div>

            {/* Right: sticky purchase card (desktop only, mobile version repeats below) */}
            <div className="hidden lg:block">
              <PurchaseCard
                course={course}
                hasSale={hasSale}
                discountPercent={discountPercent}
                effectivePrice={effectivePrice}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          BODY
      ========================================= */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: thumbnail + tabs + content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Thumbnail / preview */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border bg-muted">
              {course.thumbnailUrl ? (
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-14 w-14 text-muted-foreground/40" />
                </div>
              )}

              {course.previewVideoUrl && (
                <button
                  type="button"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/90 shadow-lg">
                    <PlayCircle className="h-8 w-8 text-primary" />
                  </span>
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b">
              {[
                { id: "overview", label: "Overview" },
                { id: "curriculum", label: "Curriculum" },
                { id: "instructor", label: "Instructor" },
                {
                  id: "reviews",
                  label: `Reviews${reviews.length ? ` (${reviews.length})` : ""}`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "cursor-pointer border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* =========================================
                OVERVIEW TAB
            ========================================= */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">About this course</h2>

                  <div
                    className="prose prose-sm mt-4 max-w-none break-words text-foreground prose-headings:font-semibold prose-a:text-primary"
                    dangerouslySetInnerHTML={{
                      __html: course.description || "",
                    }}
                  />
                </div>

                {Array.isArray(course.whatYoullLearn) &&
                  course.whatYoullLearn.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold">
                        What you&apos;ll learn
                      </h2>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {course.whatYoullLearn.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span className="text-sm leading-6 text-muted-foreground">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {Array.isArray(course.requirements) &&
                  course.requirements.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold">Requirements</h2>
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
                        {course.requirements.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* =========================================
                CURRICULUM TAB — accordion
            ========================================= */}
            {activeTab === "curriculum" && (
              <div>
                {modules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Curriculum details haven&apos;t been added for this course
                    yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {modules.map((mod, i) => {
                      const moduleId = mod.id || i;
                      const isOpen = openModuleIds.has(moduleId);
                      const lessonsList = mod.lessons || [];

                      return (
                        <Card
                          key={moduleId}
                          className="overflow-hidden rounded-xl border p-0 shadow-none"
                        >
                          <button
                            type="button"
                            onClick={() => toggleModule(moduleId)}
                            className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/40"
                          >
                            <p className="text-sm font-semibold">
                              {mod.title || `Module ${i + 1}`}
                            </p>

                            <div className="flex shrink-0 items-center gap-3">
                              {(lessonsList.length || mod.lessonCount) > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {lessonsList.length || mod.lessonCount}{" "}
                                  lessons
                                </span>
                              )}
                              <ChevronDown
                                className={[
                                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                  isOpen ? "rotate-180" : "",
                                ].join(" ")}
                              />
                            </div>
                          </button>

                          {isOpen && lessonsList.length > 0 && (
                            <CardContent className="border-t p-4 pt-3">
                              <ul className="space-y-2">
                                {lessonsList.map((lesson, j) => (
                                  <li
                                    key={lesson.id || j}
                                    className="flex items-center justify-between gap-3 text-sm text-muted-foreground"
                                  >
                                    <span className="flex items-center gap-2">
                                      <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                                      {lesson.title || `Lesson ${j + 1}`}
                                    </span>
                                    {lesson.duration && (
                                      <span className="shrink-0 text-xs">
                                        {lesson.duration}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =========================================
                INSTRUCTOR TAB
            ========================================= */}
            {activeTab === "instructor" && (
              <div>
                {course.instructor ? (
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                      {course.instructor.avatarUrl ? (
                        <Image
                          src={course.instructor.avatarUrl}
                          alt={course.instructor.name || "Instructor"}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {course.instructor.name || "Instructor"}
                      </p>
                      {course.instructor.title && (
                        <p className="text-xs text-muted-foreground">
                          {course.instructor.title}
                        </p>
                      )}
                      {course.instructor.bio && (
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {course.instructor.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Instructor details haven&apos;t been added for this course
                    yet.
                  </p>
                )}
              </div>
            )}

            {/* =========================================
                REVIEWS TAB
            ========================================= */}
            {activeTab === "reviews" && (
              <div>
                {reviews.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <MessageSquare className="h-6 w-6 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No reviews yet. Be the first to leave one after enrolling.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reviews.map((review, i) => (
                      <div key={review.id || i}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                              {(review.authorName || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {review.authorName || "Student"}
                              </p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, starIdx) => (
                                  <Star
                                    key={starIdx}
                                    className={[
                                      "h-3 w-3",
                                      starIdx < (review.rating || 0)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-muted-foreground/30",
                                    ].join(" ")}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {review.comment && (
                          <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                            {review.comment}
                          </p>
                        )}

                        {i < reviews.length - 1 && (
                          <Separator className="mt-5" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right (mobile): purchase card repeats here since the hero one is desktop-only */}
          <div className="lg:hidden">
            <PurchaseCard
              course={course}
              hasSale={hasSale}
              discountPercent={discountPercent}
              effectivePrice={effectivePrice}
            />
          </div>
        </div>

        {/* =========================================
            RELATED COURSES — other courses in the same category
        ========================================= */}
        {relatedLoading ? (
          <div className="mt-16">
            <div className="h-6 w-56 animate-pulse rounded bg-muted" />
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border bg-card"
                >
                  <div className="aspect-video animate-pulse bg-muted" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          relatedCourses.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  More in {course.category}
                </h2>

                <Link
                  href={`/courses?category=${encodeURIComponent(course.category)}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedCourses.map((related) => (
                  <Link
                    key={related.id}
                    href={`/courses/${related.id}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {related.thumbnailUrl ? (
                          <Image
                            src={related.thumbnailUrl}
                            alt={related.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
                          {related.title}
                        </h3>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium">
                              {related.rating || "New"}
                            </span>
                          </div>

                          <span className="text-sm font-semibold">
                            {related.priceType === "paid"
                              ? `$${related.price}`
                              : "Free"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}

/* =====================================================
   PURCHASE / ENROLL CARD — shared between the desktop
   hero placement and the mobile in-flow placement.
===================================================== */

function PurchaseCard({ course, hasSale, discountPercent, effectivePrice }) {
  return (
    <>
      <CourseStudentView />
      <Card className="sticky top-6 mt-12 overflow-hidden rounded-2xl border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-3">
            {course.priceType === "paid" ? (
              <div>
                {hasSale && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground line-through">
                      ${course.price}
                    </span>
                    <Badge className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs text-white hover:bg-rose-500">
                      {discountPercent}% OFF
                    </Badge>
                  </div>
                )}
                <p className="text-3xl font-bold tracking-tight">
                  ${effectivePrice}
                </p>
              </div>
            ) : (
              <Badge
                variant="secondary"
                className="rounded-full bg-emerald-500/10  text-base font-semibold text-emerald-600 dark:text-emerald-400"
              >
                Free
              </Badge>
            )}
          </div>

          <Button className="mt-5 w-full cursor-pointer rounded-xl py-6 text-base font-semibold">
            {course.priceType === "paid" ? "Enroll now" : "Start learning"}
          </Button>

          <Separator className="my-6" />

          <ul className="space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <InfinityIcon className="h-4 w-4 shrink-0" />
              Full lifetime access
            </li>
            <li className="flex items-center gap-2.5">
              <Smartphone className="h-4 w-4 shrink-0" />
              Access on mobile and desktop
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="h-4 w-4 shrink-0" />
              Certificate of completion
            </li>
            {course.duration && (
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0" />
                {course.duration}
              </li>
            )}
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              30-day money-back guarantee
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}

/* =====================================================
   LOADING SKELETON
===================================================== */

function CourseDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background rounded-md mt-8">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
          </div>
          <div className="h-80 animate-pulse rounded-2xl border bg-muted" />
        </div>
      </div>
    </main>
  );
}

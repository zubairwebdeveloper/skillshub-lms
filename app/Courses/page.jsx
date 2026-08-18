"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Loader2,
  ArrowRight,
  Heart,
  Globe2,
  Layers3,
  Search,
  SlidersHorizontal,
  X,
  Star,
  Users,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCourses } from "@/lib/firebase/courses/read";

const PRICE_FILTERS = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "title", label: "Title A–Z" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
];

/* =====================================================
   Effective price helper — a paid course's real price is
   its salePrice when one is set (and valid), otherwise the
   regular price. Used for sorting so discounted courses
   sort by what a student would actually pay.
===================================================== */

function getEffectivePrice(course) {
  if (course.priceType !== "paid") return 0;

  const hasValidSale =
    typeof course.salePrice === "number" &&
    course.salePrice > 0 &&
    course.salePrice < (course.price || 0);

  return hasValidSale ? course.salePrice : course.price || 0;
}

/* =====================================================
   PAGE (default export) — wraps the real content in
   a Suspense boundary because useSearchParams() bails
   out of static rendering and Next.js requires it to
   be wrapped: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
===================================================== */

export default function MyCoursesPage() {
  return (
    <Suspense fallback={<CoursesPageSkeleton />}>
      <MyCoursesPageContent />
    </Suspense>
  );
}

/* =====================================================
   Simple full-page fallback shown while the Suspense
   boundary resolves (first paint / navigation).
===================================================== */

function CoursesPageSkeleton() {
  return (
    <main className="min-h-screen bg-background rounded-md mt-8">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <div className="aspect-video animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-9 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/* =====================================================
   ACTUAL PAGE CONTENT — everything from the original
   component lives here now, unchanged, except it is no
   longer the default export.
===================================================== */

function MyCoursesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters are read straight from the URL so results are shareable/bookmarkable
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const price = searchParams.get("price") || "all";
  const level = searchParams.get("level") || "all";
  const sort = searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(query);

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourses();

        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError(err?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* =====================================================
     URL PARAM HELPERS
  ===================================================== */

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Debounce the search input into the URL
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== query) {
        updateParams({ q: searchInput || null });
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput("");
    router.push("?", { scroll: false });
  };

  const hasActiveFilters =
    query || category !== "all" || price !== "all" || level !== "all";

  /* =====================================================
     DERIVED FILTER OPTIONS
  ===================================================== */

  const categories = useMemo(() => {
    const unique = new Set(courses.map((c) => c.category).filter(Boolean));
    return ["all", ...Array.from(unique)];
  }, [courses]);

  const levels = useMemo(() => {
    const unique = new Set(courses.map((c) => c.level).filter(Boolean));
    return ["all", ...Array.from(unique)];
  }, [courses]);

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const visibleCourses = useMemo(() => {
    let result = [...courses];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.shortDescription?.toLowerCase().includes(q),
      );
    }

    if (category !== "all") {
      result = result.filter((c) => c.category === category);
    }

    if (price !== "all") {
      result = result.filter((c) =>
        price === "free" ? c.priceType !== "paid" : c.priceType === "paid",
      );
    }

    if (level !== "all") {
      result = result.filter((c) => c.level === level);
    }

    switch (sort) {
      case "title":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "price-low":
        // Sort by the price a student actually pays (sale price
        // when present), not the pre-discount sticker price.
        result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-high":
        result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      default:
        // "newest" — keep original order from the backend (assumed newest-first)
        break;
    }

    return result;
  }, [courses, query, category, price, level, sort]);

  return (
    <main className="min-h-screen bg-background rounded-md mt-8">
      {/* =========================================
          HERO / HEADER
      ========================================= */}

      <div className="border-b bg-gradient-to-b from-muted/50 to-background rounded-md ">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 "
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Premium Courses
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explore Our Courses
            </h1>

            <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
              Learn practical skills through carefully structured, project-based
              courses designed to help you grow your career and build real-world
              experience.
            </p>
          </div>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search courses by title or topic..."
              className="h-12 rounded-full pl-11 pr-4 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =========================================
            FILTER BAR
        ========================================= */}

        {!loading && !error && courses.length > 0 && (
          <div className="mb-8 space-y-4">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="mr-1 h-4 w-4 text-muted-foreground" />

              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => updateParams({ category: cat })}
                  className={[
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition-colors cursor-pointer  hover:scale-105",
                    category === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  ].join(" ")}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            {/* Secondary filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Price */}
              <div className="flex items-center gap-1 rounded-full border bg-muted/40 p-1">
                {PRICE_FILTERS.map((p) => (
                  <Button
                    key={p.id}
                    type="button"
                    size="sm"
                    variant={price === p.id ? "default" : "ghost"}
                    onClick={() => updateParams({ price: p.id })}
                    className="cursor-pointer rounded-full px-4 py-2 text-md font-medium transition-all duration-300 hover:scale-105"
                  >
                    {p.label}
                  </Button>
                ))}
              </div>

              {/* Level - Shadcn Select */}
              {levels.length > 1 && (
                <Select
                  value={level}
                  onValueChange={(value) => updateParams({ level: value })}
                >
                  <SelectTrigger className="h-9 w-[150px] rounded-full text-md  font-medium">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>

                  <SelectContent>
                    {levels.map((lvl) => (
                      <SelectItem key={lvl} value={lvl} className="capitalize">
                        {lvl === "all" ? "All Levels" : lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Sort - Shadcn Select */}
              <Select
                value={sort}
                onValueChange={(value) => updateParams({ sort: value })}
              >
                <SelectTrigger className="h-9 w-[190px] rounded-full text-md font-medium">
                  <SelectValue placeholder="Sort Courses" />
                </SelectTrigger>

                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            LOADING (skeleton)
        ========================================= */}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-video animate-pulse bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-9 w-full animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================
            ERROR
        ========================================= */}

        {!loading && error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-md text-destructive">
            {error}
          </div>
        )}

        {/* =========================================
            EMPTY STATE (no courses at all)
        ========================================= */}

        {!loading && !error && courses.length === 0 && (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border bg-card px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-muted">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">No courses available</h2>

            <p className="mt-2 max-w-md text-md leading-6 text-muted-foreground">
              Courses will appear here once they have been created and
              published.
            </p>
          </div>
        )}

        {/* =========================================
            EMPTY STATE (filters matched nothing)
        ========================================= */}

        {!loading &&
          !error &&
          courses.length > 0 &&
          visibleCourses.length === 0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border bg-card px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No matching courses
              </h2>

              <p className="mt-2 max-w-md text-md leading-6 text-muted-foreground">
                Try adjusting your search or filters.
              </p>

              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}

        {/* =========================================
            COURSE GRID
        ========================================= */}

        {!loading && !error && visibleCourses.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visibleCourses.map((course) => {
              const hasSale =
                course.priceType === "paid" &&
                typeof course.salePrice === "number" &&
                course.salePrice > 0 &&
                course.salePrice < (course.price || 0);

              const discountPercent = hasSale
                ? Math.round(
                    ((course.price - course.salePrice) / course.price) * 100,
                  )
                : null;

              return (
                <Card
                  key={course.id}
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
                  {/* =========================================
          THUMBNAIL
      ========================================= */}
                  <div className="relative shrink-0">
                    <Link href={`/courses/${course.id}`} className="block">
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

                        {/* Image Gradient */}
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

                        {/* Top Left */}
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <Badge
                            variant={
                              course.status === "published"
                                ? "default"
                                : "secondary"
                            }
                            className="
                  rounded-full border-0 
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

                        {/* Bottom Image Info */}
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              variant="secondary"
                              className="
                    max-w-[70%]
                    rounded-full
                    bg-black/40
                    
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

                  {/* =========================================
          CARD CONTENT
      ========================================= */}
                  <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* TOP CONTENT */}
                    <div className="flex items-start justify-between gap-4">
                      {/* Category */}
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

                    {/* =========================================
            TITLE
        ========================================= */}
                    <Link href={`/courses/${course.id}`}>
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

                    {/* =========================================
            DESCRIPTION
        ========================================= */}
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

                    {/* =========================================
            RATING + STUDENTS
        ========================================= */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                        <span className="text-xs font-semibold">
                          {course.rating || "New"}
                        </span>
                      </div>

                      {/* Students */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />

                        <span>{course.studentsCount || 0} students</span>
                      </div>
                    </div>

                    {/* =========================================
            META
        ========================================= */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {course.level && (
                        <Badge
                          variant="outline"
                          className="rounded-full  text-xs"
                        >
                          <Layers3 className="mr-1.5 h-3.5 w-3.5" />
                          {course.level}
                        </Badge>
                      )}

                      {course.language && (
                        <Badge
                          variant="outline"
                          className="rounded-full  text-xs"
                        >
                          <Globe2 className="mr-1.5 h-3.5 w-3.5" />
                          {course.language}
                        </Badge>
                      )}
                    </div>

                    {/* =========================================
            SPACER
            Keeps CTA aligned at bottom
        ========================================= */}
                    <div className="flex-1" />

                    <Separator className="my-6" />

                    {/* =========================================
            CTA
        ========================================= */}
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
                      <Link href={`/courses/${course.id}`}>
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
            })}
          </div>
        )}
      </div>
    </main>
  );
}

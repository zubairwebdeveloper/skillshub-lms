"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  PlayCircle,
  Loader2,
  BookOpen,
  MonitorPlay,
  ImageIcon,
  Video,
  Search,
  Clock,
  X,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ListVideo,
} from "lucide-react";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { getChapters } from "@/lib/firebase/chapters/read";

/* =====================================================
   CONTENT TYPE META
===================================================== */

const CONTENT_TYPE_META = {
  youtube: {
    label: "Video Lesson",
    icon: MonitorPlay,
    className:
      "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400",
  },

  image: {
    label: "Image Lesson",
    icon: ImageIcon,
    className:
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
  },

  video: {
    label: "Video Lesson",
    icon: Video,
    className:
      "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-400",
  },
};

/* =====================================================
   COMPONENT
===================================================== */

export default function Chapters() {
  const { courseId } = useParams();

  const [search, setSearch] = useState("");

  /* =====================================================
     FETCH CHAPTERS
  ===================================================== */

  const {
    data: chapters = [],
    error,
    isLoading,
  } = useSWR(
    courseId ? ["chapters", courseId] : null,
    ([, id]) => getChapters(id),
    {
      revalidateOnFocus: false,
    },
  );

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters;

    const query = search.trim().toLowerCase();

    return chapters.filter(
      (chapter) =>
        chapter.chapterTitle?.toLowerCase().includes(query) ||
        chapter.videoTitle?.toLowerCase().includes(query) ||
        chapter.description?.toLowerCase().includes(query),
    );
  }, [chapters, search]);

  /* =====================================================
     CLEAR SEARCH
  ===================================================== */

  const clearSearch = () => {
    setSearch("");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="flex-1">
      <Card className="overflow-hidden border-border/60 bg-background shadow-sm">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-5">
            {/* Top */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex  items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                      Course Lessons
                    </h2>

                    {!isLoading && !error && (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2.5"
                      >
                        {chapters.length}{" "}
                        {chapters.length === 1 ? "Lesson" : "Lessons"}
                      </Badge>
                    )}
                  </div>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                    Explore the lessons below and learn step-by-step at your own
                    pace.
                  </p>
                </div>
              </div>

              {!isLoading && !error && chapters.length > 0 && (
                <div className="hidden shrink-0 items-center gap-2 rounded-lg justify-center xl:justify-start border bg-muted/40 px-3 py-2 sm:flex">
                  <ListVideo className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm font-medium">
                    {chapters.length} lessons
                  </span>
                </div>
              )}
            </div>

            {/* Search */}
            {!isLoading && !error && chapters.length > 0 && (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search lessons, chapters..."
                  className="h-11 pl-9 pr-10"
                />

                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Search Result */}
            {!isLoading && !error && search.trim() && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredChapters.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {chapters.length}
                  </span>{" "}
                  lessons
                </span>

                {filteredChapters.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="font-medium text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* =================================================
            CONTENT
        ================================================= */}

        <CardContent className="p-2">
          {/* =================================================
              LOADING
          ================================================= */}

          {isLoading && (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                Loading your lessons
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while we load the course content.
              </p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!isLoading && error && (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <BookOpen className="h-5 w-5 text-destructive" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                Unable to load lessons
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {error.message ||
                  "Something went wrong while loading the course chapters."}
              </p>
            </div>
          )}

          {/* =================================================
              NO CHAPTERS
          ================================================= */}

          {!isLoading && !error && chapters.length === 0 && (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-base font-semibold">
                No lessons available
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                Course lessons haven&apos;t been added yet. Please check back
                later.
              </p>
            </div>
          )}

          {/* =================================================
              NO SEARCH RESULTS
          ================================================= */}

          {!isLoading &&
            !error &&
            chapters.length > 0 &&
            filteredChapters.length === 0 && (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-sm font-semibold">No lessons found</h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                  We couldn&apos;t find any lesson matching{" "}
                  <span className="font-medium text-foreground">
                    &quot;{search}&quot;
                  </span>
                  .
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSearch}
                  className="mt-4"
                >
                  Clear search
                </Button>
              </div>
            )}

          {/* =================================================
              CHAPTERS
          ================================================= */}

          {!isLoading && !error && filteredChapters.length > 0 && (
            <div className="space-y-4">
              {/* Learning Header */}
              <div className="flex items-center gap-2 rounded-xl border bg-muted/30 px-4 py-3">
                <Sparkles className="h-4 w-4 text-primary" />

                <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                  Click any lesson to view its description and learning content.
                </p>
              </div>

              <Accordion
                type="single"
                collapsible
                defaultValue={filteredChapters[0]?.id}
                className="w-full space-y-3"
              >
                {filteredChapters.map((chapter) => {
                  const originalIndex = chapters.findIndex(
                    (item) => item.id === chapter.id,
                  );

                  const typeMeta =
                    CONTENT_TYPE_META[chapter.contentType] ||
                    CONTENT_TYPE_META.youtube;

                  const TypeIcon = typeMeta.icon;

                  return (
                    <AccordionItem
                      key={chapter.id}
                      value={chapter.id}
                      className="group overflow-hidden rounded-2xl border bg-background px-0 transition-all duration-200 hover:border-primary/30 hover:shadow-sm data-[state=open]:border-primary/30 data-[state=open]:shadow-md"
                    >
                      {/* =================================================
                          TRIGGER
                      ================================================= */}

                      <AccordionTrigger className="px-4 py-4 hover:no-underline sm:px-5 sm:py-5 [&>svg]:mr-1 [&>svg]:shrink-0">
                        <div className="flex min-w-0 flex-1 items-start gap-3 text-left sm:gap-4">
                          {/* Number */}
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary transition-colors group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground sm:h-11 sm:w-11">
                            {String(originalIndex + 1).padStart(2, "0")}
                          </div>

                          {/* Main Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <PlayCircle className="mt-0.5 hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />

                              <div className="min-w-0 flex-1">
                                <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground sm:text-base">
                                  {chapter.chapterTitle || "Untitled Chapter"}
                                </h3>

                                {chapter.videoTitle && (
                                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                                    {chapter.videoTitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <Badge
                                variant="outline"
                                className={`gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium sm:text-xs ${typeMeta.className}`}
                              >
                                <TypeIcon className="h-3 w-3" />

                                {typeMeta.label}
                              </Badge>

                              {chapter.duration && (
                                <Badge
                                  variant="outline"
                                  className="gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs"
                                >
                                  <Clock className="h-3 w-3" />

                                  {chapter.duration}
                                </Badge>
                              )}

                              {chapter.description && (
                                <Badge
                                  variant="secondary"
                                  className="hidden gap-1 rounded-full px-2 py-0.5 text-[11px] sm:inline-flex"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Details available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      {/* =================================================
                          CONTENT
                      ================================================= */}

                      <AccordionContent className="border-t bg-muted/10  w-full">
                        <div className="space-y-5 p-2">
                          {/* Description */}
                          {chapter.description ? (
                            <div className="rounded-xl border bg-background p-4 sm:p-5">
                              <div className="mb-3 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />

                                <h4 className="text-sm font-semibold">
                                  About this lesson
                                </h4>
                              </div>

                              <div
                                className="
                                  prose
                                  prose-sm
                                  max-w-none
                                  leading-7
                                  text-muted-foreground
                                  dark:prose-invert
                                  prose-headings:text-foreground
                                  prose-strong:text-foreground
                                  prose-a:text-primary
                                  prose-li:marker:text-muted-foreground
                                "
                                dangerouslySetInnerHTML={{
                                  __html: chapter.description,
                                }}
                              />
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed bg-background p-4">
                              <p className="text-sm text-muted-foreground">
                                No description available for this lesson.
                              </p>
                            </div>
                          )}

                          {/* =================================================
                              YOUTUBE
                          ================================================= */}

                          {chapter.contentType === "youtube" &&
                            chapter.youtubeVideoId && (
                              <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
                                <div className="relative aspect-video w-full">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${chapter.youtubeVideoId}`}
                                    title={
                                      chapter.videoTitle ||
                                      chapter.chapterTitle ||
                                      "Course lesson"
                                    }
                                    className="absolute inset-0 h-full w-full"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            )}

                          {/* =================================================
                              IMAGE
                          ================================================= */}

                          {chapter.contentType === "image" &&
                            chapter.mediaUrl && (
                              <div className="overflow-hidden rounded-2xl border bg-muted/30 shadow-sm">
                                <div className="flex min-h-[200px] items-center justify-center p-2 sm:min-h-[300px] sm:p-4">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={chapter.mediaUrl}
                                    alt={
                                      chapter.videoTitle ||
                                      chapter.chapterTitle ||
                                      "Lesson image"
                                    }
                                    loading="lazy"
                                    className="h-auto max-h-[650px] w-full rounded-xl object-contain"
                                  />
                                </div>
                              </div>
                            )}

                          {/* =================================================
                              VIDEO
                          ================================================= */}

                          {chapter.contentType === "video" &&
                            chapter.mediaUrl && (
                              <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
                                <video
                                  src={chapter.mediaUrl}
                                  controls
                                  preload="metadata"
                                  playsInline
                                  className="aspect-video w-full"
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}

                          {/* =================================================
                              FOOTER
                          ================================================= */}

                          <div className="flex flex-col gap-2 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </span>

                              <span>
                                Lesson {originalIndex + 1} of {chapters.length}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <span>Keep learning</span>

                              <ChevronRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

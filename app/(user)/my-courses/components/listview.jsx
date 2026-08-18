"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteCourse, updateCourseStatus } from "@/lib/firebase/courses/write";

// 👇 ab yeh direct data fetch nahi karta — page.jsx se props leta hai
export default function ListView({ courses = [], loading, error }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      await deleteCourse(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      window.alert(
        err?.message || "Failed to delete course. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (course) => {
    const nextStatus = course.status === "published" ? "draft" : "published";

    setTogglingId(course.id);
    try {
      await updateCourseStatus(course.id, nextStatus);
    } catch (err) {
      console.error(err);
      window.alert(err?.message || "Failed to update course status.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-3">
        {/* LOADING */}
        {loading && (
          <div className="flex min-h-40 items-center justify-center rounded-xl border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your courses...
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error?.message?.includes("index")
              ? "Setting things up for the first time — this can take a minute. Please refresh shortly."
              : error?.message || "Failed to load courses."}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && courses.length === 0 && (
          <Card>
            <CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                You haven&apos;t created any courses yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* CARD GRID */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => {
              const isPublished = course.status === "published";
              const isDeleting = deletingId === course.id;
              const isToggling = togglingId === course.id;

              return (
                <Card
                  key={course.id}
                  className={cn(
                    "group overflow-hidden pt-0 transition-all hover:shadow-md",
                    isDeleting && "pointer-events-none opacity-40",
                  )}
                >
                  {/* THUMBNAIL */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* STATUS BADGE */}
                    <Badge
                      className={cn(
                        "absolute left-2 top-2 gap-1.5 border capitalize shadow-sm",
                        isPublished
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isPublished ? "bg-emerald-500" : "bg-amber-500",
                        )}
                      />
                      {course.status || "draft"}
                    </Badge>
                  </div>

                  <CardContent className="space-y-2 px-4">
                    <Link
                      href={`/my-courses/${course.id}`}
                      className="line-clamp-1 text-sm font-semibold leading-tight hover:text-primary hover:underline"
                    >
                      {course.title}
                    </Link>

                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {course.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {course.category && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          <Layers className="h-3 w-3" />
                          {course.category}
                        </span>
                      )}
                      {course.level && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          <BarChart3 className="h-3 w-3" />
                          {course.level}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t px-4 py-3">
                    <span className="text-sm font-semibold">
                      {course.priceType === "paid"
                        ? `$${course.price}`
                        : "Free"}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* PUBLISH / UNPUBLISH */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            disabled={isDeleting || isToggling}
                            onClick={() => handleToggleStatus(course)}
                          >
                            {isToggling ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isPublished ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isPublished ? "Unpublish" : "Publish"}
                        </TooltipContent>
                      </Tooltip>

                      {/* EDIT */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            disabled={isDeleting}
                            asChild
                          >
                            <Link href={`/my-courses/form?id=${course.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      {/* DELETE */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={isDeleting}
                            onClick={() => setDeleteTarget(course)}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this course?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{deleteTarget?.title}&rdquo; will be permanently removed.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!deletingId}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={!!deletingId}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}

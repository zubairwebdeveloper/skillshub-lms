"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { createCourse, updateCourse } from "@/lib/firebase/courses/write";
import { getCourseById } from "@/lib/firebase/courses/read";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import RichTextEditor from "@/components/rich-text-editor";

import {
  BookOpen,
  FileText,
  ImagePlus,
  Layers3,
  Loader2,
  Save,
  Sparkles,
  X,
} from "lucide-react";

/* =========================================================
   OPTIONS
========================================================= */

const CATEGORIES = [
  "Development",
  "Design",
  "Business",
  "Marketing",
  "IT & Software",
  "Personal Development",
  "Photography",
  "Music",
];

const LANGUAGES = ["English", "Urdu", "Hindi", "Arabic"];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

/* =========================================================
   FILE VALIDATION
========================================================= */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* =========================================================
   FORM SCHEMA
========================================================= */

const formSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must not exceed 100 characters"),

    // thumbnail: z
    //   .instanceof(File, {
    //     message: "Thumbnail image is required",
    //   })
    //   .refine(
    //     (file) => file.size <= MAX_FILE_SIZE,
    //     "Image must be under 5MB",
    //   )
    //   .refine(
    //     (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    //     "Only JPG, PNG or WEBP images are supported",
    //   ),

    shortDescription: z
      .string()
      .min(20, "Short description must be at least 20 characters")
      .max(200, "Short description must not exceed 200 characters"),

    description: z
      .string()
      .min(1, "Course description is required")
      .refine((html) => {
        const plainText = html
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim();

        return plainText.length >= 50;
      }, "Course description must be at least 50 characters"),

    category: z.string().min(1, "Please select a category"),
    language: z.string().min(1, "Please select a language"),
    level: z.string().min(1, "Please select a level"),

    priceType: z.enum(["free", "paid"], {
      message: "Please select free or paid",
    }),

    price: z.coerce.number().optional(),

    // Optional discounted / sale price shown alongside the
    // regular price for paid courses.
    salePrice: z.coerce.number().optional(),
  })
  .refine((data) => data.priceType !== "paid" || (data.price ?? 0) > 0, {
    message: "Enter a price greater than 0",
    path: ["price"],
  })
  .refine(
    (data) => {
      // Only validate sale price when it was actually provided.
      if (data.priceType !== "paid") return true;
      if (data.salePrice === undefined || Number.isNaN(data.salePrice)) {
        return true;
      }
      return data.salePrice > 0;
    },
    {
      message: "Enter a sale price greater than 0",
      path: ["salePrice"],
    },
  )
  .refine(
    (data) => {
      // Sale price must be lower than the regular price.
      if (data.priceType !== "paid") return true;
      if (data.salePrice === undefined || Number.isNaN(data.salePrice)) {
        return true;
      }
      return data.salePrice < (data.price ?? 0);
    },
    {
      message: "Sale price must be less than the regular price",
      path: ["salePrice"],
    },
  );

const DEFAULT_VALUES = {
  title: "",
  // thumbnail: undefined,
  shortDescription: "",
  description: "",
  category: "",
  language: "",
  level: "",
  priceType: "free",
  price: undefined,
  salePrice: undefined,
};

/* =========================================================
   PAGE
========================================================= */

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("id");
  const isEditMode = Boolean(courseId);

  const [thumbPreview, setThumbPreview] = useState(null);

  const [submitError, setSubmitError] = useState("");

  /* =======================================================
     EDIT MODE: fetch existing course + prefill state
  ======================================================= */

  const [isLoadingCourse, setIsLoadingCourse] = useState(isEditMode);
  const [loadError, setLoadError] = useState("");

  /* =======================================================
     FORM
  ======================================================= */

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });

  /* =======================================================
     WATCH
  ======================================================= */

  const priceType = form.watch("priceType");

  const price = form.watch("price");

  const salePrice = form.watch("salePrice");

  const shortDescription = form.watch("shortDescription");

  const descriptionLength = shortDescription?.length ?? 0;

  // Discount percentage, purely for the sidebar preview.
  const discountPercent =
    priceType === "paid" && price > 0 && salePrice > 0 && salePrice < price
      ? Math.round(((price - salePrice) / price) * 100)
      : null;

  /* =======================================================
     LOAD COURSE FOR EDIT MODE
  ======================================================= */

  useEffect(() => {
    if (!isEditMode) return;

    let isCancelled = false;

    const loadCourse = async () => {
      setIsLoadingCourse(true);
      setLoadError("");

      try {
        const course = await getCourseById(courseId);

        if (!course) {
          throw new Error("Course not found.");
        }

        if (isCancelled) return;

        /* Reset the form with the fetched values so all fields,
           including the sidebar's live-watched fields, come back
           populated exactly as saved. */
        form.reset({
          title: course.title ?? "",
          shortDescription: course.shortDescription ?? "",
          description: course.description ?? "",
          category: course.category ?? "",
          language: course.language ?? "",
          level: course.level ?? "",
          priceType: course.priceType ?? "free",
          price: course.price ?? undefined,
          salePrice: course.salePrice ?? undefined,
        });

        if (course.thumbnailUrl) {
          setThumbPreview(course.thumbnailUrl);
        }
      } catch (err) {
        console.error("Failed to load course:", err);

        if (!isCancelled) {
          setLoadError(
            err?.message || "Failed to load course. Please try again.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingCourse(false);
        }
      }
    };

    loadCourse();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, isEditMode]);

  /* =======================================================
     CLEANUP THUMBNAIL PREVIEW (only for local blob URLs)
  ======================================================= */

  useEffect(() => {
    return () => {
      if (thumbPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbPreview);
      }
    };
  }, [thumbPreview]);

  /* =======================================================
     THUMBNAIL CHANGE
  ======================================================= */

  const handleThumbnailChange = (event, onChange) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /* Remove old preview URL */
    if (thumbPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbPreview);
    }

    onChange(file);

    const previewUrl = URL.createObjectURL(file);

    setThumbPreview(previewUrl);
  };

  /* =======================================================
     CLEAR THUMBNAIL
  ======================================================= */

  const clearThumbnail = (onChange) => {
    if (thumbPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbPreview);
    }

    onChange(undefined);

    setThumbPreview(null);
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const onSubmit = async (values) => {
    setSubmitError("");

    try {
      // Don't persist a stray salePrice for free courses or when
      // the field was left empty.
      const payload = {
        ...values,
        salePrice:
          values.priceType === "paid" && values.salePrice
            ? values.salePrice
            : undefined,
      };

      if (isEditMode) {
        await updateCourse(courseId, payload);

        console.log("Course updated:", courseId);
      } else {
        const result = await createCourse(payload);

        console.log("Course created:", result.id);
      }

      router.push("/my-courses");
    } catch (error) {
      console.error("Course save error:", error);

      setSubmitError(
        error?.message || "Something went wrong while saving your course.",
      );
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>

              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {isEditMode ? "Edit Course" : "Create New Course"}
              </h1>
            </div>

            <p className="mt-1.5 text-sm text-muted-foreground">
              {isEditMode
                ? "Update the details of your existing course."
                : "Create and configure a new course for your students."}
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground sm:flex">
            <Layers3 className="h-4 w-4" />

            <span>Course Management</span>
          </div>
        </div>
      </header>

      {/* =================================================
          LOADING STATE (edit mode only)
      ================================================= */}

      {isEditMode && isLoadingCourse && (
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-24">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading course details...
          </div>
        </div>
      )}

      {isEditMode && !isLoadingCourse && loadError && (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        </div>
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      {(!isEditMode || (!isLoadingCourse && !loadError)) && (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              {/* =============================================
                  FORM CARD
              ============================================= */}

              <Card className="border bg-card shadow-sm">
                <CardHeader className="border-b">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div>
                      <CardTitle className="text-lg">
                        Course Information
                      </CardTitle>

                      <CardDescription className="mt-1.5">
                        {isEditMode
                          ? "Update the basic information about your course."
                          : "Add the basic information about your new course."}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <FieldGroup>
                    {/* =======================================
                        BASIC INFORMATION
                    ======================================= */}

                    <FieldSet>
                      <FieldLegend>Basic Information</FieldLegend>

                      <FieldDescription>
                        Provide the essential information students will see
                        before enrolling.
                      </FieldDescription>

                      <FieldSeparator />

                      {/* TITLE */}

                      <Field data-invalid={!!form.formState.errors.title}>
                        <FieldLabel htmlFor="title">Course Title</FieldLabel>

                        <FieldContent>
                          <Input
                            id="title"
                            placeholder="e.g. Full Stack Web Development"
                            {...form.register("title")}
                            aria-invalid={!!form.formState.errors.title}
                          />

                          <FieldDescription>
                            Use a clear and descriptive course title.
                          </FieldDescription>

                          {form.formState.errors.title && (
                            <FieldError>
                              {form.formState.errors.title.message}
                            </FieldError>
                          )}
                        </FieldContent>
                      </Field>
                      {/* =================================================
      THUMBNAIL - TEMPORARILY DISABLED
  ================================================= */}

                      {/* 
  <Field data-invalid={!!form.formState.errors.thumbnail}>
    <FieldLabel htmlFor="thumbnail">
      Course Thumbnail
    </FieldLabel>
  
    <FieldContent>
      <Controller
        control={form.control}
        name="thumbnail"
        render={({ field: { onChange, name } }) => (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
  
              {thumbPreview ? (
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border bg-muted sm:h-24 sm:w-40">
                  <Image
                    src={thumbPreview}
                    alt="Course thumbnail preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
  
                  <button
                    type="button"
                    onClick={() => clearThumbnail(onChange)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border bg-background/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="thumbnail"
                  className="flex h-28 w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 text-muted-foreground sm:h-24 sm:w-40"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-xs font-medium">
                    Upload image
                  </span>
                </label>
              )}
  
              <div className="min-w-0 flex-1">
                <Input
                  id="thumbnail"
                  name={name}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="cursor-pointer"
                  onChange={(event) =>
                    handleThumbnailChange(event, onChange)
                  }
                />
  
                <FieldDescription className="mt-2">
                  JPG, PNG or WEBP. Max size 5MB. Recommended
                  1280×720px.
                </FieldDescription>
              </div>
            </div>
          </div>
        )}
      />
  
      {form.formState.errors.thumbnail && (
        <FieldError>
          {form.formState.errors.thumbnail.message}
        </FieldError>
      )}
    </FieldContent>
  </Field>
  */}
                      {/* SHORT DESCRIPTION */}

                      <Field
                        data-invalid={!!form.formState.errors.shortDescription}
                      >
                        <FieldLabel htmlFor="shortDescription">
                          Short Description
                        </FieldLabel>

                        <FieldContent>
                          <Textarea
                            id="shortDescription"
                            placeholder="A one or two line summary shown on course cards..."
                            className="min-h-20 resize-none"
                            {...form.register("shortDescription")}
                            aria-invalid={
                              !!form.formState.errors.shortDescription
                            }
                          />

                          <div className="flex items-start justify-between gap-4">
                            <FieldDescription>
                              Shown in course listings and search results.
                            </FieldDescription>

                            <span className="shrink-0 text-xs text-muted-foreground">
                              {descriptionLength}
                              /200
                            </span>
                          </div>

                          {form.formState.errors.shortDescription && (
                            <FieldError>
                              {form.formState.errors.shortDescription.message}
                            </FieldError>
                          )}
                        </FieldContent>
                      </Field>

                      {/* FULL DESCRIPTION */}

                      <Field data-invalid={!!form.formState.errors.description}>
                        <FieldLabel>Full Course Description</FieldLabel>

                        <FieldContent>
                          <Controller
                            control={form.control}
                            name="description"
                            render={({ field: { onChange, value } }) => (
                              <RichTextEditor
                                value={value || ""}
                                onChange={onChange}
                                placeholder="Describe what students will learn, prerequisites, and course structure..."
                              />
                            )}
                          />

                          <FieldDescription>
                            This appears on the full course page. Use headings,
                            lists, tables and media to make it easy to scan.
                          </FieldDescription>

                          {form.formState.errors.description && (
                            <FieldError>
                              {form.formState.errors.description.message}
                            </FieldError>
                          )}
                        </FieldContent>
                      </Field>
                    </FieldSet>

                    <FieldSeparator />

                    {/* =======================================
                        CLASSIFICATION
                    ======================================= */}

                    <FieldSet>
                      <FieldLegend>Classification</FieldLegend>

                      <FieldDescription>
                        Help students find your course through filters and
                        search.
                      </FieldDescription>

                      <FieldSeparator />

                      <div className="grid gap-6 sm:grid-cols-3">
                        {/* CATEGORY */}

                        <Field data-invalid={!!form.formState.errors.category}>
                          <FieldLabel htmlFor="category">Category</FieldLabel>

                          <FieldContent>
                            <Controller
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {CATEGORIES.map((category) => (
                                      <SelectItem
                                        key={category}
                                        value={category}
                                      >
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {form.formState.errors.category && (
                              <FieldError>
                                {form.formState.errors.category.message}
                              </FieldError>
                            )}
                          </FieldContent>
                        </Field>

                        {/* LANGUAGE */}

                        <Field data-invalid={!!form.formState.errors.language}>
                          <FieldLabel htmlFor="language">Language</FieldLabel>

                          <FieldContent>
                            <Controller
                              control={form.control}
                              name="language"
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger id="language">
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {LANGUAGES.map((language) => (
                                      <SelectItem
                                        key={language}
                                        value={language}
                                      >
                                        {language}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {form.formState.errors.language && (
                              <FieldError>
                                {form.formState.errors.language.message}
                              </FieldError>
                            )}
                          </FieldContent>
                        </Field>

                        {/* LEVEL */}

                        <Field data-invalid={!!form.formState.errors.level}>
                          <FieldLabel htmlFor="level">Level</FieldLabel>

                          <FieldContent>
                            <Controller
                              control={form.control}
                              name="level"
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger id="level">
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {LEVELS.map((level) => (
                                      <SelectItem key={level} value={level}>
                                        {level}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {form.formState.errors.level && (
                              <FieldError>
                                {form.formState.errors.level.message}
                              </FieldError>
                            )}
                          </FieldContent>
                        </Field>
                      </div>
                    </FieldSet>

                    <FieldSeparator />

                    {/* =======================================
                        PRICING
                    ======================================= */}

                    <FieldSet>
                      <FieldLegend>Pricing</FieldLegend>

                      <FieldDescription>
                        Decide whether students pay to enroll in this course.
                      </FieldDescription>

                      <FieldSeparator />

                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* PRICE TYPE */}

                        <Field data-invalid={!!form.formState.errors.priceType}>
                          <FieldLabel htmlFor="priceType">
                            Price Type
                          </FieldLabel>

                          <FieldContent>
                            <Controller
                              control={form.control}
                              name="priceType"
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger id="priceType">
                                    <SelectValue placeholder="Select price type" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>

                                    <SelectItem value="paid">Paid</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {form.formState.errors.priceType && (
                              <FieldError>
                                {form.formState.errors.priceType.message}
                              </FieldError>
                            )}
                          </FieldContent>
                        </Field>

                        {/* PRICE */}

                        {priceType === "paid" && (
                          <Field data-invalid={!!form.formState.errors.price}>
                            <FieldLabel htmlFor="price">Price (USD)</FieldLabel>

                            <FieldContent>
                              <Input
                                id="price"
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="e.g. 29.99"
                                {...form.register("price")}
                                aria-invalid={!!form.formState.errors.price}
                              />

                              {form.formState.errors.price && (
                                <FieldError>
                                  {form.formState.errors.price.message}
                                </FieldError>
                              )}
                            </FieldContent>
                          </Field>
                        )}

                        {/* SALE PRICE */}

                        {priceType === "paid" && (
                          <Field
                            data-invalid={!!form.formState.errors.salePrice}
                          >
                            <FieldLabel htmlFor="salePrice">
                              Sale Price (USD)
                            </FieldLabel>

                            <FieldContent>
                              <Input
                                id="salePrice"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Optional discounted price"
                                {...form.register("salePrice")}
                                aria-invalid={!!form.formState.errors.salePrice}
                              />

                              <FieldDescription>
                                Optional. Must be lower than the regular price.
                                Leave blank to sell at full price.
                              </FieldDescription>

                              {form.formState.errors.salePrice && (
                                <FieldError>
                                  {form.formState.errors.salePrice.message}
                                </FieldError>
                              )}
                            </FieldContent>
                          </Field>
                        )}
                      </div>
                    </FieldSet>
                  </FieldGroup>

                  {/* =========================================
                      SUBMIT ERROR
                  ========================================= */}

                  {submitError && (
                    <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      {submitError}
                    </div>
                  )}

                  {/* =========================================
                      ACTIONS
                  ========================================= */}

                  <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" asChild>
                      <Link href="/my-courses">Cancel</Link>
                    </Button>

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {isEditMode ? "Update Course" : "Create Course"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* =============================================
                  SIDEBAR
              ============================================= */}

              <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                {/* COURSE SETUP */}

                <Card className="border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Course Setup</CardTitle>

                    <CardDescription>
                      A few things to keep in mind.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-5">
                      {/* ITEM 1 */}

                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-xs font-medium">
                          1
                        </div>

                        <div>
                          <FieldTitle className="text-sm">
                            Use a clear title
                          </FieldTitle>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Make your course name easy to understand and
                            searchable.
                          </p>
                        </div>
                      </div>

                      {/* ITEM 2 */}

                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-xs font-medium">
                          2
                        </div>

                        <div>
                          <FieldTitle className="text-sm">
                            Add an eye-catching thumbnail
                          </FieldTitle>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            A clear 1280×720 image improves click-through rate.
                          </p>
                        </div>
                      </div>

                      {/* ITEM 3 */}

                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-xs font-medium">
                          3
                        </div>

                        <div>
                          <FieldTitle className="text-sm">
                            Write a useful description
                          </FieldTitle>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Explain what students will learn and achieve.
                          </p>
                        </div>
                      </div>

                      {/* ITEM 4 */}

                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-xs font-medium">
                          4
                        </div>

                        <div>
                          <FieldTitle className="text-sm">
                            Build your curriculum
                          </FieldTitle>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Add modules, lessons, videos, and resources after
                            {isEditMode ? " updating" : " creating"} the course.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* COURSE STATUS */}

                <Card className="border bg-card shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Course Status
                      </span>

                      <span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium">
                        Draft
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <span className="text-sm text-muted-foreground">
                        Pricing
                      </span>

                      <span className="flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                        {priceType === "paid" && (
                          <Sparkles className="h-3 w-3" />
                        )}

                        {priceType}
                      </span>
                    </div>

                    {discountPercent !== null && (
                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <span className="text-sm text-muted-foreground">
                          Discount
                        </span>

                        <span className="rounded-full border bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {discountPercent}% off (${price} → ${salePrice})
                        </span>
                      </div>
                    )}

                    <p className="mt-4 border-t pt-4 text-xs leading-5 text-muted-foreground">
                      {isEditMode
                        ? "Changes are saved to this course in Firestore once you click Update Course."
                        : "Your course will be saved as a draft in Firestore. You can add curriculum and publish it later."}
                    </p>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </form>
        </main>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  PlayCircle,
  Loader2,
  MonitorPlay,
  ImageIcon,
  Video,
  Clock,
  AlertCircle,
  Link2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import RichTextEditor from "@/components/rich-text-editor";
import { createChapter } from "@/lib/firebase/chapters/create";

/* =====================================================
   CONTENT TYPE OPTIONS
===================================================== */

const CONTENT_TYPES = [
  {
    id: "youtube",
    label: "YouTube",
    icon: MonitorPlay,
  },
  {
    id: "image",
    label: "Image",
    icon: ImageIcon,
  },
  {
    id: "video",
    label: "Video",
    icon: Video,
  },
];

/* =====================================================
   HELPERS
===================================================== */

// Pulls a YouTube video ID out of a pasted URL, or returns
// the value untouched if it already looks like a bare ID.
function extractYoutubeId(value) {
  if (!value) return "";

  const trimmed = value.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return trimmed;
}

export default function Page() {
  const { courseId } = useParams();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    chapterTitle: "",
    videoTitle: "",
    contentType: "youtube", // "youtube" | "image" | "video"
    youtubeVideoId: "",
    mediaUrl: "", // used for "image" and "video" content types
    thumbnailUrl: "",
    duration: "",
    description: "",
  });

  const TITLE_MAX = 100;

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleYoutubeChange = (e) => {
    const raw = e.target.value;

    setFormData((prev) => ({
      ...prev,
      youtubeVideoId: extractYoutubeId(raw),
    }));
  };

  const handleContentTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      contentType: type,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  /* =====================================================
     PREVIEW
  ===================================================== */

  const previewThumbnail = useMemo(() => {
    if (formData.thumbnailUrl) return formData.thumbnailUrl;

    if (formData.contentType === "youtube" && formData.youtubeVideoId) {
      return `https://img.youtube.com/vi/${formData.youtubeVideoId}/hqdefault.jpg`;
    }

    if (formData.contentType === "image" && formData.mediaUrl) {
      return formData.mediaUrl;
    }

    return "";
  }, [
    formData.thumbnailUrl,
    formData.contentType,
    formData.youtubeVideoId,
    formData.mediaUrl,
  ]);

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validate = () => {
    if (formData.contentType === "youtube" && !formData.youtubeVideoId) {
      return "Please add a YouTube video ID or link.";
    }

    if (
      (formData.contentType === "image" || formData.contentType === "video") &&
      !formData.mediaUrl
    ) {
      return formData.contentType === "image"
        ? "Please add an image URL."
        : "Please add a video URL.";
    }

    return "";
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const result = await createChapter(courseId, formData);

      console.log("Chapter created successfully:", result);

      router.push(`/my-courses/${courseId}`);
    } catch (error) {
      console.error("Failed to create chapter:", error);

      setError(
        error?.message || "Something went wrong while creating the chapter.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-muted/30">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Button
          asChild
          variant="ghost"
          className="-ml-2 mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/my-courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Chapters
          </Link>
        </Button>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PlayCircle className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create Chapter
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a new chapter and its content to your course.
            </p>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            FORM CARD
        ================================================= */}

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center gap-2 text-base">
              <PlayCircle className="h-5 w-5" />
              Chapter Information
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* =================================================
                  TITLES
              ================================================= */}

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="chapterTitle">
                    Chapter Title <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id="chapterTitle"
                    name="chapterTitle"
                    placeholder="e.g. Introduction to HTML"
                    value={formData.chapterTitle}
                    onChange={handleChange}
                    maxLength={TITLE_MAX}
                    required
                    disabled={saving}
                  />

                  <p className="text-right text-xs text-muted-foreground">
                    {formData.chapterTitle.length}/{TITLE_MAX}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoTitle">
                    Video Title <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id="videoTitle"
                    name="videoTitle"
                    placeholder="e.g. What is HTML?"
                    value={formData.videoTitle}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* =================================================
                  CONTENT TYPE SELECTOR
              ================================================= */}

              <div className="space-y-3">
                <Label>
                  Content Type <span className="text-destructive">*</span>
                </Label>

                <div className="grid grid-cols-3 gap-3">
                  {CONTENT_TYPES.map(({ id, label, icon: Icon }) => {
                    const active = formData.contentType === id;

                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={saving}
                        onClick={() => handleContentTypeChange(id)}
                        className={[
                          "flex flex-col items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-all",
                          active
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                        ].join(" ")}
                      >
                        <Icon
                          className={[
                            "h-6 w-6 transition-transform",
                            active ? "scale-110" : "",
                          ].join(" ")}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  DYNAMIC CONTENT INPUT
              ================================================= */}

              <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                {formData.contentType === "youtube" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="youtubeVideoId"
                      className="flex items-center gap-2"
                    >
                      <MonitorPlay className="h-4 w-4 text-muted-foreground" />
                      YouTube Video ID or Link{" "}
                      <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="youtubeVideoId"
                      name="youtubeVideoId"
                      placeholder="Paste a link or ID, e.g. dQw4w9WgXcQ"
                      value={formData.youtubeVideoId}
                      onChange={handleYoutubeChange}
                      disabled={saving}
                    />

                    <p className="text-xs text-muted-foreground">
                      Paste a full YouTube URL and the ID will be extracted
                      automatically.
                    </p>
                  </div>
                )}

                {formData.contentType === "image" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="mediaUrl"
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      Image URL <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="mediaUrl"
                      name="mediaUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.mediaUrl}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>
                )}

                {formData.contentType === "video" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="mediaUrl"
                      className="flex items-center gap-2"
                    >
                      <Video className="h-4 w-4 text-muted-foreground" />
                      Video URL <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="mediaUrl"
                      name="mediaUrl"
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={formData.mediaUrl}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>
                )}

                {/* Duration, shown for youtube + video */}
                {(formData.contentType === "youtube" ||
                  formData.contentType === "video") && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="duration"
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Duration
                    </Label>

                    <Input
                      id="duration"
                      name="duration"
                      placeholder="e.g. 12:45"
                      value={formData.duration}
                      onChange={handleChange}
                      disabled={saving}
                      className="max-w-[160px]"
                    />
                  </div>
                )}

                {/* Thumbnail, shown for youtube + video (image type uses its own URL as thumbnail) */}
                {(formData.contentType === "youtube" ||
                  formData.contentType === "video") && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="thumbnailUrl"
                      className="flex items-center gap-2"
                    >
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      Thumbnail URL
                    </Label>

                    <Input
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      type="url"
                      placeholder="https://img.youtube.com/vi/.../maxresdefault.jpg"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      disabled={saving}
                    />

                    <p className="text-xs text-muted-foreground">
                      Optional.{" "}
                      {formData.contentType === "youtube"
                        ? "If empty, the YouTube thumbnail will be generated automatically."
                        : "Add a cover image for this video."}
                    </p>
                  </div>
                )}

                {/* Live preview */}
                {previewThumbnail && (
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewThumbnail}
                        alt="Content preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      Preview
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="space-y-2">
                <Label>Chapter Description</Label>

                <RichTextEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe what students will learn in this chapter..."
                />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                {/* Cancel */}
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto"
                  disabled={saving}
                >
                  <Link href={`/my-courses/${courseId}`}>Cancel</Link>
                </Button>

                {/* Save */}
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Chapter
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

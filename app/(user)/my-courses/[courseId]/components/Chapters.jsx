"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Plus,
  PlayCircle,
  Loader2,
  BookOpen,
  Pencil,
  Trash2,
  MonitorPlay,
  ImageIcon,
  Video,
  Search,
  Clock,
  TriangleAlert,
  AlertCircle,
  Link2,
  Save,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import RichTextEditor from "@/components/rich-text-editor";
import { getChapters } from "@/lib/firebase/chapters/read";
import { updateChapter, deleteChapter } from "@/lib/firebase/chapters/create";

const CONTENT_TYPES = [
  { id: "youtube", label: "YouTube", icon: MonitorPlay },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "video", label: "Video", icon: Video },
];

const CONTENT_TYPE_META = {
  youtube: {
    label: "YouTube",
    icon: MonitorPlay,
    className: "border-red-200 bg-red-50 text-red-600",
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    className: "border-blue-200 bg-blue-50 text-blue-600",
  },
  video: {
    label: "Video",
    icon: Video,
    className: "border-purple-200 bg-purple-50 text-purple-600",
  },
};

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

const TITLE_MAX = 100;

export default function Chapters() {
  const { courseId } = useParams();

  const [search, setSearch] = useState("");
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Inline edit state — null means "show list"
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const {
    data: chapters = [],
    error,
    isLoading,
    mutate,
  } = useSWR(
    courseId ? ["chapters", courseId] : null,
    ([, id]) => getChapters(id),
    { revalidateOnFocus: false },
  );

  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters;
    const q = search.trim().toLowerCase();
    return chapters.filter(
      (chapter) =>
        chapter.chapterTitle?.toLowerCase().includes(q) ||
        chapter.videoTitle?.toLowerCase().includes(q),
    );
  }, [chapters, search]);

  /* =====================================================
     EDIT
  ===================================================== */

  const startEdit = (chapter) => {
    setSaveError("");
    setEditingChapter(chapter);
    setFormData({
      chapterTitle: chapter.chapterTitle || "",
      videoTitle: chapter.videoTitle || "",
      contentType: chapter.contentType || "youtube",
      youtubeVideoId: chapter.youtubeVideoId || "",
      mediaUrl: chapter.mediaUrl || "",
      thumbnailUrl: chapter.thumbnailUrl || "",
      duration: chapter.duration || "",
      description: chapter.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingChapter(null);
    setFormData(null);
    setSaveError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYoutubeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      youtubeVideoId: extractYoutubeId(e.target.value),
    }));
  };

  const handleContentTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, contentType: type }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const previewThumbnail = useMemo(() => {
    if (!formData) return "";
    if (formData.thumbnailUrl) return formData.thumbnailUrl;
    if (formData.contentType === "youtube" && formData.youtubeVideoId) {
      return `https://img.youtube.com/vi/${formData.youtubeVideoId}/hqdefault.jpg`;
    }
    if (formData.contentType === "image" && formData.mediaUrl) {
      return formData.mediaUrl;
    }
    return "";
  }, [formData]);

  const validateForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");

    const validationError = validateForm();
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      setSaving(true);
      const result = await updateChapter(courseId, editingChapter.id, formData);

      await mutate(
        (current = []) =>
          current.map((c) => (c.id === editingChapter.id ? result.data : c)),
        { revalidate: false },
      );

      cancelEdit();
    } catch (err) {
      console.error("Failed to update chapter:", err);
      setSaveError(err?.message || "Failed to update chapter.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const confirmDelete = async () => {
    if (!chapterToDelete) return;
    setDeleteError("");

    try {
      setDeletingId(chapterToDelete.id);

      await mutate(
        async (current = []) => {
          await deleteChapter(courseId, chapterToDelete.id);
          return current.filter((c) => c.id !== chapterToDelete.id);
        },
        {
          optimisticData: (current = []) =>
            current.filter((c) => c.id !== chapterToDelete.id),
          rollbackOnError: true,
          revalidate: false,
        },
      );
    } catch (err) {
      console.error("Failed to delete chapter:", err);
      setDeleteError(err?.message || "Failed to delete chapter.");
    } finally {
      setDeletingId(null);
      setChapterToDelete(null);
    }
  };

  /* =====================================================
     RENDER: EDIT FORM
  ===================================================== */

  if (editingChapter && formData) {
    return (
      <section className="w-full">
        <Button
          type="button"
          variant="ghost"
          onClick={cancelEdit}
          className="-ml-2 mb-4 gap-2 text-muted-foreground hover:text-foreground"
          disabled={saving}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chapters
        </Button>

        {saveError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center gap-2 text-base">
              <PlayCircle className="h-5 w-5" />
              Edit Chapter
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="chapterTitle">
                    Chapter Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="chapterTitle"
                    name="chapterTitle"
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
                    value={formData.videoTitle}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </div>
              </div>

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
                            "h-6 w-6",
                            active ? "scale-110" : "",
                          ].join(" ")}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                      value={formData.youtubeVideoId}
                      onChange={handleYoutubeChange}
                      disabled={saving}
                    />
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
                      value={formData.mediaUrl}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>
                )}

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
                      value={formData.duration}
                      onChange={handleChange}
                      disabled={saving}
                      className="max-w-[160px]"
                    />
                  </div>
                )}

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
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>
                )}

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

              <div className="space-y-2">
                <Label>Chapter Description</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe what students will learn in this chapter..."
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="w-full sm:w-auto"
                  disabled={saving}
                >
                  Cancel
                </Button>

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
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  /* =====================================================
     RENDER: LIST
  ===================================================== */

  return (
    <section className="w-full">
      <Card className="overflow-hidden border-border/60 shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Chapters</h2>
                {!isLoading && !error && (
                  <Badge variant="secondary" className="rounded-full">
                    {chapters.length}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Manage your course chapters and lessons.
              </p>
            </div>

            <Button asChild className="w-full sm:w-auto">
              <Link href={`/my-courses/${courseId}/chapter-form`}>
                <Plus className="mr-2 h-4 w-4 shrink-0" />
                Create Chapter
              </Link>
            </Button>
          </div>

          {!isLoading && !error && chapters.length > 0 && (
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chapters..."
                className="pl-9"
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="p-4 sm:p-5">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading chapters...
              </span>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                {error.message || "Failed to load chapters."}
              </p>
            </div>
          )}

          {deleteError && (
            <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{deleteError}</p>
            </div>
          )}

          {!isLoading && !error && chapters.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
              <BookOpen className="mb-3 h-8 w-8 text-muted-foreground" />
              <h3 className="text-sm font-semibold">No chapters created yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Start building your course by creating your first chapter.
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link href={`/my-courses/${courseId}/chapter-form`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Chapter
                </Link>
              </Button>
            </div>
          )}

          {!isLoading &&
            !error &&
            chapters.length > 0 &&
            filteredChapters.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                <Search className="mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="text-sm font-semibold">No matches found</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try a different search term.
                </p>
              </div>
            )}

          {!isLoading && !error && filteredChapters.length > 0 && (
            <div className="space-y-3">
              {filteredChapters.map((chapter, index) => {
                const isDeleting = deletingId === chapter.id;
                const typeMeta =
                  CONTENT_TYPE_META[chapter.contentType] ||
                  CONTENT_TYPE_META.youtube;
                const TypeIcon = typeMeta.icon;

                return (
                  <div
                    key={chapter.id}
                    className="group relative rounded-xl border p-4 transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1 pr-16">
                        <div className="flex items-start gap-2">
                          <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">
                              {chapter.chapterTitle}
                            </h3>
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {chapter.videoTitle}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`gap-1 rounded-full ${typeMeta.className}`}
                          >
                            <TypeIcon className="h-3 w-3" />
                            {typeMeta.label}
                          </Badge>

                          {chapter.duration && (
                            <Badge
                              variant="outline"
                              className="gap-1 rounded-full text-muted-foreground"
                            >
                              <Clock className="h-3 w-3" />
                              {chapter.duration}
                            </Badge>
                          )}

                          {chapter.contentType === "youtube" &&
                            chapter.youtubeVideoId && (
                              <span className="truncate text-xs text-muted-foreground">
                                ID: {chapter.youtubeVideoId}
                              </span>
                            )}

                          {(chapter.contentType === "image" ||
                            chapter.contentType === "video") &&
                            chapter.mediaUrl && (
                              <a
                                href={chapter.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                              >
                                View source
                              </a>
                            )}
                        </div>
                      </div>

                      <div className="absolute right-4 top-4 flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          disabled={isDeleting}
                          onClick={() => startEdit(chapter)}
                          aria-label="Edit chapter"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          disabled={isDeleting}
                          onClick={() => setChapterToDelete(chapter)}
                          aria-label="Delete chapter"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <AlertDialog
        open={!!chapterToDelete}
        onOpenChange={(open) => !open && setChapterToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <AlertDialogTitle>Delete this chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              {chapterToDelete
                ? `"${chapterToDelete.chapterTitle}" will be permanently removed. This action cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
    </section>
  );
}

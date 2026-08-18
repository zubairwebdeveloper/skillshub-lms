"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile as updateAuthProfile } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  Loader2,
  User2,
  AlertCircle,
  Camera,
  X,
  Link2,
  MapPin,
  Sparkles,
} from "lucide-react";

import { db } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/useUser";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

export default function ProfileForm() {
  const router = useRouter();
  const { profile, loading: profileLoading, refresh } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onBlur",
    defaultValues: { name: "", role: "", bio: "", location: "", website: "" },
  });

  // once the profile arrives from Firestore, seed the form with it
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        role: profile.role || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
      });
    }
  }, [profile, reset]);

  const [avatarUrl, setAvatarUrl] = useState(undefined);
  const derivedAvatarUrl = avatarUrl ?? (profile?.avatarUrl || "");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);

  const fileInputRef = useRef(null);

  const watchedName = watch("name");
  const watchedRole = watch("role");
  const watchedBio = watch("bio");
  const watchedLocation = watch("location");
  const watchedWebsite = watch("website");

  const fieldsFilled = [
    watchedName,
    watchedBio,
    watchedRole,
    watchedLocation,
    watchedWebsite,
    derivedAvatarUrl,
  ].filter((v) => v && String(v).trim().length > 0).length;
  const totalFields = 6;
  const completion = Math.round((fieldsFilled / totalFields) * 100);

  const initials =
    (watchedName || "").trim().length > 0
      ? watchedName
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase())
          .join("")
      : "—";

  function handleAvatarClick() {
    if (uploading) return;
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again later
    if (!file || !profile?.uid) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);

    try {
      setUploading(true);

      const storage = getStorage();
      const path = `avatars/${profile.uid}/${Date.now()}-${file.name}`;
      const fileRef = storageRef(storage, path);

      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      setAvatarUrl(downloadUrl);
      await updateDoc(doc(db, "users", profile.uid), {
        avatarUrl: downloadUrl,
      });

      // keep Firebase Auth's user object (and anything reading it, like
      // the user dropdown) in sync with the new avatar
      const auth = getAuth();
      if (auth.currentUser) {
        await updateAuthProfile(auth.currentUser, { photoURL: downloadUrl });
        await auth.currentUser.reload();
      }

      await refresh();
      toast.success("Avatar updated.");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't upload that image. Try again.");
      setAvatarUrl(profile?.avatarUrl || "");
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploading(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!profile?.uid || removingAvatar) return;
    try {
      setRemovingAvatar(true);
      setAvatarUrl("");
      await updateDoc(doc(db, "users", profile.uid), { avatarUrl: "" });

      const auth = getAuth();
      if (auth.currentUser) {
        await updateAuthProfile(auth.currentUser, { photoURL: "" });
        await auth.currentUser.reload();
      }

      await refresh();
      toast.success("Avatar removed.");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't remove the avatar. Try again.");
      setAvatarUrl(profile?.avatarUrl || "");
    } finally {
      setRemovingAvatar(false);
    }
  }

  async function onSubmit(values) {
    if (!profile?.uid) return;

    try {
      setSaving(true);

      const name = values.name.trim();
      const role = values.role.trim();
      const bio = values.bio.trim();
      const location = values.location.trim();
      const website = values.website.trim();

      await updateDoc(doc(db, "users", profile.uid), {
        name,
        role,
        bio,
        location,
        website,
      });

      // sync Firebase Auth's displayName so the user dropdown (and anything
      // else reading auth.currentUser) reflects the new name immediately
      const auth = getAuth();
      if (auth.currentUser) {
        await updateAuthProfile(auth.currentUser, { displayName: name });
        await auth.currentUser.reload();
      }

      await refresh();

      toast.success("Profile updated.");

      reset({ name: "", role: "", bio: "", location: "", website: "" });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save your changes. Try again in a moment.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    reset({
      name: profile?.name || "",
      role: profile?.role || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      website: profile?.website || "",
    });
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] dark:bg-gray-900 rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-[#A67C3D]" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-gray-900 dark:text-white rounded-md">
        <div className="mx-auto max-w-4xl px-6 py-16">
          {/* Eyebrow + heading */}
          <div className="mb-10 flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#A67C3D] dark:text-[#ffff]">
                <Sparkles className="h-3 w-3" />
                Account
              </p>

              <h1
                className="mt-2 text-4xl font-medium tracking-tight text-black dark:text-gray-100"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Profile settings
              </h1>

              <p className="mt-2 text-[15px] text-[#8A8578] dark:text-gray-400">
                This is how you&apos;ll appear across the workspace.
              </p>
            </div>

            {completion === 100 && (
              <Badge className="mt-2 shrink-0 border-none bg-[#A67C3D]/10 text-[#A67C3D] hover:bg-[#A67C3D]/10">
                Profile complete
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
            {/* Identity card */}
            <Card className="h-fit border border-[#E7E4DC] bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={uploading}
                      className="group relative h-24 w-24 flex-shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#A67C3D] focus-visible:ring-offset-2"
                      aria-label="Change avatar"
                    >
                      <Avatar className="h-24 w-24 border-2 border-[#A67C3D]/30">
                        {derivedAvatarUrl ? (
                          <AvatarImage asChild src={derivedAvatarUrl}>
                            <Image
                              src={derivedAvatarUrl}
                              alt="Avatar"
                              width={96}
                              height={96}
                              className="h-24 w-24 object-cover"
                              unoptimized
                            />
                          </AvatarImage>
                        ) : null}
                        <AvatarFallback className="bg-black text-[#EFE9DD] dark:bg-purple-800">
                          {initials === "—" ? (
                            <User2 className="h-8 w-8 text-[#EFE9DD]/60" />
                          ) : (
                            <span
                              className="text-2xl font-medium"
                              style={{
                                fontFamily: "'Fraunces', Georgia, serif",
                              }}
                            >
                              {initials}
                            </span>
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-opacity ${
                          uploading
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {uploading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : (
                          <Camera className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Click to change your avatar</TooltipContent>
                </Tooltip>

                {derivedAvatarUrl && !uploading && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={removingAvatar}
                    className="-mt-2 flex items-center gap-1 text-[11px] text-[#8A8578] hover:text-red-600 disabled:opacity-50 dark:text-gray-400"
                  >
                    {removingAvatar ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    Remove photo
                  </button>
                )}

                <div>
                  <p className="text-[15px] font-medium text-black dark:text-white">
                    {watchedName || "Unnamed"}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#6B6656] dark:text-gray-400">
                    {watchedRole || "No role yet"}
                  </p>
                  {watchedLocation && (
                    <p className="mt-1 flex items-center justify-center gap-1 text-[12px] text-[#8A8578] dark:text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {watchedLocation}
                    </p>
                  )}
                </div>

                <Separator className="bg-[#E7E4DC] dark:bg-gray-700" />

                {/* Completion meter — signature element */}
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black dark:text-white">
                      Profile
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-[#6B6656] dark:text-gray-400">
                      {fieldsFilled}/{totalFields}
                    </span>
                  </div>
                  <Progress
                    value={completion}
                    className="mt-1.5 h-1 bg-[#E7E4DC] [&>div]:bg-[#A67C3D] dark:bg-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <Card className="border border-[#E7E4DC] bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="pb-0">
                <CardTitle className="text-[16px] font-semibold text-black dark:text-white">
                  Personal details
                </CardTitle>
                <CardDescription className="text-[13px] text-[#8A8578] dark:text-gray-400">
                  Keep this current, it&apos;s visible to your teammates.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-[13px] font-semibold text-black dark:text-white"
                      >
                        Full name
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        aria-invalid={!!errors.name}
                        className="h-11 border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        {...register("name", {
                          required: "Name is required.",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters.",
                          },
                          maxLength: {
                            value: 50,
                            message: "Name must be under 50 characters.",
                          },
                        })}
                      />
                      {errors.name && (
                        <p className="flex items-center gap-1 text-[12px] text-red-600">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="role"
                        className="text-[13px] font-semibold text-black dark:text-white"
                      >
                        Role
                      </Label>
                      <Input
                        id="role"
                        placeholder="Frontend Developer"
                        aria-invalid={!!errors.role}
                        className="h-11 border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        {...register("role", {
                          minLength: {
                            value: 2,
                            message: "Role must be at least 2 characters.",
                          },
                          maxLength: {
                            value: 60,
                            message: "Role must be under 60 characters.",
                          },
                        })}
                      />
                      {errors.role && (
                        <p className="flex items-center gap-1 text-[12px] text-red-600">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-[13px] font-semibold text-black dark:text-white"
                    >
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      placeholder="A short line about you"
                      aria-invalid={!!errors.bio}
                      className="resize-none border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      {...register("bio", {
                        maxLength: {
                          value: 160,
                          message: "Bio must be under 160 characters.",
                        },
                      })}
                    />
                    <div className="flex items-center justify-between">
                      {errors.bio ? (
                        <p className="flex items-center gap-1 text-[12px] text-red-600">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.bio.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="text-[11px] tabular-nums text-[#8A8578] dark:text-gray-500">
                        {(watchedBio || "").length}/160
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="flex items-center gap-1.5 text-[13px] font-semibold text-black dark:text-white"
                      >
                        <MapPin className="h-3.5 w-3.5 text-[#A67C3D]" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="Islamabad, PK"
                        aria-invalid={!!errors.location}
                        className="h-11 border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        {...register("location", {
                          maxLength: {
                            value: 60,
                            message: "Location must be under 60 characters.",
                          },
                        })}
                      />
                      {errors.location && (
                        <p className="flex items-center gap-1 text-[12px] text-red-600">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="flex items-center gap-1.5 text-[13px] font-semibold text-black dark:text-white"
                      >
                        <Link2 className="h-3.5 w-3.5 text-[#A67C3D]" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        placeholder="https://yoursite.com"
                        aria-invalid={!!errors.website}
                        className="h-11 border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        {...register("website", {
                          pattern: {
                            value: /^(https?:\/\/)[^\s]+\.[^\s]+$/i,
                            message: "Enter a valid URL, e.g. https://site.com",
                          },
                        })}
                      />
                      {errors.website && (
                        <p className="flex items-center gap-1 text-[12px] text-red-600">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-[#E7E4DC] pt-6 dark:border-gray-700">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={saving || !isDirty}
                      className="h-10 text-[14px] font-medium text-[#6B6656] hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving || !isDirty}
                      className="h-10 min-w-[130px] bg-black text-[14px] font-medium text-white hover:bg-black/90 dark:bg-purple-800 dark:text-white"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

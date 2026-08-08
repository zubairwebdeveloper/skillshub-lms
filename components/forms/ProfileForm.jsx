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
import { Loader2, User2, AlertCircle, Camera } from "lucide-react";

import { db } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/useUser";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    defaultValues: { name: "", role: "", bio: "" },
  });

  // once the profile arrives from Firestore, seed the form with it
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        role: profile.role || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  const [avatarUrl, setAvatarUrl] = useState(undefined);
  const derivedAvatarUrl = avatarUrl ?? (profile?.avatarUrl || "");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const watchedName = watch("name");
  const watchedRole = watch("role");
  const watchedBio = watch("bio");

  const fieldsFilled = [
    watchedName,
    watchedBio,
    watchedRole,
    derivedAvatarUrl,
  ].filter((v) => v && v.trim().length > 0).length;
  const completion = Math.round((fieldsFilled / 4) * 100);

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

  async function onSubmit(values) {
    if (!profile?.uid) return;

    try {
      setSaving(true);

      const name = values.name.trim();
      const role = values.role.trim();
      const bio = values.bio.trim();

      await updateDoc(doc(db, "users", profile.uid), { name, role, bio });

      // sync Firebase Auth's displayName so the user dropdown (and anything
      // else reading auth.currentUser) reflects the new name immediately
      const auth = getAuth();
      if (auth.currentUser) {
        await updateAuthProfile(auth.currentUser, { displayName: name });
        await auth.currentUser.reload();
      }

      await refresh();

      toast.success("Profile updated.");

      reset({ name: "", role: "", bio: "" });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save your changes. Try again in a moment.");
    } finally {
      setSaving(false);
    }
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#A67C3D]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] rounded-md">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Eyebrow + heading */}
        <div className="mb-10">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#A67C3D]">
            Account
          </p>
          <h1
            className="mt-2 text-4xl font-medium tracking-tight text-black"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Profile settings
          </h1>
          <p className="mt-2 text-[15px] text-[#8A8578]">
            This is how you&apos;ll appear across the workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          {/* Identity card */}
          <Card className="h-fit border border-[#E7E4DC] bg-white shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploading}
                className="group relative h-24 w-24 flex-shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#A67C3D] focus-visible:ring-offset-2"
                aria-label="Change avatar"
              >
                {derivedAvatarUrl ? (
                  <Image
                    src={derivedAvatarUrl}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full border-2 border-[#A67C3D]/30 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#A67C3D]/30 bg-black">
                    <span
                      className="text-2xl font-medium text-[#EFE9DD]"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {initials === "—" ? (
                        <User2 className="h-8 w-8 text-[#EFE9DD]/60" />
                      ) : (
                        initials
                      )}
                    </span>
                  </div>
                )}

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

              <div>
                <p className="text-[15px] font-medium text-black">
                  {watchedName || "Unnamed"}
                </p>
                <p className="mt-0.5 text-[13px] text-[#6B6656]">
                  {watchedRole || "No role yet"}
                </p>
              </div>

              {/* Completion meter — signature element */}
              <div className="w-full pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black">
                    Profile
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-[#6B6656]">
                    {fieldsFilled}/4
                  </span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#E7E4DC]">
                  <div
                    className="h-full rounded-full bg-[#A67C3D] transition-all duration-500 ease-out"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="border border-[#E7E4DC] bg-white shadow-sm">
            <CardContent className="p-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[13px] font-semibold text-black"
                  >
                    Full name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    className="h-11 border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20"
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
                    className="text-[13px] font-semibold text-black"
                  >
                    Role
                  </Label>
                  <Input
                    id="role"
                    placeholder="Frontend Developer"
                    aria-invalid={!!errors.role}
                    className="h-11 border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20"
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

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-[13px] font-semibold text-black"
                  >
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    placeholder="A short line about you"
                    aria-invalid={!!errors.bio}
                    className="h-11 border-[#E7E4DC] bg-[#FAFAF8] text-[15px] text-[#4B4737] placeholder:text-[#B5B1A6] focus-visible:border-[#A67C3D] focus-visible:ring-[#A67C3D]/20"
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
                    <span className="text-[11px] tabular-nums text-[#8A8578]">
                      {(watchedBio || "").length}/160
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#E7E4DC] pt-6">
                  <Button
                    type="submit"
                    disabled={saving || !isDirty}
                    className="h-10 min-w-[130px] bg-black text-[14px] font-medium text-white hover:bg-black/90"
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
  );
}

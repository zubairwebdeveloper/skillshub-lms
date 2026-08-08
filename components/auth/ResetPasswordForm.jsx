"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

import { auth } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Convert Firebase Auth errors into user-friendly messages
function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/expired-action-code":
      return "⌛ This reset link has expired. Please request a new one.";

    case "auth/invalid-action-code":
      return "🔗 This reset link is invalid or has already been used.";

    case "auth/user-disabled":
      return "🚫 This account has been disabled.";

    case "auth/user-not-found":
      return "👤 No account was found for this reset link.";

    case "auth/weak-password":
      return "🛡️ Your password is too weak. Please choose a stronger one.";

    case "auth/network-request-failed":
      return "🌐 Network connection lost. Please check your internet and try again.";

    default:
      return "⚠️ Something went wrong. Please try again.";
  }
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const oobCode = searchParams.get("oobCode");

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    setServerError("");

    if (!oobCode) {
      setServerError("🔗 Invalid or expired reset link.");
      return;
    }

    try {
      // Yeh code confirm karta hai ke link (oobCode) valid hai
      await verifyPasswordResetCode(auth, oobCode);

      // Naya password set karta hai
      await confirmPasswordReset(auth, oobCode, values.password);

      setSuccess(true);

      // 2 second baad login page pe le jayega
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setServerError(getAuthErrorMessage(error));
    }
  }

  // Agar link mein oobCode hi nahi hai (direct URL open kiya)
  if (!oobCode) {
    return (
      <Card className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <CardContent className="px-8 py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-200 bg-red-100 dark:border-red-900 dark:bg-red-950/30">
            <span className="text-4xl">🔗</span>
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Invalid Reset Link
          </h2>

          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            🔴 This password reset link is missing or invalid. Please request a
            new one from the forgot password page.
          </p>

          <Link
            href="/forgot-password"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Request New Link
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Password successfully reset ho gaya
  if (success) {
    return (
      <Card className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <CardContent className="px-8 py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-100 dark:border-green-800 dark:bg-green-900/30">
            <span className="text-4xl">✅</span>
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Password Updated!
          </h2>

          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            Your password has been changed successfully. Redirecting you to
            login...
          </p>

          <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <CardHeader className="space-y-4 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl text-white dark:bg-white dark:text-slate-900">
            🔑
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create a New Password
            </CardTitle>

            <CardDescription className="leading-6 text-slate-600 dark:text-slate-400">
              Protect your
              <span className="font-semibold text-slate-900 dark:text-white">
                {" "}
                SkillsHub LMS
              </span>{" "}
              account by creating a strong and secure password. Once updated,
              you&apos;ll be able to continue your learning journey.
            </CardDescription>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              🔒 Secure Account
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              ⚡ Fast Recovery
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              🎓 Continue Learning
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Server-side error (Firebase) */}
            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {serverError}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label>New Password</Label>

              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    errors.password ? "text-red-500" : "text-slate-400"
                  }`}
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className={`h-11 rounded-xl pl-10 pr-10 focus-visible:ring-1 ${
                    errors.password
                      ? "border-red-500 text-red-600 placeholder:text-red-300 focus-visible:ring-red-500"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="flex items-center gap-1 text-sm font-medium text-red-500">
                  🔴 {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>

              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    errors.confirmPassword ? "text-red-500" : "text-slate-400"
                  }`}
                />

                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className={`h-11 rounded-xl pl-10 pr-10 focus-visible:ring-1 ${
                    errors.confirmPassword
                      ? "border-red-500 text-red-600 placeholder:text-red-300 focus-visible:ring-red-500"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="flex items-center gap-1 text-sm font-medium text-red-500">
                  🔴 {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Reset Button */}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>

            {/* Back */}
            <div className="text-center pt-1">
              <Link
                href="/login"
                className="font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

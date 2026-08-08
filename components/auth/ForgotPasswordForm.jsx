"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";

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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Convert Firebase Auth errors into user-friendly messages
function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "📧 Please enter a valid email address.";

    case "auth/user-not-found":
      return "👤 No account was found with this email address.";

    case "auth/too-many-requests":
      return "⏳ Too many attempts. Please try again in a few minutes.";

    case "auth/network-request-failed":
      return "🌐 Network connection lost. Please check your internet and try again.";

    default:
      return "⚠️ Something went wrong. Please try again.";
  }
}

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    setServerError("");

    try {
      // Yeh batata hai Firebase ko ke reset link hamare APP ke
      // /reset-password page pe khulna chahiye, Firebase ke default
      // page pe nahi. oobCode automatically isi URL mein add ho jayega.
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, values.email, actionCodeSettings);
      setSent(true);
    } catch (error) {
      setServerError(getAuthErrorMessage(error));
    }
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <CardContent className="px-8 py-10 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-100 dark:border-green-800 dark:bg-green-900/30">
            <span className="text-4xl">✅</span>
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Check Your Email
          </h2>

          {/* Description */}
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            We&apos;ve sent a secure password reset link to your registered
            email address.
            <br />
            Follow the instructions in the email to reset your password and
            continue learning on{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              SkillsHub LMS
            </span>
            .
          </p>

          {/* Info Box */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            💡 If you don&apos;t see the email within a few minutes, please
            check your
            <span className="font-semibold"> Spam</span> or
            <span className="font-semibold"> Junk</span> folder.
          </div>

          {/* Back Button */}
          <Link
            href="/login"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>

          {/* Footer */}
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            Secure access powered by{" "}
            <span className="font-semibold">SkillsHub LMS</span>.
          </p>
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
            🔐
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reset Your Password
            </CardTitle>

            <CardDescription className="leading-6 text-slate-600 dark:text-slate-400">
              Enter your registered email address to receive a secure password
              reset link and continue your learning journey on
              <span className="font-semibold text-slate-900 dark:text-white">
                {" "}
                SkillsHub LMS
              </span>
              .
            </CardDescription>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              🔒 Secure Reset
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              ⚡ Fast Recovery
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              🎓 Continue Learning
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Server-side error (Firebase) */}
            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label>Email Address</Label>

              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    errors.email ? "text-red-500" : "text-slate-400"
                  }`}
                />

                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  className={`h-11 rounded-xl pl-10 focus-visible:ring-1 ${
                    errors.email
                      ? "border-red-500 text-red-600 placeholder:text-red-300 focus-visible:ring-red-500"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="flex items-center gap-1 text-sm font-medium text-red-500">
                  🔴 {errors.email.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                "Send Password Reset Link"
              )}
            </Button>

            {/* Links */}
            <div className="flex items-center justify-between text-sm pt-1">
              <Link
                href="/login"
                className="font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                ← Back to Login
              </Link>

              <Link
                href="/register"
                className="font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Create Account →
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

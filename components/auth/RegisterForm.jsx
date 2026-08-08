"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

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

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
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
    case "auth/invalid-email":
      return "📧 Please enter a valid email address.";

    case "auth/email-already-in-use":
      return "📩 This email address is already registered.";

    case "auth/weak-password":
      return "🛡️ Your password is too weak. Please choose a stronger one.";

    case "auth/too-many-requests":
      return "⏳ Too many attempts. Please try again in a few minutes.";

    case "auth/network-request-failed":
      return "🌐 Network connection lost. Please check your internet and try again.";

    case "auth/popup-closed-by-user":
      return "❌ Sign-up was cancelled before completion.";

    case "auth/popup-blocked":
      return "🚫 Your browser blocked the sign-up popup. Please allow popups and try again.";

    case "auth/account-exists-with-different-credential":
      return "🔑 An account already exists with a different sign-in method.";

    default:
      return "⚠️ Something went wrong. Please try again.";
  }
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

 async function onSubmit(values) {
   setServerError("");

   try {
     // Create Firebase Auth User
     const credential = await createUserWithEmailAndPassword(
       auth,
       values.email,
       values.password,
     );

     // Update Auth Profile
     await updateProfile(credential.user, {
       displayName: values.name,
     });

     // Save User in Firestore
     await setDoc(doc(db, "users", credential.user.uid), {
       uid: credential.user.uid,
       name: values.name,
       email: credential.user.email,
       photoURL: credential.user.photoURL || "",
       provider: "password",
       role: "student",
       emailVerified: credential.user.emailVerified,
       createdAt: serverTimestamp(),
       updatedAt: serverTimestamp(),
     });

     router.replace("/");
   } catch (error) {
     setServerError(getAuthErrorMessage(error));
   }
 }

 async function handleGoogleSignup() {
   setServerError("");
   setGoogleLoading(true);

   try {
     const provider = new GoogleAuthProvider();

     const result = await signInWithPopup(auth, provider);

     await setDoc(
       doc(db, "users", result.user.uid),
       {
         uid: result.user.uid,
         name: result.user.displayName,
         email: result.user.email,
         photoURL: result.user.photoURL,
         provider: "google",
         role: "student",
         emailVerified: result.user.emailVerified,
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp(),
       },
       { merge: true },
     );

     router.replace("/");
   } catch (error) {
     setServerError(getAuthErrorMessage(error));
   } finally {
     setGoogleLoading(false);
   }
 }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14  items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white dark:bg-white dark:text-slate-900">
            🎓
          </div>

          <CardTitle className="text-3xl font-bold tracking-tight">
            Join SkillsHub LMS
          </CardTitle>

          <CardDescription className="text-sm leading-6">
            Create your account to access premium courses, track your learning
            progress, earn certificates, and grow your development skills.
          </CardDescription>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border px-3 py-1 text-xs">
              📚 Premium Courses
            </span>

            <span className="rounded-full border px-3 py-1 text-xs">
              🏆 Certificates
            </span>

            <span className="rounded-full border px-3 py-1 text-xs">
              🚀 Learn by Projects
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Server-side error (Firebase) */}
            {serverError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Name */}

            <div className="space-y-2">
              <Label>Full Name</Label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="John Doe"
                  className="pl-10"
                  {...register("name")}
                />
              </div>

              {errors.name && (
                <p className="flex items-center gap-1 pt-2 text-sm font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}

            <div className="space-y-2">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="flex items-center gap-1 pt-2 text-sm font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}

            <div className="space-y-2">
              <Label>Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="pl-10 pr-10"
                  {...register("password")}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="flex items-center gap-1 pt-2 text-sm font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Confirm Password */}

            <div className="space-y-2">
              <Label>Confirm Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="********"
                  className="pl-10 pr-10"
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="flex items-center gap-1 pt-2 text-sm font-medium text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Register Button */}

            <Button
              className="h-11 w-full rounded-xl font-semibold transition-all hover:scale-[1.02]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Your Learning Account...
                </>
              ) : (
                <>
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Divider */}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google */}

            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="h-11 w-full rounded-xl border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {googleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  className="mr-2"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4C12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.7-.4-4z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4C16.3 4 9.7 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.6 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20H42V20H24v8h11.3c-1.1 3-3.2 5.3-6 6.8l.1-.1l6.3 5.3C35.2 39.5 44 33 44 24c0-1.3-.1-2.7-.4-4z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Login */}

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Already enrolled?{" "}
              <Link
                href="/login"
                className="ml-1 font-semibold text-slate-900 transition hover:underline dark:text-white"
              >
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

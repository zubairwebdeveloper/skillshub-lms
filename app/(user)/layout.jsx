"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, LogIn } from "lucide-react";

import AuthProvider, { AuthContext } from "@/context/AuthProvider";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <CheckUser>{children}</CheckUser>
    </AuthProvider>
  );
}

function CheckUser({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Authentication checking
  if (loading) {
    return (
      <AuthLoading
        icon={<ShieldCheck className="size-5" />}
        title="Checking authentication"
        description="Please wait while we securely verify your account."
        badge="SECURE AUTH"
      />
    );
  }

  // User is not authenticated
  if (!user) {
    return (
      <AuthLoading
        icon={<LogIn className="size-5" />}
        title="Redirecting to login"
        description="You need to be signed in to access this page."
        badge="AUTHENTICATION REQUIRED"
      />
    );
  }

  // User is authenticated
  return children;
}

function AuthLoading({ icon, title, description, badge }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute left-10 top-10 size-32 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute bottom-10 right-10 size-40 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md overflow-hidden border-border/60 bg-background/80 shadow-2xl shadow-primary/5 backdrop-blur-xl">
        {/* Top gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        <CardContent className="flex flex-col items-center px-8 py-10 text-center">
          {/* Icon */}
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border bg-muted/50 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
          </div>

          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest"
          >
            <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-primary" />
            {badge}
          </Badge>

          {/* Title */}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

          {/* Description */}
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          {/* Loader */}
          <div className="mt-7 flex items-center gap-2 rounded-full border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span>Please wait...</span>
          </div>

          {/* Security text */}
          <p className="mt-6 text-[11px] text-muted-foreground/70">
            Your authentication is securely handled by Firebase.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

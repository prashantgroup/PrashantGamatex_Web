"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { isTokenValid } from "@/lib/jwt";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, clearUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status and redirect accordingly
    if (!user || !user.token) {
      // No user or token, redirect to login
      router.replace("/login");
      return;
    }

    if (!isTokenValid(user.token)) {
      // Token is expired, clear user data and redirect to login
      clearUser();
      router.replace("/login");
      return;
    }

    // User is authenticated, redirect to dashboard
    router.replace("/dashboard");
  }, [user, clearUser, router]);

  // Show loading while determining where to redirect
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-muted-foreground">
          Loading...
        </span>
      </div>
    </div>
  );
}

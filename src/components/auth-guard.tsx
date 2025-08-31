"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { isTokenValid } from "@/lib/jwt";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component that protects routes by checking JWT token validity
 * Redirects to login if token is invalid or expired
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { user, clearUser } = useUserStore();
  const router = useRouter();

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasHydrated(true);
    }, 100); // Small delay to allow hydration
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const checkAuth = () => {
      // Check if user exists and has a token
      if (!user || !user.token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace("/login");
        return;
      }
      
      // Check if token is valid (not expired)
      if (!isTokenValid(user.token)) {
        // Token is expired, clear user data and redirect to login
        clearUser();
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      // Token is valid
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [user, clearUser, router, hasHydrated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-muted-foreground">
              Verifying authentication...
            </span>
          </div>
        </div>
      )
    );
  }

  // If not authenticated, don't render children (redirect is handled above)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

/**
 * Hook to check authentication status
 */
export function useAuthGuard() {
  const { user, clearUser } = useUserStore();
  const router = useRouter();

  const checkAuth = () => {
    if (!user || !user.token) {
      return false;
    }

    if (!isTokenValid(user.token)) {
      clearUser();
      router.replace("/login");
      return false;
    }

    return true;
  };

  return {
    isAuthenticated: checkAuth(),
    user,
    clearUser,
  };
}

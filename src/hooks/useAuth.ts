"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, login } from "@/services/auth";
import { useUserStore } from "@/store/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthResponse, LoginData, ChangePasswordData } from "@/types/auth";
import { ErrorResponse } from "@/types/query";
import { toast } from "sonner";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<AuthResponse, ErrorResponse, LoginData>({
    mutationFn: (data: LoginData) => {
      return login(data);
    },
    onSuccess: (data) => {
      setUser({
        data: {
          uid: data.payload.uid,
          username: data.payload.username,
          name: data.payload.name,
          company: data.payload.company,
        },
        token: data.token,
      });
      router.push("/dashboard");
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};

export const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  const clearToken = useUserStore((state) => state.clearToken);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    clearUser();
    clearToken();
    queryClient.invalidateQueries({
      queryKey: ["auth"],
    });
    router.push("/login");
  };

  return logout;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.token) {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return { isAuthenticated, user };
};

export const useChangePassword = () => {
  const logout = useLogout();
  const user = useUserStore((state) => state.user);

  return useMutation<unknown, ErrorResponse, ChangePasswordData>({
    mutationFn: (data: ChangePasswordData) => changePassword(data, user?.token || ""),
    onSuccess: () => {
      toast.success("Password changed successfully");
      logout();
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
}; 
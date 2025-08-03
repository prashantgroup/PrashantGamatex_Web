import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginService, logout as logoutService } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { LoginData, AuthResponse, ErrorResponse } from "@/types/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthResponse, ErrorResponse, LoginData>({
    mutationFn: loginService,
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
      
      // Store token in localStorage for API requests
      localStorage.setItem("auth-token", data.token);
      
      router.push("/dashboard");
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      logout();
      localStorage.removeItem("auth-token");
      router.push("/login");
      queryClient.clear();
    },
    onError: (error) => {
      // Even if logout API fails, clear local state
      logout();
      localStorage.removeItem("auth-token");
      router.push("/login");
      queryClient.clear();
      console.error("Logout error:", error);
    },
  });
}; 
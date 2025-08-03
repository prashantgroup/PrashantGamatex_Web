import api from "@/lib/api";
import { AuthResponse, LoginData, ErrorResponse } from "@/types/auth";

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const user = {
      username: data.username,
      password: data.password,
      company: data.company,
      DeviceName: data.DeviceName,
    };
    
    const response = await api.post("/auth/login", { user });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw { errorMessage: axiosError.response.data.error } as ErrorResponse;
    } else {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      throw { errorMessage } as ErrorResponse;
    }
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    // Handle logout error silently or log it
    console.error("Logout error:", error);
  }
}; 
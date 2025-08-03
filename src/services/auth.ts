import client from "@/lib/api";
import { AuthResponse, ChangePasswordData, LoginData } from "@/types/auth";
import { ErrorResponse } from "@/types/query";

const handleError = (error: unknown): never => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { data: { error: string } } };
    throw { errorMessage: axiosError.response.data.error } as ErrorResponse;
  } else {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    throw { errorMessage } as ErrorResponse;
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const user = {
      username: data.username,
      password: data.password,
      company: data.company,
      deviceName: data.DeviceName,
    };
    
    console.log("login: ", user);
    
    const response = await client.post("/auth/login", {
      user,
    });
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const changePassword = async (data: ChangePasswordData, token: string): Promise<unknown> => {
  try {
    const response = await client.patch("/user/password", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
} 
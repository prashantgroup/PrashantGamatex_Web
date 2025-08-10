 import client from "@/lib/api";
import { ExpenseObject } from "@/types/expense";
import { ErrorResponse } from "@/types/query";

export const getAllExpenses = async (token: string): Promise<ExpenseObject[]> => {
  try {
    const response = await client.get("/user/expense/get", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw { errorMessage: axiosError.response.data.error } as ErrorResponse;
    } else {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      throw { errorMessage } as ErrorResponse;
    }
  }
};

export const insertExpense = async (data: FormData, token: string): Promise<unknown> => {
  try {
    const response = await client.post("/user/expense/insert", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
      transformRequest: (data) => {
        return data;
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw { errorMessage: axiosError.response.data.error } as ErrorResponse;
    } else {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      throw { errorMessage } as ErrorResponse;
    }
  }
}; 
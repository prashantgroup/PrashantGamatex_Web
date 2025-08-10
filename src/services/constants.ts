import client from "@/lib/api";
import { ErrorResponse } from "@/types/query";

export type ConstData = {
  CurrencyOutput: string;
  ProductOutput: string;
  LeadSourceOutput: string;
  TimeFrameOutput: string;
  ApplicationOutput: string;
  ExpenseOutput: string;
};

export const getConstants = async (
  token: string | undefined
): Promise<ConstData> => {
  try {
    const response = await client.get("/const/get", {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data[0] as ConstData;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response: { data: { error: string } } };
      throw { errorMessage: axiosError.response.data.error } as ErrorResponse;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw { errorMessage } as ErrorResponse;
    }
  }
};

import client from "@/lib/api";
import { SalesFollowupInsert, SalesInquiryFollowup } from "@/types/followup";
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

export const getInquiryFollowups = async (token: string): Promise<SalesInquiryFollowup[]> => {
  try {
    const response = await client.get("/user/followup/inquiry/get", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const getQuotationFollowups = async (token: string): Promise<SalesInquiryFollowup[]> => {
  try {
    const response = await client.get("/user/followup/quotation/get", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const insertInquiryFollowup = async (data: SalesFollowupInsert, token: string): Promise<void> => {
  try {
    await client.post("/user/followup/inquiry/insert", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } catch (error: unknown) {
    handleError(error);
  }
};

export const insertQuotationFollowup = async (data: SalesFollowupInsert, token: string): Promise<void> => {
  try {
    await client.post("/user/followup/quotation/insert", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } catch (error: unknown) {
    handleError(error);
  }
};

export const getDocumentNo = async (
  token: string | undefined,
  categoryName: string
): Promise<unknown> => {
  try {
    const response = await client.get("/const/get/documentno/followup", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        CategoryName: categoryName,
      },
    });
    return response.data[0];
  } catch (error: unknown) {
    handleError(error);
  }
};

export const getCategories = async (token: string | undefined): Promise<unknown> => {
  try {
    const response = await client.get("/const/get/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const getFollowupList = async (
  SalesInquiryId: number,
  SalesQuotationId: number,
  type: string,
  token: string
): Promise<unknown> => {
  try {
    const response = await client.get("/user/followup/list", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      params: {
        SalesInquiryId,
        SalesQuotationId,
        type,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const getImage = async (image: string, token: string): Promise<unknown> => {
  try {
    const response = await client.get(`/user/followup/image/${image}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const getFollowupFilters = async (
  token: string | undefined
): Promise<unknown> => {
  try {
    const response = await client.get("/const/followup/associatedusers", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
}; 
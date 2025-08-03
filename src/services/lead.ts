import client from "@/lib/api";
import { ErrorResponse } from "@/types/query";
import { LeadInsertData, LeadData, LeadUpdateData } from "@/types/lead";

const handleError = (error: unknown): never => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { data: { error: string } } };
    throw { errorMessage: axiosError.response.data.error } as ErrorResponse;
  } else {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    throw { errorMessage } as ErrorResponse;
  }
};

export const getAllLeads = async (token: string): Promise<LeadData[]> => {
  try {
    const response = await client.get("/user/lead/get", {
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

export const insertLead = async (
  data: LeadInsertData & FormData,
  token: string
): Promise<unknown> => {
  try {
    const response = await client.post("/user/lead/insert", data, {
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
    handleError(error);
  }
};

export const updateLead = async (data: LeadUpdateData, token: string): Promise<unknown> => {
  try {
    const response = await client.patch("/user/lead/update", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const getDocumentNo = async (
  token: string | undefined,
  categoryName: string
): Promise<unknown> => {
  try {
    const response = await client.get("/const/get/documentno/lead", {
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

export const getLeadFilters = async (
  token: string | undefined
): Promise<unknown> => {
  try {
    const response = await client.get("/const/lead/associatedusers", {
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

export const getLeadUpdates = async (leadId: number, token: string): Promise<unknown> => {
  try {
    const response = await client.get(`/user/lead/updates/${leadId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const insertLeadUpdate = async (data: unknown, token: string): Promise<unknown> => {
  try {
    const response = await client.post("/user/lead/updates/insert", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const updateLeadUpdate = async (data: unknown, token: string): Promise<unknown> => {
  try {
    const response = await client.patch("/lead/update", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
}; 
import client from "@/lib/api";
import { ErrorResponse } from "@/types/query";

export const getCalendar = async (token: string | undefined): Promise<any> => {
  try {
    const response = await client.get("/user/calendar/dates", {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};

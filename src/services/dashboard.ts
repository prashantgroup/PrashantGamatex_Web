 import client from "@/lib/api";
import { Timeframe } from "@/types/dashboard";
import { ErrorResponse } from "@/types/query";

 export const getDashboard = async (
   token: string | undefined,
   timeframe: Timeframe
 ): Promise<any> => {
   try {
     const response = await client.get("/user/dashboard/get", {
       headers: {
         Authorization: token ? `Bearer ${token}` : undefined,
       },
       params: {
         timeframe: timeframe.value,
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

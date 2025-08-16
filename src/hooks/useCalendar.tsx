import { useQuery } from "@tanstack/react-query";
import { getCalendar } from "./../services/calendar";
import { useUserStore } from "@/store/store";
import { UserStore } from "@/store/store";
import { ErrorResponse } from "@/types/query";

export const useCalendar = () => {
  const token = useUserStore((state: UserStore) => state.user?.token);
  return useQuery<any, ErrorResponse, any>({
    queryKey: ["getCalendar"],
    queryFn: () => getCalendar(token),
    enabled: !!token,
  });
};

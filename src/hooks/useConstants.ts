"use client";
import { useQuery } from "@tanstack/react-query";
import { getConstants, ConstData } from "@/services/constants";
import { useUserStore } from "@/store/store";
import { ErrorResponse } from "@/types/query";

export const useConstants = () => {
  const token = useUserStore((state) => state.user?.token);

  return useQuery<ConstData, ErrorResponse>({
    queryKey: ["getConstants"],
    queryFn: () => getConstants(token),
    enabled: !!token,
  });
};

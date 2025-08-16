"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getCategories,
  getDocumentNo,
  getFollowupFilters,
  getInquiryFollowups,
  getQuotationFollowups,
  insertInquiryFollowup,
  insertQuotationFollowup,
} from "@/services/followup";
import { useUserStore } from "@/store/store";
import {
  SalesFollowupInsert,
  SalesInquiryFollowup,
  SalesQuotationFollowup,
} from "@/types/followup";
import { ErrorResponse } from "@/types/query";

export const useInquiryFollowup = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<SalesInquiryFollowup[], ErrorResponse>({
    queryKey: ["getInquiryFollowups"],
    queryFn: () => getInquiryFollowups(user?.token || ""),
    enabled: !!user?.token,
  });
};

export const useQuotationFollowup = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<SalesQuotationFollowup[], ErrorResponse>({
    queryKey: ["getQuotationFollowups"],
    queryFn: () => getQuotationFollowups(user?.token || ""),
    enabled: !!user?.token,
  });
};

export const useInsertInquiryFollowup = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  
  return useMutation<unknown, ErrorResponse, SalesFollowupInsert>({
    mutationFn: (data) => insertInquiryFollowup(data, user?.token || ""),
    mutationKey: ["insertInquiryFollowup"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.every((key) =>
            [
              "getQuotationFollowups",
              "getInquiryFollowups",
              "getDashboard",
              "getCalendar",
            ].includes(key as string)
          ),
      });
      toast.success("Followup Added Successfully");
      router.push("/followups");
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};

export const useInsertQuotationFollowup = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  
  return useMutation<unknown, ErrorResponse, SalesFollowupInsert>({
    mutationFn: (data) => insertQuotationFollowup(data, user?.token || ""),
    mutationKey: ["insertQuotationFollowup"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.every((key) =>
            ["getQuotationFollowups", "getDashboard", "getCalendar"].includes(key as string)
          ),
      });
      toast.success("Followup Added Successfully");
      router.push("/followups");
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};

export const useCategoryList = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<unknown, ErrorResponse>({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(user?.token),
    enabled: !!user?.token,
  });
};

export const useDocumentNo = (categoryName: string) => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<unknown, ErrorResponse>({
    queryKey: ["getFollowupDocumentNo", categoryName],
    queryFn: () => getDocumentNo(user?.token, categoryName),
    enabled: !!user?.token && !!categoryName,
  });
};

export const useFollowupFilters = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<unknown, ErrorResponse>({
    queryKey: ["getFollowupFilters"],
    queryFn: () => getFollowupFilters(user?.token),
    enabled: !!user?.token,
  });
}; 
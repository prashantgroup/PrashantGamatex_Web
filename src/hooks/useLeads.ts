"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllLeads,
  getDocumentNo,
  getLeadFilters,
  insertLead,
  updateLead,
  getLeadUpdates,
  insertLeadUpdate,
  updateLeadUpdate,
} from "@/services/lead";
import { ErrorResponse } from "@/types/query";
import { toast } from "sonner";
import { LeadInsertData, LeadData, LeadUpdateData, LeadUpdate, LeadUpdateInsert } from "@/types/lead";
import { useUserStore } from "@/store/store";
import { useRouter } from "next/navigation";

export const useLeads = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<LeadData[], ErrorResponse>({
    queryKey: ["getAllLeads"],
    queryFn: () => getAllLeads(user?.token || ""),
    enabled: !!user?.token,
  });
};

export const useInsertLead = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  
  return useMutation<unknown, ErrorResponse, LeadInsertData & FormData>({
    mutationFn: (data) => insertLead(data, user?.token || ""),
    mutationKey: ["insertLead"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.every((key) =>
            [
              "getAllLeads",
              "getLeadDocumentNo",
              "getDashboard",
              "getCalendar",
            ].includes(key as string)
          ),
      }); 
      toast.success("Lead Added Successfully");
      router.push("/leads");
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  
  return useMutation<
    unknown,
    ErrorResponse,
    LeadUpdateData & {
      RecordId: number;
      category: string;
    }
  >({
    mutationFn: (data) => updateLead(data, user?.token || ""),
    mutationKey: ["updateLead"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllLeads", "getDashboard", "getCalendar"],
      });
      toast.success("Lead Updated Successfully");
      router.push("/leads");
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};

export const useDocumentNo = (categoryName: string) => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<unknown, ErrorResponse>({
    queryKey: ["getLeadDocumentNo", categoryName],
    queryFn: () => getDocumentNo(user?.token, categoryName),
    enabled: !!user?.token && !!categoryName,
  });
};

export const useLeadFilters = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<unknown, ErrorResponse>({
    queryKey: ["getLeadFilters"],
    queryFn: () => getLeadFilters(user?.token),
    enabled: !!user?.token,
  });
};

export const useLeadUpdates = (leadId: number) => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<unknown, ErrorResponse>({
    queryKey: ["getLeadUpdates", leadId],
    queryFn: () => getLeadUpdates(leadId, user?.token || ""),
    enabled: !!user?.token && !!leadId,
  });
};

export const useInsertLeadUpdate = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  
  return useMutation<unknown, ErrorResponse, LeadUpdateInsert>({
    mutationFn: (data) => insertLeadUpdate(data, user?.token || ""),
    mutationKey: ["insertLeadUpdate"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getLeadUpdates"],
      });
      toast.success("Lead Update Added Successfully");
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};

export const useUpdateLeadUpdate = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  
  return useMutation<unknown, ErrorResponse, LeadUpdate>({
    mutationFn: (data) => updateLeadUpdate(data, user?.token || ""),
    mutationKey: ["updateLeadUpdate"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getLeadUpdates"],
      });
      toast.success("Lead Update Updated Successfully");
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};
 
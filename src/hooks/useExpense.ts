"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllExpenses, insertExpense } from "@/services/expense";
import { useUserStore } from "@/store/store";
import { ExpenseObject } from "@/types/expense";
import { ErrorResponse } from "@/types/query";

export const useExpenseInsert = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  
  return useMutation<unknown, ErrorResponse, FormData>({
    mutationFn: (data) => insertExpense(data, user?.token || ""),
    mutationKey: ["insertExpense"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getExpenses"],
      });
      toast.success("Expense Inserted Successfully");
      router.push("/expenses");
    },
    onError: (error) => {
      toast.error(error.errorMessage);
    },
  });
};

export const useExpenses = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<ExpenseObject[], ErrorResponse>({
    queryKey: ["getExpenses"],
    queryFn: () => getAllExpenses(user?.token || ""),
    enabled: !!user?.token,
  });
}; 
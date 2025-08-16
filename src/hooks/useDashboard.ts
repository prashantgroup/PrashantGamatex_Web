import { AppStore, useAppStore, UserStore, useUserStore } from "@/store/store";
import { QuotationReminderData } from "@/types/followup";
import { LeadReminderData } from "@/types/lead";
import { ErrorResponse } from "@/types/query";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./../services/dashboard";

export const useDashboard = () => {
  const token = useUserStore((state: UserStore) => state.user?.token);
  const timeframe = useAppStore((state: AppStore) => state.timeframe);
  return useQuery<
    {
      dashboard: {
        pending_lead: number;
        total_lead: number;
        pending_quotation: number;
        total_quotation: number;
      }[];
      leadReminders: LeadReminderData[];
      quotationReminders: QuotationReminderData[];
    },
    ErrorResponse,
    {
      dashboard: {
        pending_lead: number;
        total_lead: number;
        pending_quotation: number;
        total_quotation: number;
      }[];
      leadReminders: LeadReminderData[];
      quotationReminders: QuotationReminderData[];
    }
  >({
    queryKey: ["getDashboard", timeframe],
    queryFn: () => getDashboard(token, timeframe),
    enabled: !!token,
  });
};

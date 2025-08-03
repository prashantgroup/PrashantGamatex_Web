import { useQuery } from "@tanstack/react-query";
import { ErrorResponse } from "@/types/query";
import { useAppStore, useUserStore } from "@/store/store";
import { LeadReminderData } from "@/types/lead";
import { QuotationReminderData } from "@/types/followup";
import { Timeframe } from "@/types/dashboard";

// Mock dashboard service for now - you'll need to implement this
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDashboard = async (_token: string | undefined, _timeframe: Timeframe) => {
  // This is a placeholder - implement actual dashboard service
  return {
    dashboard: [
      {
        pending_lead: 0,
        total_lead: 0,
        pending_quotation: 0,
        total_quotation: 0,
      }
    ],
    leadReminders: [] as LeadReminderData[],
    quotationReminders: [] as QuotationReminderData[],
  };
};

export const useDashboard = () => {
  const user = useUserStore((state) => state.user);
  const timeframe = useAppStore((state) => state.timeframe);
  
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
    ErrorResponse
  >({
    queryKey: ["getDashboard", timeframe],
    queryFn: () => getDashboard(user?.token, timeframe),
    enabled: !!user?.token,
  });
};
 
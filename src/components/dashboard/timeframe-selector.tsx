"use client";

import { useAppStore } from "@/store/store";
import { Timeframe } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const timeframes: Timeframe[] = [
  { value: "1D", label: "1 Day" },
  { value: "1W", label: "1 Week" },
  { value: "1M", label: "1 Month" },
  { value: "1Y", label: "1 Year" },
];

export function TimeframeSelector() {
  const { timeframe, setTimeframe } = useAppStore();
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Timeframe:</span>
      <Select value={timeframe.value} onValueChange={(value) => {
        const selectedTimeframe = timeframes.find(tf => tf.value === value);
        if (selectedTimeframe) {
          setTimeframe(selectedTimeframe);
          queryClient.invalidateQueries({
            queryKey: ["getDashboard", selectedTimeframe],
          });
        }
      }}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {timeframes.map((tf) => (
            <SelectItem key={tf.value} value={tf.value}>
              {tf.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

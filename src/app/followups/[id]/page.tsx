"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuotationFollowup } from "@/hooks/useFollowup";
import { Card } from "@/components/ui/card";

export default function FollowupEditPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuotationFollowup();
  const id = Number(params.id);
  const item = (data || []).find((d: any) => d.SalesQuotationId === id);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quotation</h1>
        <p className="text-sm text-muted-foreground">#{params.id}</p>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-destructive">{error.errorMessage}</div>}
      {item && (
        <Card className="p-4 grid gap-2">
          <div className="font-semibold">{item.PartyName}</div>
          <div className="text-sm text-muted-foreground">{item.MachineName}</div>
          <div className="text-xs text-muted-foreground">Doc #{item.DocumentNo} • {new Date(item.DocumentDate).toLocaleDateString("en-GB")}</div>
        </Card>
      )}
    </div>
  );
}
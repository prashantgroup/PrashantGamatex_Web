"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/hooks/useLeads";

export default function LeadHomePage() {
  const params = useParams<{ leadId: string }>();
  const id = Number(params.leadId);
  const { data, isLoading, error } = useLeads();

  const lead = useMemo(() => data?.find(l => l.ReferenceTransaction_2361Id === id), [data, id]);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead #{params.leadId}</h1>
          {lead && (
            <p className="text-sm text-muted-foreground">{lead.UDF_CompanyName_2361}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/leads/${params.leadId}/edit`}>
            <Button>Edit Lead</Button>
          </Link>
          <Link href={`/leads/${params.leadId}/follow-up`}>
            <Button variant="secondary">Follow-ups</Button>
          </Link>
        </div>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-destructive">{error.errorMessage}</div>}

      {lead && (
        <Card className="p-4 grid gap-2">
          <div>
            <span className="text-xs text-muted-foreground">Company</span>
            <div className="font-medium">{lead.UDF_CompanyName_2361}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Contact</span>
            <div className="font-medium">{lead.UDF_ContactPerson_2361} • {lead.UDF_MobileNo_2361}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Product</span>
            <div className="font-medium">{lead.UDF_Product_2361}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Lead Source</span>
            <div className="font-medium">{lead.UDF_LeadSource_2361}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Time Frame</span>
            <div className="font-medium">{lead.UDF_TimeFrame_2361}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Reminder</span>
            <div className="font-medium">{new Date(lead.UDF_LeadRemindDate_2361).toLocaleDateString("en-GB")}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
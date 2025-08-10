"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/hooks/useLeads";
import { LeadData } from "@/types/lead";
import Link from "next/link";

export default function LeadsListPage() {
  const { data, isLoading, error } = useLeads();
  const [search, setSearch] = useState("");

  const filteredLeads = useMemo(() => {
    if (!data) return [] as LeadData[];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((lead) => {
      return (
        lead.UDF_CompanyName_2361.toLowerCase().includes(q) ||
        lead.UDF_Product_2361.toLowerCase().includes(q) ||
        lead.UDF_ContactPerson_2361.toLowerCase().includes(q)
      );
    });
  }, [data, search]);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground">List of all leads</p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search company, product or contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Link href="/leads/add">
          <Button>Add Lead</Button>
        </Link>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && (
        <div className="text-destructive">{error.errorMessage}</div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.ReferenceTransaction_2361Id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {lead.UDF_CompanyName_2361}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lead.UDF_Product_2361}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    By {lead.UserName} • {new Date(lead.DocumentDate).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/leads/${lead.ReferenceTransaction_2361Id}`}>
                    <Button variant="secondary" size="sm">Open</Button>
                  </Link>
                  <Link href={`/leads/${lead.ReferenceTransaction_2361Id}/edit`}>
                    <Button size="sm">Edit</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          {filteredLeads.length === 0 && (
            <div className="text-sm text-muted-foreground">No leads found.</div>
          )}
        </div>
      )}
    </div>
  );
}
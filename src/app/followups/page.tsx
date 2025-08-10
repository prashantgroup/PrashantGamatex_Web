"use client";

import React, { useMemo, useState } from "react";
import { useQuotationFollowup } from "@/hooks/useFollowup";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function FollowupsListPage() {
  const { data, isLoading, error } = useQuotationFollowup();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [] as any[];
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(
      (f) =>
        f.PartyName.toLowerCase().includes(s) ||
        f.MachineName.toLowerCase().includes(s) ||
        String(f.DocumentNo).includes(s)
    );
  }, [data, q]);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quotation Followups</h1>
        <p className="text-sm text-muted-foreground">Browse all quotations</p>
      </div>
      <Input
        placeholder="Search party, machine or document no..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-md"
      />

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-destructive">{error.errorMessage}</div>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((it: any, idx: number) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{it.PartyName}</div>
                  <div className="text-sm text-muted-foreground">{it.MachineName}</div>
                  <div className="text-xs text-muted-foreground">
                    #{it.DocumentNo} • {new Date(it.DocumentDate).toLocaleDateString("en-GB")}
                  </div>
                </div>
                <Link href={`/followups/${it.SalesQuotationId}`} className="underline text-sm">
                  Open
                </Link>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">No followups found.</div>
          )}
        </div>
      )}
    </div>
  );
}
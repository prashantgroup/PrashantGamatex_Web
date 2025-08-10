"use client";

import React from "react";
import { useExpenses } from "@/hooks/useExpense";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExpensesListPage() {
  const { data, isLoading, error } = useExpenses();

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-muted-foreground">Your expense entries</p>
        </div>
        <Link href="/expenses/add">
          <Button>Add Expense</Button>
        </Link>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-destructive">{error.errorMessage}</div>}

      {!isLoading && !error && (
        <div className="grid gap-3">
          {data?.map((e, idx) => (
            <Card key={idx} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{e.CustomerName}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(e.ExpDate).toLocaleDateString("en-GB")}
                </div>
              </div>
              <div className="font-bold">₹ {e.ExpAmount.toLocaleString("en-IN")}</div>
            </Card>
          ))}
          {data && data.length === 0 && (
            <div className="text-sm text-muted-foreground">No expenses yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
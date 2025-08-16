"use client";

import React, { useState } from "react";
import { useExpenses } from "@/hooks/useExpense";
import { ExpenseObject } from "@/types/expense";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/store";
import { AppSidebar } from "@/components/app-sidebar";
import { ExpenseCard } from "@/components/expense-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus, Receipt, RefreshCw } from "lucide-react";

export default function ExpensesListPage() {
  const { user } = useUserStore();
  const { data, isLoading, error, refetch } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Expenses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                <p className="text-sm text-muted-foreground">List of All Expenses</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="shrink-0"
                >
                  <RefreshCw className={`mr-1 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Link href="/expenses/add">
                  <Button className="shrink-0">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Expense
                  </Button>
                </Link>
              </div>
            </div>

            <Separator className="bg-gray-500" />

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Loading expenses...</span>
              </div>
            )}

            {error && (
              <div className="flex-1 justify-center px-3 my-3">
                <div className="text-center">
                  <h2 className="text-lg text-red-500 font-semibold">Error</h2>
                  <p className="text-md text-red-500">
                    {error.errorMessage || "An unexpected error occurred. Please try again later."}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !error && data && data.length === 0 && (
              <div className="flex-1 justify-center px-3 my-3">
                <div className="text-center">
                  <Receipt className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h2 className="text-lg text-gray-500 font-semibold">No Expenses Found</h2>
                  <p className="text-md text-gray-500">
                    No expenses found. Please add some expenses to view them here.
                  </p>
                  <div className="mt-4">
                    <Link href="/expenses/add">
                      <Button>
                        <Plus className="mr-1 h-4 w-4" />
                        Add Expense
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && data && data.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.map((expense: ExpenseObject, idx: number) => (
                  <ExpenseCard key={idx} expense={expense} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
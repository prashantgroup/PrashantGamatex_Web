"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuotationFollowup } from "@/hooks/useFollowup";
import { SalesQuotationFollowup } from "@/types/followup";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import { AuthGuard } from "@/components/auth-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { FollowupCard } from "@/components/followup-card";
import { FollowupFilters, FollowupFilterOptions } from "@/components/followup-filters";
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
import { Search, Plus, Calendar, Package, Building } from "lucide-react";

export default function FollowupsListPage() {
  return (
    <AuthGuard>
      <FollowupsListContent />
    </AuthGuard>
  );
}

function FollowupsListContent() {
  const { user } = useUserStore();
  const { data, isLoading, error } = useQuotationFollowup();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FollowupFilterOptions>({});

  const handleApplyFilter = (newFilters: FollowupFilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilter = () => {
    setFilters({});
  };

  const filteredFollowups = useMemo(() => {
    if (!data) return [] as SalesQuotationFollowup[];
    
    let filtered = data;
    
    // Apply search filter
    const q = search.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((followup) => {
        return (
          followup.PartyName.toLowerCase().includes(q) ||
          followup.MachineName.toLowerCase().includes(q) ||
          String(followup.DocumentNo).includes(q) ||
          (followup.ReferenceNo && followup.ReferenceNo.toLowerCase().includes(q))
        );
      });
    }
    
    // Apply additional filters
    if (filters.person) {
      filtered = filtered.filter((followup) => 
        followup.UserName === filters.person?.UserName
      );
    }
    
    if (filters.partyName) {
      filtered = filtered.filter((followup) => 
        followup.PartyName.toLowerCase().includes(filters.partyName!.toLowerCase())
      );
    }
    
    if (filters.machineName) {
      filtered = filtered.filter((followup) => 
        followup.MachineName.toLowerCase().includes(filters.machineName!.toLowerCase())
      );
    }
    
    if (filters.fromDate) {
      filtered = filtered.filter((followup) => {
        const followupDate = new Date(followup.DocumentDate);
        return followupDate >= filters.fromDate!;
      });
    }
    
    if (filters.toDate) {
      filtered = filtered.filter((followup) => {
        const followupDate = new Date(followup.DocumentDate);
        return followupDate <= filters.toDate!;
      });
    }
    
    return filtered;
  }, [data, search, filters]);



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
                  <BreadcrumbPage>Followups</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">List of Followups</h1>
                <p className="text-sm text-muted-foreground">Track and manage all followups</p>
              </div>
            </div>

            {/* Filters */}
            <FollowupFilters
              currentFilters={filters}
              onApplyFilter={handleApplyFilter}
              onClearFilter={handleClearFilter}
            />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search party, machine, document no or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Loading followups...</span>
              </div>
            )}
            
            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/5 p-4">
                <p className="text-destructive">{error.errorMessage}</p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {filteredFollowups.length} of {data?.length || 0} followups
                    {(search || Object.keys(filters).some(key => filters[key as keyof FollowupFilterOptions])) && (
                      <span className="ml-2">(filtered)</span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredFollowups.map((followup) => (
                    <FollowupCard key={followup.SalesQuotationId} followup={followup as SalesQuotationFollowup} />
                  ))}
                  
                  {filteredFollowups.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <Package className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-semibold">No followups found</h3>
                      <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filters, or create a new followup
                      </p>
                      <Link href="/followups/add">
                        <Button>
                          <Plus className="mr-1 h-4 w-4" />
                          Add Followup
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
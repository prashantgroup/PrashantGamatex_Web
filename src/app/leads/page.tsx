"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/hooks/useLeads";
import { LeadData } from "@/types/lead";
import { LeadFilters, LeadFilterOptions } from "@/components/lead-filters";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import { AuthGuard } from "@/components/auth-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { LeadCard } from "@/components/lead-card";
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
import { Search, Plus } from "lucide-react";

export default function LeadsListPage() {
  return (
    <AuthGuard>
      <LeadsListContent />
    </AuthGuard>
  );
}

function LeadsListContent() {
  const { user } = useUserStore();
  const { data, isLoading, error } = useLeads();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<LeadFilterOptions>({});

  const handleApplyFilter = (newFilters: LeadFilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilter = () => {
    setFilters({});
  };

  const filteredLeads = useMemo(() => {
    if (!data) return [] as LeadData[];
    
    let filtered = data;
    
    // Apply search filter
    const q = search.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((lead) => {
        return (
          lead.UDF_CompanyName_2361.toLowerCase().includes(q) ||
          lead.UDF_Product_2361.toLowerCase().includes(q) ||
          lead.UDF_ContactPerson_2361.toLowerCase().includes(q)
        );
      });
    }
    
    // Apply additional filters
    if (filters.person) {
      filtered = filtered.filter((lead) => 
        lead.UserName === filters.person?.UserName
      );
    }
    
    if (filters.leadSource) {
      filtered = filtered.filter((lead) => 
        lead.UDF_LeadSource_2361 === filters.leadSource
      );
    }
    
    if (filters.timeFrame) {
      filtered = filtered.filter((lead) => 
        lead.UDF_TimeFrame_2361 === filters.timeFrame
      );
    }
    
    if (filters.currency) {
      filtered = filtered.filter((lead) => 
        lead.CurrencyName === filters.currency
      );
    }
    
    if (filters.customerApplication) {
      filtered = filtered.filter((lead) => 
        lead.UDF_CustomerApplication_2361 === filters.customerApplication
      );
    }
    
    if (filters.fromDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.DocumentDate);
        return leadDate >= filters.fromDate!;
      });
    }
    
    if (filters.toDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.DocumentDate);
        return leadDate <= filters.toDate!;
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
                  <BreadcrumbPage>Leads</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                <p className="text-sm text-muted-foreground">Manage and track all business leads</p>
              </div>
              <Link href="/leads/add">
                <Button className="shrink-0">
                  <Plus className="mr-1 h-4 w-4" />
                  Add New Lead
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <LeadFilters
              currentFilters={filters}
              onApplyFilter={handleApplyFilter}
              onClearFilter={handleClearFilter}
            />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search company, product or contact person..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Loading leads...</span>
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
                    {filteredLeads.length} of {data?.length || 0} leads
                    {(search || Object.keys(filters).some(key => filters[key as keyof LeadFilterOptions])) && (
                      <span className="ml-2">(filtered)</span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredLeads.map((lead) => (
                    <LeadCard key={lead.ReferenceTransaction_2361Id} lead={lead} />
                  ))}
                  
                  {filteredLeads.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <Search className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-semibold">No leads found</h3>
                      <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filters, or create a new lead
                      </p>
                      <Link href="/leads/add">
                        <Button>
                          <Plus className="mr-1 h-4 w-4" />
                          Add New Lead
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
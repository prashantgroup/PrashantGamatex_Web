"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/hooks/useLeads";
import { useUserStore } from "@/store/store";
import { AppSidebar } from "@/components/app-sidebar";
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
import { 
  Building, 
  User, 
  Package, 
  Calendar, 
  Globe, 
  Clock, 
  Mail, 
  MapPin, 
  Briefcase,
  Edit2, 
  BarChart4,
  ArrowLeft
} from "lucide-react";

export default function LeadHomePage() {
  const { user } = useUserStore();
  const params = useParams<{ leadId: string }>();
  const id = Number(params.leadId);
  const { data, isLoading, error } = useLeads();

  const lead = useMemo(() => data?.find(l => l.ReferenceTransaction_2361Id === id), [data, id]);

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
                  <BreadcrumbLink href="/leads">
                    Leads
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Lead #{params.leadId}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Link href="/leads">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {lead ? lead.UDF_CompanyName_2361 : `Lead #${params.leadId}`}
                  </h1>
                  {lead && (
                    <p className="text-sm text-muted-foreground">Added by {lead.UserName} on {new Date(lead.DocumentDate).toLocaleDateString("en-GB")}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/leads/${params.leadId}/follow-up`}>
                  <Button variant="outline">
                    <BarChart4 className="mr-1.5 h-4 w-4" />
                    Follow-ups
                  </Button>
                </Link>
                <Link href={`/leads/${params.leadId}/edit`}>
                  <Button>
                    <Edit2 className="mr-1.5 h-4 w-4" />
                    Edit Lead
                  </Button>
                </Link>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Loading lead details...</span>
              </div>
            )}

            {error && (
              <Card className="border-destructive">
                <CardContent className="p-4 text-destructive">
                  <p>{error.errorMessage}</p>
                </CardContent>
              </Card>
            )}

            {lead && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-xl">
                      <Building className="mr-2 h-5 w-5 text-primary" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="mr-1.5 h-4 w-4" />
                        Company Name
                      </div>
                      <div className="font-medium">{lead.UDF_CompanyName_2361}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1.5 h-4 w-4" />
                        Address
                      </div>
                      <div className="font-medium">{lead.UDF_CustomerAdd_2361 || "Not specified"}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Globe className="mr-1.5 h-4 w-4" />
                        Lead Source
                      </div>
                      <div className="font-medium">{lead.UDF_LeadSource_2361}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-xl">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1.5 h-4 w-4" />
                        Contact Person
                      </div>
                      <div className="font-medium">{lead.UDF_ContactPerson_2361}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="mr-1.5 h-4 w-4" />
                        Designation
                      </div>
                      <div className="font-medium">{lead.UDF_Designation_2361 || "Not specified"}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-1.5 h-4 w-4" />
                        Contact Details
                      </div>
                      <div className="font-medium">
                        {lead.UDF_MobileNo_2361}
                        {lead.UDF_EmailId_2361 && (
                          <div className="mt-1">{lead.UDF_EmailId_2361}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-xl">
                      <Package className="mr-2 h-5 w-5 text-primary" />
                      Product & Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-3">
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Package className="mr-1.5 h-4 w-4" />
                        Product
                      </div>
                      <div className="font-medium">{lead.UDF_Product_2361}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1.5 h-4 w-4" />
                        Time Frame
                      </div>
                      <div className="font-medium">{lead.UDF_TimeFrame_2361}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        Reminder
                      </div>
                      <div className="font-medium">
                        {new Date(lead.UDF_LeadRemindDate_2361).toLocaleDateString("en-GB")}
                      </div>
                    </div>

                    {lead.UDF_CompetitionWith_2361 && (
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          Competition
                        </div>
                        <div className="font-medium">{lead.UDF_CompetitionWith_2361}</div>
                      </div>
                    )}
                    
                    {lead.UDF_CustomerApplication_2361 && (
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          Customer Application
                        </div>
                        <div className="font-medium">{lead.UDF_CustomerApplication_2361}</div>
                      </div>
                    )}
                    
                    {lead.UDF_CustomerExistingMachine_2361 && (
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          Existing Machine
                        </div>
                        <div className="font-medium">{lead.UDF_CustomerExistingMachine_2361}</div>
                      </div>
                    )}
                    
                    {lead.UDF_LeadNotes_2361 && (
                      <div className="grid gap-1 md:col-span-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          Notes
                        </div>
                        <div className="font-medium">{lead.UDF_LeadNotes_2361}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
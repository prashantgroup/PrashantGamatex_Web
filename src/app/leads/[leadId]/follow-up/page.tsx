"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useLeads, useLeadUpdates, useInsertLeadUpdate } from "@/hooks/useLeads";
import { LeadData } from "@/types/lead";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getLabelProps } from "@/lib/form-utils";
import { LeadUpdate } from "@/types/lead";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import { AuthGuard } from "@/components/auth-guard";
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
  ArrowLeft,
  Plus,
  Clock,
  Calendar,
  PhoneCall,
  Mail,
  MessageSquare,
  Users,
  User,
  FileText,
  ListChecks
} from "lucide-react";

const schema = z.object({
  FollowupDetails: z.string().min(1, "Details are required"),
  ModeOfContact: z.enum(["Visit", "Phone", "Email", "WhatsApp"]),
  FollowupStatus: z.enum(["Fix in New Visit", "Close"]),
  NextVisitDateTime: z.date(),
  FollowupDateTime: z.date(),
  CloseReason: z.string().min(1, "Close Reason is required"),
  DetailDescription: z.string().min(1, "Detail Description is required"),
  VisitTo: z.string().min(1, "Communication with is required"),
  VisitorPerson: z.string().min(1, "Visitor is required"),
});

type FormValues = z.infer<typeof schema>;

export default function AddNewLeadFollowup() {
  return (
    <AuthGuard>
      <AddNewLeadFollowupContent />
    </AuthGuard>
  );
}

function AddNewLeadFollowupContent() {
  const { user } = useUserStore();
  const params = useParams<{ leadId: string }>();
  const leadId = Number(params.leadId);
  const { data: leads } = useLeads();
  const lead = useMemo<LeadData | undefined>(
    () => leads?.find((l) => l.ReferenceTransaction_2361Id === leadId),
    [leads, leadId]
  );
  const updates = useLeadUpdates(leadId);
  const insertUpdate = useInsertLeadUpdate();
  const [tab, setTab] = useState<"add" | "timeline">("add");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      FollowupDetails: "",
      ModeOfContact: "Phone",
      FollowupStatus: "Fix in New Visit",
      NextVisitDateTime: new Date(),
      FollowupDateTime: new Date(),
      CloseReason: "",
      DetailDescription: "",
      VisitTo: "",
      VisitorPerson: lead?.UserName || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload: LeadUpdate = {
      ReferenceTransaction_2361FollowupId: 0, // This will be set by the backend
      ReferenceTransactionId: leadId,
      ModeofContact: values.ModeOfContact,
      EntryDateTime: new Date(),
      ...values,
    };
    await insertUpdate.mutateAsync(payload);
  };



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
                  <BreadcrumbLink href={`/leads/${params.leadId}`}>
                    Lead #{params.leadId}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Follow-ups</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Link href={`/leads/${params.leadId}`}>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Lead Follow-ups</h1>
                  <p className="text-sm text-muted-foreground">
                    {lead && lead.UDF_CompanyName_2361} • Lead #{params.leadId}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={tab === "timeline" ? "default" : "outline"} 
                  onClick={() => setTab("timeline")}
                  className="gap-2"
                >
                  <ListChecks className="h-4 w-4" />
                  Timeline
                </Button>
                <Button 
                  variant={tab === "add" ? "default" : "outline"} 
                  onClick={() => setTab("add")}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Follow-up
                </Button>
              </div>
            </div>

      {tab === "add" && (
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-muted/50 pb-3 pt-5">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Plus className="mr-2 h-5 w-5 text-primary" />
              Add New Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label className="flex items-center text-sm font-medium" {...getLabelProps(schema, "VisitTo")}>
                    <User className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    Communication With
                  </Label>
                  <Input 
                    className="h-10" 
                    placeholder="Enter person name" 
                    {...register("VisitTo")} 
                  />
                  {errors.VisitTo && <p className="text-destructive text-xs">{errors.VisitTo.message}</p>}
                </div>
                <div className="grid gap-3">
                  <Label className="flex items-center text-sm font-medium" {...getLabelProps(schema, "VisitorPerson")}>
                    <User className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    Visitor
                  </Label>
                  <Input 
                    className="h-10" 
                    placeholder="Enter visitor name" 
                    {...register("VisitorPerson")} 
                  />
                  {errors.VisitorPerson && <p className="text-destructive text-xs">{errors.VisitorPerson.message}</p>}
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label className="flex items-center text-sm font-medium" {...getLabelProps(schema, "FollowupDetails")}>
                  <MessageSquare className="mr-1.5 h-4 w-4 text-muted-foreground" />
                  Follow-up Details
                </Label>
                <Input 
                  className="h-10" 
                  placeholder="Enter detailed summary of the follow-up" 
                  {...register("FollowupDetails")} 
                />
                {errors.FollowupDetails && <p className="text-destructive text-xs">{errors.FollowupDetails.message}</p>}
              </div>
              
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label className="flex items-center text-sm font-medium">
                    <PhoneCall className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    Mode of Contact
                  </Label>
                  <div className="overflow-hidden rounded-md border">
                    <select 
                      className="h-10 w-full bg-transparent px-3 py-2 text-sm outline-none" 
                      {...register("ModeOfContact")}
                    >
                      <option value="Visit">Visit</option>
                      <option value="Phone">Phone</option>
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Label className="flex items-center text-sm font-medium">
                    <ListChecks className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    Status
                  </Label>
                  <div className="overflow-hidden rounded-md border">
                    <select 
                      className="h-10 w-full bg-transparent px-3 py-2 text-sm outline-none" 
                      {...register("FollowupStatus")}
                    >
                      <option value="Fix in New Visit">Fix in New Visit</option>
                      <option value="Close">Close</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label className="flex items-center text-sm font-medium">
                    <Calendar className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    Follow-up Date/Time
                  </Label>
                  <Input 
                    className="h-10" 
                    type="datetime-local" 
                    {...register("FollowupDateTime", { valueAsDate: true })} 
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label className="flex items-center text-sm font-medium">
                    <Calendar className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    Next Visit Date/Time
                  </Label>
                  <Input 
                    className="h-10" 
                    type="datetime-local" 
                    {...register("NextVisitDateTime", { valueAsDate: true })} 
                  />
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label className="flex items-center text-sm font-medium" {...getLabelProps(schema, "DetailDescription")}>
                  <FileText className="mr-1.5 h-4 w-4 text-muted-foreground" />
                  Detail Description
                </Label>
                <Input 
                  className="h-10" 
                  placeholder="Enter detailed description" 
                  {...register("DetailDescription")} 
                />
                {errors.DetailDescription && <p className="text-destructive text-xs">{errors.DetailDescription.message}</p>}
              </div>
              
              <div className="grid gap-3">
                <Label className="flex items-center text-sm font-medium" {...getLabelProps(schema, "CloseReason")}>
                  <FileText className="mr-1.5 h-4 w-4 text-muted-foreground" />
                  Close Reason (if applicable)
                </Label>
                <Input 
                  className="h-10" 
                  placeholder="Enter reason for closing the lead" 
                  {...register("CloseReason")} 
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || insertUpdate.isPending}
                className="mt-2 w-full md:w-auto"
              >
                {insertUpdate.isPending ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Save Follow-up
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "timeline" && (
        <div className="space-y-6">
          {updates.isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <span className="ml-2">Loading timeline...</span>
            </div>
          )}
          
          {Array.isArray(updates.data) && updates.data.length > 0 ? (
            <div className="relative space-y-5 before:absolute before:inset-0 before:left-4 before:ml-0.5 before:border-l-2 before:border-dashed md:before:left-1/2 md:before:ml-0">
              {updates.data.map((u: LeadUpdate, idx: number) => (
                <div key={idx} className="relative flex flex-col gap-3 md:flex-row md:gap-6">
                  <div className="flex h-8 w-8 items-center justify-center self-start rounded-full border-2 border-primary bg-background text-primary md:absolute md:left-1/2 md:-ml-4">
                    {u.ModeofContact === "Visit" && <Users className="h-4 w-4" />}
                    {u.ModeofContact === "Phone" && <PhoneCall className="h-4 w-4" />}
                    {u.ModeofContact === "Email" && <Mail className="h-4 w-4" />}
                    {u.ModeofContact === "WhatsApp" && <MessageSquare className="h-4 w-4" />}
                  </div>
                  
                  <Card className="ml-10 flex-1 md:ml-0 md:w-[calc(50%-1rem)] md:self-start">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex flex-col justify-between border-b border-border pb-2 md:flex-row md:items-center">
                          <div className="font-medium">
                            {u.ModeofContact}{" "}
                            <span className="text-sm text-muted-foreground">with {u.VisitTo}</span>
                          </div>
                          <div className="mt-1 flex items-center text-xs text-muted-foreground md:mt-0">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            {new Date(u.FollowupDateTime).toLocaleString("en-GB", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </div>
                        
                        <div className="text-sm">{u.FollowupDetails}</div>
                        
                        {u.DetailDescription && (
                          <div className="border-t border-border pt-2 text-sm text-muted-foreground">
                            {u.DetailDescription}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-3 pt-2">
                          {u.FollowupStatus && (
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              u.FollowupStatus === "Close" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {u.FollowupStatus}
                            </span>
                          )}
                          
                          {u.NextVisitDateTime && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                              <Clock className="mr-1 h-3 w-3" />
                              Next: {new Date(u.NextVisitDateTime).toLocaleDateString("en-GB")}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            !updates.isLoading && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <ListChecks className="h-10 w-10 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No follow-ups yet</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Create your first follow-up by clicking the "Add Follow-up" button
                </p>
                <Button onClick={() => setTab("add")}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Follow-up
                </Button>
              </div>
            )
          )}
        </div>
      )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInsertQuotationFollowup, useQuotationFollowup } from "@/hooks/useFollowup";
import { SalesFollowupInsert } from "@/types/followup";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User, FileText, Phone, Mail, MessageSquare } from "lucide-react";

// Validation schema matching the React Native version
const followupFormSchema = z.object({
  DocumentDate: z.date(),
  SalesInquiryId: z.number(),
  SalesInquiryDetailsId: z.number(),
  SalesQuotationId: z.number(),
  SalesQuotationDetailsId: z.number(),
  FollowupDateTime: z.date(),
  FollowupEndDateTime: z.date(),
  VisitTo: z.string().min(1, "Communication With is required"),
  FollowupDetails: z.string().min(1, "Follow Up Details are required"),
  ModeOfContact: z.string().min(1, "Mode of Contact is required to be selected"),
  documentSent: z.object({
    offer: z.boolean(),
    layout: z.boolean(),
    pi: z.boolean(),
  }),
  FollowupStatus: z.string().min(1, "Follow Up Status is required to be selected"),
  VisitorPerson: z.string().min(1, "Communication By is required"),
  NextVisitDateTime: z.date(),
  NextVisitPerson: z.string(),
  NextVisitorPerson: z.string(),
  AttentionDetails: z.string(),
  OrderGoesParty: z.string(),
  CloseReason: z.string(),
  DetailDescription: z.string(),
  Rating: z.string(),
});

type FormValues = z.infer<typeof followupFormSchema>;

// Constants from React Native version
const Ratings = [
  "Banking and land process",
  "Banking process pending", 
  "Building is yet not ready",
  "Project is going slow due",
  "Project is initial stage.",
  "Project is slow due to low",
  "Project is very slow moving",
  "Project postponed",
];

const CloseReasons = ["Close", "Hold", "Lost", "Received"];

export default function AddFollowupPage() {
  return (
    <AuthGuard>
      <AddFollowupContent />
    </AuthGuard>
  );
}

function AddFollowupContent() {
  const { user } = useUserStore();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const insert = useInsertQuotationFollowup();
  
  // Get quotation data to populate disabled fields
  const { data: allQuotations } = useQuotationFollowup();
  const quotationDetails = allQuotations?.find((q: any) => q.SalesQuotationId === id);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(followupFormSchema),
    defaultValues: {
      DocumentDate: new Date(),
      SalesInquiryId: 0,
      SalesInquiryDetailsId: 0,
      SalesQuotationId: id,
      SalesQuotationDetailsId: 0,
      FollowupDateTime: new Date(),
      FollowupEndDateTime: new Date(),
      VisitTo: "", // Can be prefilled from last followup data
      FollowupDetails: "",
      ModeOfContact: "Phone",
      documentSent: {
        offer: false,
        layout: false,
        pi: false,
      },
      FollowupStatus: "Not Now",
      VisitorPerson: user?.data?.name || "",
      NextVisitDateTime: new Date(),
      NextVisitPerson: "",
      NextVisitorPerson: "",
      AttentionDetails: "",
      OrderGoesParty: "",
      CloseReason: "",
      DetailDescription: "",
      Rating: "",
    },
  });

  // Update form values when quotation data loads
  useEffect(() => {
    if (quotationDetails) {
      setValue("SalesInquiryId", quotationDetails.SalesInquiryDetailsId || 0);
      setValue("SalesInquiryDetailsId", quotationDetails.SalesInquiryDetailsId || 0);
      setValue("SalesQuotationDetailsId", quotationDetails.SalesQuotationDetailsId || 0);
    }
  }, [quotationDetails, setValue]);

  const followupStatus = watch("FollowupStatus");

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: SalesFollowupInsert = {
        DocumentDate: values.DocumentDate,
        SalesInquiryId: values.SalesInquiryId,
        SalesInquiryDetailsId: values.SalesInquiryDetailsId,
        SalesQuotationId: values.SalesQuotationId,
        SalesQuotationDetailsId: values.SalesQuotationDetailsId,
        FollowupDateTime: values.FollowupDateTime,
        FollowupEndDateTime: values.FollowupEndDateTime,
        VisitTo: values.VisitTo,
        FollowupDetails: values.FollowupDetails,
        ModeOfContact: values.ModeOfContact,
        documentSent: values.documentSent,
        FollowupStatus: values.FollowupStatus,
        VisitorPerson: values.VisitorPerson,
        NextVisitDateTime: values.NextVisitDateTime,
        NextVisitPerson: values.NextVisitPerson,
        NextVisitorPerson: values.NextVisitorPerson,
        AttentionDetails: values.AttentionDetails,
        OrderGoesParty: values.OrderGoesParty,
        CloseReason: values.CloseReason,
        DetailDescription: values.DetailDescription,
        Rating: values.Rating,
      };
      
      await insert.mutateAsync(payload);
    } catch (error) {
      console.error("Failed to submit followup:", error);
    }
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
                  <BreadcrumbLink href="/followups">
                    Followups
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/followups/${id}`}>
                    Quotation #{id}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Followup</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Follow Up</h1>
                <p className="text-sm text-muted-foreground">Add a New Follow Up for quotation #{id}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(`/followups/${id}`)}
                className="shrink-0"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Followup
              </Button>
            </div>

            <Separator className="bg-gray-500" />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="DocumentDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Followup Date
                    </Label>
                    <Input 
                      id="DocumentDate"
                      type="date"
                      {...register("DocumentDate", { valueAsDate: true })}
                    />
                    {errors.DocumentDate && (
                      <p className="text-destructive text-sm">{errors.DocumentDate.message}</p>
                    )}
                  </div>

                  {/* Machine Name - Read Only (from quotation data) */}
                  <div className="space-y-2">
                    <Label htmlFor="MachineName">Machine Name</Label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                      <span className={quotationDetails?.MachineName ? "text-foreground" : "text-muted-foreground"}>
                        {quotationDetails?.MachineName || "Loading machine name..."}
                      </span>
                    </div>
                  </div>

                  {/* Party Name - Read Only (from quotation data) */}
                  <div className="space-y-2">
                    <Label htmlFor="PartyName">Party Name</Label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                      <span className={quotationDetails?.PartyName ? "text-foreground" : "text-muted-foreground"}>
                        {quotationDetails?.PartyName || "Loading party name..."}
                      </span>
                    </div>
                  </div>

                  {/* Reference Information - Read Only (from quotation data) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ReferenceNo">Reference No.</Label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                        <span className={quotationDetails?.ReferenceNo ? "text-foreground" : "text-muted-foreground"}>
                          {quotationDetails?.ReferenceNo || "Loading reference no..."}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ReferenceDate">Reference Date</Label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                        <span className={quotationDetails?.ReferenceDate ? "text-foreground" : "text-muted-foreground"}>
                          {quotationDetails?.ReferenceDate 
                            ? new Date(quotationDetails.ReferenceDate).toLocaleDateString('en-GB')
                            : "Loading reference date..."
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="VisitTo" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Communication With
                      </Label>
                      <Input 
                        id="VisitTo"
                        placeholder="Enter Communication With"
                        {...register("VisitTo")}
                      />
                      {errors.VisitTo && (
                        <p className="text-destructive text-sm">{errors.VisitTo.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="VisitorPerson" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Communication By
                      </Label>
                      <Input 
                        id="VisitorPerson"
                        placeholder="Your name"
                        {...register("VisitorPerson")}
                      />
                      {errors.VisitorPerson && (
                        <p className="text-destructive text-sm">{errors.VisitorPerson.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="FollowupDetails" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Follow Up Details
                    </Label>
                    <Textarea
                      id="FollowupDetails"
                      placeholder="Enter Follow Up Details"
                      rows={4}
                      {...register("FollowupDetails")}
                    />
                    {errors.FollowupDetails && (
                      <p className="text-destructive text-sm">{errors.FollowupDetails.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Communication Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Communication Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Mode of Communication</Label>
                    <Controller
                      name="ModeOfContact"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-row gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Visit" id="visit" />
                            <Label htmlFor="visit">Visit</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Phone" id="phone" />
                            <Label htmlFor="phone">Phone</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="By Mail" id="email" />
                            <Label htmlFor="email">By Mail</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.ModeOfContact && (
                      <p className="text-destructive text-sm">{errors.ModeOfContact.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Document Sent</Label>
                    <div className="flex gap-6">
                      <Controller
                        name="documentSent.layout"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="layout"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="layout">Layout</Label>
                          </div>
                        )}
                      />
                      <Controller
                        name="documentSent.pi"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="pi"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="pi">PI</Label>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Follow Up Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Up Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Controller
                      name="FollowupStatus"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-row gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Not Now" id="not-now" />
                            <Label htmlFor="not-now">Not Now</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Fix in New Visit" id="fix-visit" />
                            <Label htmlFor="fix-visit">Fix in New Visit</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Close" id="close" />
                            <Label htmlFor="close">Close</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.FollowupStatus && (
                      <p className="text-destructive text-sm">{errors.FollowupStatus.message}</p>
                    )}
                  </div>

                  {/* Conditional sections based on status */}
                  {followupStatus === "Not Now" && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="Rating">Project Status</Label>
                        <Controller
                          name="Rating"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Project Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {Ratings.map((rating) => (
                                  <SelectItem key={rating} value={rating}>
                                    {rating}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {followupStatus === "Fix in New Visit" && (
                    <div className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-bold">Next Visit Detail</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="NextVisitDateTime" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Next Visit On
                            </Label>
                            <Input 
                              id="NextVisitDateTime"
                              type="datetime-local"
                              {...register("NextVisitDateTime", { valueAsDate: true })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="NextVisitPerson">Next Communication With</Label>
                            <Textarea
                              id="NextVisitPerson"
                              placeholder="Next Communication With"
                              rows={3}
                              {...register("NextVisitPerson")}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="NextVisitorPerson">Next Communication By</Label>
                            <Textarea
                              id="NextVisitorPerson"
                              placeholder="Next Communication By"
                              rows={3}
                              {...register("NextVisitorPerson")}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="AttentionDetails">Special Note</Label>
                            <Textarea
                              id="AttentionDetails"
                              placeholder="Special Note"
                              rows={3}
                              {...register("AttentionDetails")}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {followupStatus === "Close" && (
                    <div className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">Close Order</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="OrderGoesParty">Order Goes To</Label>
                            <Textarea
                              id="OrderGoesParty"
                              placeholder="Order Goes To"
                              rows={3}
                              {...register("OrderGoesParty")}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="CloseReason">Reason</Label>
                            <Controller
                              name="CloseReason"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Close" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {CloseReasons.map((reason) => (
                                      <SelectItem key={reason} value={reason}>
                                        {reason}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="DetailDescription">Detailed Description</Label>
                            <Textarea
                              id="DetailDescription"
                              placeholder="Detailed Description"
                              rows={4}
                              {...register("DetailDescription")}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Separator className="my-6" />

              {/* Submit Section */}
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || insert.isPending}
                  className="flex-1"
                >
                  {insert.isPending ? "Saving..." : "Submit"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push(`/followups/${id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
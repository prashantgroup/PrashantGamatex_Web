"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInsertQuotationFollowup } from "@/hooks/useFollowup";
import { SalesFollowupInsert } from "@/types/followup";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  FollowupDetails: z.string().min(1, "Details required"),
  ModeOfContact: z.enum(["Visit", "Phone", "Email"]),
  FollowupStatus: z.enum(["Not Now", "Fix in New Visit", "Close"]),
  FollowupDateTime: z.date(),
  NextVisitDateTime: z.date(),
  VisitTo: z.string().min(1, "Communication with required"),
  VisitorPerson: z.string().min(1, "Communication by required"),
});

type FormValues = z.infer<typeof schema>;

export default function AddFollowupPage() {
  const { user } = useUserStore();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const insert = useInsertQuotationFollowup();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      FollowupDetails: "",
      ModeOfContact: "Phone",
      FollowupStatus: "Not Now",
      FollowupDateTime: new Date(),
      NextVisitDateTime: new Date(),
      VisitTo: "",
      VisitorPerson: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload: SalesFollowupInsert = {
      DocumentDate: new Date(),
      SalesInquiryId: 0,
      SalesInquiryDetailsId: 0,
      SalesQuotationId: id,
      SalesQuotationDetailsId: 0,
      FollowupDateTime: values.FollowupDateTime,
      FollowupEndDateTime: values.FollowupDateTime,
      VisitTo: values.VisitTo,
      FollowupDetails: values.FollowupDetails,
      ModeOfContact: values.ModeOfContact,
      documentSent: { offer: false, layout: false, pi: false },
      FollowupStatus: values.FollowupStatus,
      VisitorPerson: values.VisitorPerson,
      NextVisitDateTime: values.NextVisitDateTime,
      NextVisitPerson: "",
      NextVisitorPerson: "",
      AttentionDetails: "",
      OrderGoesParty: "",
      CloseReason: "",
      DetailDescription: "",
      Rating: "",
    };
    await insert.mutateAsync(payload);
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
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Followup</h1>
                <p className="text-sm text-muted-foreground">Create a new followup entry for quotation #{id}</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Followup Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="VisitTo">Communication With</Label>
                      <Input 
                        id="VisitTo"
                        placeholder="Person you communicated with" 
                        {...register("VisitTo")} 
                      />
                      {errors.VisitTo && (
                        <p className="text-destructive text-sm">{errors.VisitTo.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="VisitorPerson">Communication By</Label>
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

                  <div className="grid gap-2">
                    <Label htmlFor="FollowupDetails">Followup Details</Label>
                    <Input 
                      id="FollowupDetails"
                      placeholder="Describe the followup details" 
                      {...register("FollowupDetails")} 
                    />
                    {errors.FollowupDetails && (
                      <p className="text-destructive text-sm">{errors.FollowupDetails.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="FollowupStatus">Mode of Contact</Label>
                      <select 
                        id="ModeOfContact"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        {...register("ModeOfContact")}
                      >
                        <option value="Visit">Visit</option>
                        <option value="Phone">Phone</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="FollowupStatus">Followup Status</Label>
                      <select 
                        id="FollowupStatus"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        {...register("FollowupStatus")}
                      >
                        <option value="Not Now">Not Now</option>
                        <option value="Fix in New Visit">Fix in New Visit</option>
                        <option value="Close">Close</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="FollowupDateTime">Followup Date/Time</Label>
                      <Input 
                        id="FollowupDateTime"
                        type="datetime-local" 
                        {...register("FollowupDateTime", { valueAsDate: true })} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="NextVisitDateTime">Next Visit Date/Time</Label>
                      <Input 
                        id="NextVisitDateTime"
                        type="datetime-local" 
                        {...register("NextVisitDateTime", { valueAsDate: true })} 
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || insert.isPending}
                      className="flex-1"
                    >
                      {insert.isPending ? "Saving..." : "Save Followup"}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
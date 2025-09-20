"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getLabelProps } from "@/lib/form-utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConstants } from "@/hooks/useConstants";
import { useInsertLead } from "@/hooks/useLeads";
import { LeadInsertData } from "@/types/lead";
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
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  ArrowLeft,
  Save,
  Building,
  User,
  Calendar,
  Package,
  Mail,
  Phone,
  Globe,
  Clock,
  FileText,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  currency: z.string().min(1, "Currency is required"),
  documentDate: z.date(),
  customerCompanyName: z.string().min(1, "Customer Company Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  designation: z.string().min(1, "Designation is required"),
  mobileNo: z.string().min(10, "Mobile must be at least 10 digits"),
  address: z.string().optional(),
  emailId: z.string().email("Invalid email"),
  product: z.string().min(1, "Product is required"),
  leadSource: z.string().min(1, "Lead Source is required"),
  competition: z.string().optional(),
  timeFrame: z.string().min(1, "Time Frame is required"),
  leadRemindDate: z.date().min(new Date(), "Reminder Date must be in the future"),
  customerApplication: z.string().optional(),
  customerExistingMachine: z.string().optional()  ,
  leadNote: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddLeadPage() {
  return (
    <AuthGuard>
      <AddLeadContent />
    </AuthGuard>
  );
}

function AddLeadContent() {
  const { user } = useUserStore();
  const router = useRouter();
  const constants = useConstants();
  const insertLead = useInsertLead();
  const [files, setFiles] = useState<FileList | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      documentDate: new Date(),
      leadRemindDate: new Date(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      
      // Append all form values
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value);
        }
      });

      // Append attachments if any
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append('attachments[]', file);
        });
      }

      await insertLead.mutateAsync(formData as any);
      reset(); // Reset form after successful submission
      setFiles(null);
      router.push('/leads');
    } catch (error) {
      console.error(error);
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
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/leads">Leads</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add New Lead</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Link href="/leads">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Add New Lead
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Create a new business lead
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Building className="mr-2 h-5 w-5 text-primary" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="currency" className="text-sm" {...getLabelProps(schema, "currency")}>
                          Currency
                        </Label>
                        <Controller
                          name="currency"
                          control={control}
                          defaultValue="Rs."
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {constants.isLoading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                ) : (
                                  (
                                    constants.data?.CurrencyOutput.split(",") ||
                                    []
                                  ).map((c) => (
                                    <SelectItem key={c} value={c}>
                                      {c}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.currency && (
                          <p className="text-destructive text-xs">
                            {errors.currency.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor="customerCompanyName"
                          className="text-sm"
                          {...getLabelProps(schema, "customerCompanyName")}
                        >
                          Company Name
                        </Label>
                        <Input
                          id="customerCompanyName"
                          placeholder="Enter company name"
                          {...register("customerCompanyName")}
                          className="h-9"
                        />
                        {errors.customerCompanyName && (
                          <p className="text-destructive text-xs">
                            {errors.customerCompanyName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address" className="text-sm" {...getLabelProps(schema, "address")}>
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete address"
                        rows={3}
                        {...register("address")}
                      />
                      {errors.address && (
                        <p className="text-destructive text-xs">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="contactPerson" className="text-sm" {...getLabelProps(schema, "contactPerson")}>
                          Contact Person
                        </Label>
                        <Input
                          id="contactPerson"
                          placeholder="Enter name"
                          {...register("contactPerson")}
                          className="h-9"
                        />
                        {errors.contactPerson && (
                          <p className="text-destructive text-xs">
                            {errors.contactPerson.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="designation" className="text-sm" {...getLabelProps(schema, "designation")}>
                          Designation
                        </Label>
                        <Input
                          id="designation"
                          placeholder="Enter designation"
                          {...register("designation")}
                          className="h-9"
                        />
                        {errors.designation && (
                          <p className="text-destructive text-xs">
                            {errors.designation.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="mobileNo"
                          className="flex items-center text-sm"
                          {...getLabelProps(schema, "mobileNo")}
                        >
                          <Phone className="mr-1.5 h-3.5 w-3.5" />
                          Mobile Number
                        </Label>
                        <Input
                          id="mobileNo"
                          placeholder="Enter mobile number"
                          {...register("mobileNo")}
                          className="h-9"
                        />
                        {errors.mobileNo && (
                          <p className="text-destructive text-xs">
                            {errors.mobileNo.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor="emailId"
                          className="flex items-center text-sm"
                          {...getLabelProps(schema, "emailId")}
                        >
                          <Mail className="mr-1.5 h-3.5 w-3.5" />
                          Email Address
                        </Label>
                        <Input
                          id="emailId"
                          type="email"
                          placeholder="Enter email address"
                          {...register("emailId")}
                          className="h-9"
                        />
                        {errors.emailId && (
                          <p className="text-destructive text-xs">
                            {errors.emailId.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Package className="mr-2 h-5 w-5 text-primary" />
                      Product & Business Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="product"
                          className="flex items-center text-sm"
                          {...getLabelProps(schema, "product")}
                        >
                          <Package className="mr-1.5 h-3.5 w-3.5" />
                          Product
                        </Label>
                        <Controller
                          name="product"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {constants.isLoading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                ) : (
                                  (
                                    constants.data?.ProductOutput.split(",") ||
                                    []
                                  ).map((p) => (
                                    <SelectItem key={p} value={p}>
                                      {p}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.product && (
                          <p className="text-destructive text-xs">
                            {errors.product.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor="leadSource"
                          className="flex items-center text-sm"
                          {...getLabelProps(schema, "leadSource")}
                        >
                          <Globe className="mr-1.5 h-3.5 w-3.5" />
                          Lead Source
                        </Label>
                        <Controller
                          name="leadSource"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select lead source" />
                              </SelectTrigger>
                              <SelectContent>
                                {constants.isLoading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                ) : (
                                  (
                                    constants.data?.LeadSourceOutput.split(
                                      ","
                                    ) || []
                                  ).map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {s}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.leadSource && (
                          <p className="text-destructive text-xs">
                            {errors.leadSource.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="timeFrame"
                          className="flex items-center text-sm"
                          {...getLabelProps(schema, "timeFrame")}
                        >
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          Time Frame
                        </Label>
                        <Controller
                          name="timeFrame"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select time frame" />
                              </SelectTrigger>
                              <SelectContent>
                                {constants.isLoading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                ) : (
                                  (
                                    constants.data?.TimeFrameOutput.split(
                                      ","
                                    ) || []
                                  ).map((t) => (
                                    <SelectItem key={t} value={t}>
                                      {t}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.timeFrame && (
                          <p className="text-destructive text-xs">
                            {errors.timeFrame.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor="customerApplication"
                          className="text-sm"
                          {...getLabelProps(schema, "customerApplication")}
                        >
                          Application
                        </Label>
                        <Controller
                          name="customerApplication"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select application" />
                              </SelectTrigger>
                              <SelectContent>
                                {constants.isLoading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                ) : (
                                  (
                                    constants.data?.ApplicationOutput.split(
                                      ","
                                    ) || []
                                  ).map((a) => (
                                    <SelectItem key={a} value={a}>
                                      {a}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.customerApplication && (
                          <p className="text-destructive text-xs">
                            {errors.customerApplication.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="competition" className="text-sm" {...getLabelProps(schema, "competition")}>
                          Competition
                        </Label>
                        <Input
                          id="competition"
                          placeholder="Enter competition details"
                          {...register("competition")}
                          className="h-9"
                        />
                        {errors.competition && (
                          <p className="text-destructive text-xs">
                            {errors.competition.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor="customerExistingMachine"
                          className="text-sm"
                          {...getLabelProps(schema, "customerExistingMachine")}
                        >
                          Existing Machine
                        </Label>
                        <Input
                          id="customerExistingMachine"
                          placeholder="Enter existing machine details"
                          {...register("customerExistingMachine")}
                          className="h-9"
                        />
                        {errors.customerExistingMachine && (
                          <p className="text-destructive text-xs">
                            {errors.customerExistingMachine.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="leadRemindDate"
                        className="flex items-center text-sm"
                        {...getLabelProps(schema, "leadRemindDate")}
                      >
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        Reminder Date
                      </Label>
                      <Input
                        id="leadRemindDate"
                        type="date"
                        {...register("leadRemindDate", { valueAsDate: true })}
                        className="h-9"
                      />
                      {errors.leadRemindDate && (
                        <p className="text-destructive text-xs">
                          {errors.leadRemindDate.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="leadNote"
                        className="flex items-center text-sm"
                        {...getLabelProps(schema, "leadNote")}
                      >
                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                        Lead Notes
                      </Label>
                      <Input
                        id="leadNote"
                        placeholder="Enter lead notes"
                        {...register("leadNote")}
                        className="h-9"
                      />
                      {errors.leadNote && (
                        <p className="text-destructive text-xs">
                          {errors.leadNote.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="attachments" className="text-sm">
                        Attachments (Optional)
                      </Label>
                      <Input
                        id="attachments"
                        type="file"
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                        className="h-9"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || insertLead.isPending}
                    className="gap-2"
                  >
                    {insertLead.isPending ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

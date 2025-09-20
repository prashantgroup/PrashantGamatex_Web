"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useConstants } from "@/hooks/useConstants";
import { useLeads, useUpdateLead } from "@/hooks/useLeads";
import { LeadData, LeadUpdateData } from "@/types/lead";
import { useUserStore } from "@/store/store";
import client from "@/lib/api";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Paperclip,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  currency: z.string().min(1, "Currency is required"),
  customerCompanyName: z.string().min(1, "Customer Company Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  designation: z.string().min(1, "Designation is required"),
  mobileNo: z.string().min(10, "Mobile must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  emailId: z.string().email("Invalid email"),
  product: z.string().min(1, "Product is required"),
  leadSource: z.string().min(1, "Lead Source is required"),
  competition: z.string().min(1, "Competition is required"),
  timeFrame: z.string().min(1, "Time Frame is required"),
  leadRemindDate: z.string().min(1, "Lead Remind Date is required"),
  customerApplication: z.string().min(1, "Customer Application is required"),
  customerExistingMachine: z.string().min(1, "Customer Existing Machine is required"),
  leadNote: z.string().min(1, "Lead Note is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LeadEditPage() {
  return (
    <AuthGuard>
      <LeadEditContent />
    </AuthGuard>
  );
}

function LeadEditContent() {
  const { user } = useUserStore();
  const params = useParams<{ leadId: string }>();
  const router = useRouter();
  const id = Number(params.leadId);
  const [imageBlobUrls, setImageBlobUrls] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to fetch authenticated images
  const fetchAuthenticatedImage = async (imageName: string): Promise<string> => {
    try {
      const response = await client.get(`/user/lead/images/${imageName}`, {
        responseType: 'blob',
      });
      const blob = response.data;
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  };

  const { data: leads } = useLeads();
  const constants = useConstants();
  const updateLead = useUpdateLead();

  const current = useMemo<LeadData | undefined>(
    () => leads?.find((l) => l.ReferenceTransaction_2361Id === id),
    [leads, id]
  );

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!current) return;
    console.log("current lead",current);
    setValue("currency", current.CurrencyName || "");
    setValue("customerCompanyName", current.UDF_CompanyName_2361 || "");
    setValue("contactPerson", current.UDF_ContactPerson_2361 || "");
    setValue("designation", current.UDF_Designation_2361 || "");
    setValue("mobileNo", current.UDF_MobileNo_2361 || "");
    setValue("address", current.UDF_CustomerAdd_2361 || "");
    setValue("emailId", current.UDF_EmailId_2361 || "");
    setValue("product", current.UDF_Product_2361 || "");
    setValue("leadSource", current.UDF_LeadSource_2361 || "");
    setValue("competition", current.UDF_CompetitionWith_2361 || "");
    setValue("timeFrame", current.UDF_TimeFrame_2361 || "");
    setValue(
      "leadRemindDate",
      new Date(current.UDF_LeadRemindDate_2361).toISOString().split('T')[0]
    );
    setValue(
      "customerApplication",
      current.UDF_CustomerApplication_2361 || ""
    );
    setValue(
      "customerExistingMachine",
      current.UDF_CustomerExistingMachine_2361 || ""
    );
    setValue("leadNote", current.UDF_LeadNotes_2361 || "");
  }, [current, setValue]);

  // Fetch authenticated images when current lead changes
  useEffect(() => {
    if (!current?.ImageName) return;

    const fetchImages = async () => {
      const imageNames = current.ImageName.split(",").filter(img => img.trim());
      const newBlobUrls: Record<string, string> = {};

      for (const imageName of imageNames) {
        const trimmedName = imageName.trim();
        if (trimmedName && !imageBlobUrls[trimmedName]) {
          try {
            const blobUrl = await fetchAuthenticatedImage(trimmedName);
            newBlobUrls[trimmedName] = blobUrl;
          } catch (error) {
            console.error(`Failed to fetch image ${trimmedName}:`, error);
          }
        }
      }

      if (Object.keys(newBlobUrls).length > 0) {
        setImageBlobUrls(prev => ({ ...prev, ...newBlobUrls }));
      }
    };

    fetchImages();
  }, [current?.ImageName, current?.ReferenceTransaction_2361Id, imageBlobUrls, fetchAuthenticatedImage]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imageBlobUrls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageBlobUrls]);

  // Helper functions for modal
  const imageNames = current?.ImageName ? current.ImageName.split(",").filter(img => img.trim()) : [];
  const availableImages = imageNames.filter(name => imageBlobUrls[name.trim()]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'Escape':
          event.preventDefault();
          setIsModalOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, availableImages.length]);

  const onSubmit = async (values: FormValues) => {
    const payload: LeadUpdateData & { RecordId: number; category: string } = {
      ...values,
      leadRemindDate: new Date(values.leadRemindDate), // Convert string back to Date
      RecordId: current?.ReferenceTransaction_2361Id || 0,
      category: current?.CategoryName || "",
    };
    await updateLead.mutateAsync(payload);
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
                  <BreadcrumbLink href={`/leads/${params.leadId}`}>
                    Lead #{params.leadId}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Link href={`/leads/${params.leadId}`}>
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
                    Edit Lead
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Update details for lead #{params.leadId}
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
                        <Label htmlFor="currency" className="text-sm">
                          Currency
                        </Label>
                        <Controller
                          name="currency"
                          control={control}
                          render={({ field }) => (
                            <Select
                              key={`currency-${
                                current?.ReferenceTransaction_2361Id || "new"
                              }-${field.value}`}
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
                      <Label htmlFor="address" className="text-sm">
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
                        <Label htmlFor="contactPerson" className="text-sm">
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
                        <Label htmlFor="designation" className="text-sm">
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
                        >
                          <Package className="mr-1.5 h-3.5 w-3.5" />
                          Product
                        </Label>
                        <Controller
                          name="product"
                          control={control}
                          render={({ field }) => (
                            <Select
                              key={`product-${
                                current?.ReferenceTransaction_2361Id || "new"
                              }-${field.value}`}
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
                        >
                          <Globe className="mr-1.5 h-3.5 w-3.5" />
                          Lead Source
                        </Label>
                        <Controller
                          name="leadSource"
                          control={control}
                          render={({ field }) => (
                            <Select
                              key={`leadSource-${
                                current?.ReferenceTransaction_2361Id || "new"
                              }-${field.value}`}
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
                        >
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          Time Frame
                        </Label>
                        <Controller
                          name="timeFrame"
                          control={control}
                          render={({ field }) => (
                            <Select
                              key={`timeFrame-${
                                current?.ReferenceTransaction_2361Id || "new"
                              }-${field.value}`}
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
                        >
                          Application
                        </Label>
                        <Controller
                          name="customerApplication"
                          control={control}
                          render={({ field }) => (
                            <Select
                              key={`customerApplication-${
                                current?.ReferenceTransaction_2361Id || "new"
                              }-${field.value}`}
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
                        <Label htmlFor="competition" className="text-sm">
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
                      >
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        Reminder Date
                      </Label>
                      <Input
                        id="leadRemindDate"
                        type="date"
                        {...register("leadRemindDate")}
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
                  </CardContent>
                </Card>

                {/* Attachments Display */}
                {current?.ImageName && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Paperclip className="mr-2 h-5 w-5 text-primary" />
                        Attachments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {current.ImageName.split(",").filter((img) => img.trim())
                        .length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {current.ImageName.split(",")
                            .filter((img) => img.trim())
                            .map((imageName, index) => {
                              const trimmedName = imageName.trim();
                              const blobUrl = imageBlobUrls[trimmedName];
                              const isLoading = !blobUrl;

                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                      <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {trimmedName ||
                                          `Attachment ${index + 1}`}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {isLoading
                                          ? "Loading..."
                                          : "Uploaded file"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      disabled={isLoading}
                                      onClick={() => {
                                        if (blobUrl) {
                                          const imageIndex =
                                            availableImages.findIndex(
                                              (name) =>
                                                name.trim() === trimmedName
                                            );
                                          if (imageIndex !== -1) {
                                            openModal(imageIndex);
                                          }
                                        }
                                      }}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      disabled={isLoading}
                                      onClick={() => {
                                        if (blobUrl) {
                                          const link =
                                            document.createElement("a");
                                          link.href = blobUrl;
                                          link.download = trimmedName;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        }
                                      }}
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Paperclip className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No attachments found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || updateLead.isPending}
                    className="gap-2"
                  >
                    {updateLead.isPending ? "Submitting..." : "Submit"}
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

      {/* Image Gallery Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Paperclip className="mr-2 h-5 w-5 text-primary" />
                Attachment Gallery ({currentImageIndex + 1} of{" "}
                {availableImages.length})
              </span>
            </DialogTitle>
          </DialogHeader>

          {availableImages.length > 0 && (
            <div className="relative flex-1 flex flex-col">
              {/* Main Image Display */}
              <div className="flex-1 flex items-center justify-center p-6 bg-muted/20">
                <div className="relative max-w-full max-h-full">
                  <img
                    src={
                      imageBlobUrls[availableImages[currentImageIndex]?.trim()]
                    }
                    alt={`Attachment ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                  />

                  {/* Navigation Arrows */}
                  {availableImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Image Info and Actions */}
              <div className="p-6 border-t bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {availableImages[currentImageIndex]?.trim() ||
                        `Attachment ${currentImageIndex + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Click and drag to pan • Scroll to zoom
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const blobUrl =
                          imageBlobUrls[
                            availableImages[currentImageIndex]?.trim()
                          ];
                        if (blobUrl) {
                          const link = document.createElement("a");
                          link.href = blobUrl;
                          link.download =
                            availableImages[currentImageIndex]?.trim() ||
                            "attachment";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {availableImages.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {availableImages.map((imageName, index) => {
                      const trimmedName = imageName.trim();
                      const blobUrl = imageBlobUrls[trimmedName];
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground"
                          }`}
                        >
                          <img
                            src={blobUrl}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
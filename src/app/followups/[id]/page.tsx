"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  User, 
  FileText, 
  Image as ImageIcon,
  X,
  Building,
  Package,
  Calendar,
  Clock
} from "lucide-react";
import { getFollowupList } from "@/services/followup";
import { useQuotationFollowup } from "@/hooks/useFollowup";

export default function FollowupDetailPage() {
  const { user } = useUserStore();
  const params = useParams();
  const router = useRouter();
  const followupId = params.id as string;
  
  const [tab, setTab] = useState<"timeline" | "images">("timeline");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get the followup details from the store
  const { data: allFollowups } = useQuotationFollowup();
  const followupDetails = allFollowups?.find((f: any) => f.SalesQuotationId.toString() === followupId);

  // Get the followup timeline
  const {
    data: followupTimeline,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["quotationFollowupList", followupId],
    queryFn: () =>
      getFollowupList(
        0,
        parseInt(followupDetails?.SalesQuotationDetailsId.toString() || "0"),
        "Quotation",
        user?.token || ""
      ),
    enabled: !!user?.token && !!followupId,
  });

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

  if (!followupDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Followup Not Found</h1>
          <p className="text-muted-foreground">The requested followup could not be found.</p>
        </div>
      </div>
    );
  }

  const images = followupDetails.ImageName ? followupDetails.ImageName.split(",").filter(Boolean) : [];

  const getImageUrl = (imageName: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/user/images/${imageName}`;
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
                  <BreadcrumbPage>{followupDetails.PartyName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {followupDetails.PartyName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  #{followupDetails.DocumentNo}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {followupDetails.MachineName}
                </span>
              </div>
            </div>

            <Separator className="bg-gray-500" />

            {/* Tab Navigation */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setTab("timeline")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === "timeline"
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setTab("images")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === "images"
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Images
              </button>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Loading followup data...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Failed to load followup data</p>
                <p className="text-sm text-gray-600">{error?.message}</p>
              </div>
            ) : (
              <div className="relative">
                {tab === "timeline" && (
                  <>
                                         {/* Timeline */}
                     <div className="relative">
                       {/* Timeline line */}
                       <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-blue-500 to-gray-300" />
                       
                       {(followupTimeline as any[])?.map((followup: any, index: number) => (
                         <div key={index} className="mb-8 relative">
                           {/* Timeline dot */}
                           <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-lg z-10" />
                           
                           {/* Timeline content */}
                           <div className="ml-12 flex-1">
                             {/* Date and time header */}
                             <div className="flex items-center gap-3 mb-3">
                               <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                 <Calendar className="h-4 w-4 text-blue-500" />
                                 <span className="font-medium">
                                   {new Date(followup.FollowupDateTime).toLocaleDateString("en-IN", {
                                     year: "numeric",
                                     month: "short",
                                     day: "numeric",
                                   })}
                                 </span>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                 <Clock className="h-4 w-4 text-gray-400" />
                                 <span>
                                   {new Date(followup.FollowupDateTime).toLocaleTimeString("en-IN", {
                                     hour: "numeric",
                                     minute: "numeric",
                                   })}
                                 </span>
                               </div>
                             </div>
                             
                             {/* Followup card */}
                             <Card className="shadow-md border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                               <CardContent>
                                 {/* Mode of contact header */}
                                 <div className="flex items-center justify-between mb-4">
                                   <h3 className="text-xl font-bold text-gray-800">
                                     {followup.ModeofContact}
                                   </h3>
                                   <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                     Followup #{index + 1}
                                   </Badge>
                                 </div>
                                 
                                 {/* Followup details */}
                                 <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                   <p className="text-gray-700 leading-relaxed">
                                     {followup.FollowupDetails}
                                   </p>
                                 </div>
                                 
                                 {/* Additional information */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                     <div className="p-2 bg-blue-100 rounded-full">
                                       <User className="h-4 w-4 text-blue-600" />
                                     </div>
                                     <div>
                                       <p className="text-xs text-gray-500 font-medium">Visited Person</p>
                                       <p className="text-sm text-gray-700 font-semibold">
                                         {followup.VisitTo}
                                       </p>
                                     </div>
                                   </div>
                                   
                                   <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                     <div className="p-2 bg-green-100 rounded-full">
                                       <FileText className="h-4 w-4 text-green-600" />
                                     </div>
                                     <div>
                                       <p className="text-xs text-gray-500 font-medium">Documents</p>
                                       <p className="text-sm text-gray-700 font-semibold">Available</p>
                                     </div>
                                   </div>
                                 </div>
                                 
                                 {/* Status section */}
                                 {followup.FollowupStatus && (
                                   <div className="mt-4 pt-4 border-t border-gray-200">
                                     <div className="flex items-center gap-2">
                                       <span className="text-sm text-gray-600 font-medium">Status:</span>
                                       <Badge variant="secondary" className="text-sm px-3 py-1">
                                         {followup.FollowupStatus}
                                       </Badge>
                                     </div>
                                   </div>
                                 )}
                               </CardContent>
                             </Card>
                           </div>
                         </div>
                       ))}
                       
                       {/* Empty state for timeline */}
                       {(!followupTimeline || (followupTimeline as any[]).length === 0) && (
                         <div className="text-center py-12">
                           <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                             <Clock className="h-8 w-8 text-gray-400" />
                           </div>
                           <h3 className="text-lg font-medium text-gray-900 mb-2">No followups yet</h3>
                           <p className="text-gray-500">Start tracking your followup activities by adding the first entry.</p>
                         </div>
                       )}
                     </div>

                    {/* Add New Followup Button */}
                    <div className="mt-10 pb-6">
                      <Button 
                        onClick={() => router.push(`/followups/${followupId}/add`)}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Followup
                      </Button>
                    </div>
                  </>
                )}

                {tab === "images" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.length > 0 ? (
                      images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden border cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`Followup image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p>No images available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-[90vh] p-4">
              <img
                src={getImageUrl(selectedImage)}
                alt="Selected followup image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <X className="h-8 w-8" />
              </button>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
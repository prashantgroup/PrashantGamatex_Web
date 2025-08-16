"use client";

import { useUserStore, useAppStore } from "@/store/store";
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
import { Button } from "@/components/ui/button";
import { TimeframeSelector } from "@/components/dashboard/timeframe-selector";
import { useDashboard } from "@/hooks/useDashboard";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUserStore();
  const { timeframe } = useAppStore();
  const router = useRouter();
  const { data: dashboardData, isLoading, isError, error } = useDashboard();

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

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h1>
          <p className="text-muted-foreground">{error?.errorMessage || "An unexpected error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4 flex-1">
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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Timeframe Selector - Right Side */}
          <div className="flex items-center gap-2 px-4">
            <TimeframeSelector />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.data.name}! Here's what's happening with your{" "}
              {user.data.company} account.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Loading dashboard data...
                </span>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {dashboardData && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Leads Card */}
                <Card className="w-full rounded-sm p-0 shadow-lg border border-gray-300 bg-gray-100">
                  {isLoading && !isError ? (
                    <CardContent className="flex items-center justify-start gap-2 p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Fetching</span>
                    </CardContent>
                  ) : (
                    <>
                      <CardHeader className="border-b border-gray-300 p-4">
                        <CardTitle className="text-xl font-bold text-gray-600">
                          Leads
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-center py-8">
                          {/* Donut Chart Representation */}
                          <div className="relative w-48 h-48">
                            <svg
                              width="192"
                              height="192"
                              className="transform -rotate-90"
                            >
                              <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="15"
                              />
                              <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="15"
                                strokeDasharray={`${Math.round(
                                  ((dashboardData.dashboard[0]?.pending_lead ||
                                    0) /
                                    (dashboardData.dashboard[0]?.total_lead ||
                                      1)) *
                                    502
                                )} ${
                                  502 -
                                  Math.round(
                                    ((dashboardData.dashboard[0]
                                      ?.pending_lead || 0) /
                                      (dashboardData.dashboard[0]?.total_lead ||
                                        1)) *
                                      502
                                  )
                                }`}
                                strokeLinecap="round"
                              />
                              <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="none"
                                stroke="#93c5fd"
                                strokeWidth="15"
                                strokeDasharray={`${
                                  502 -
                                  Math.round(
                                    ((dashboardData.dashboard[0]
                                      ?.pending_lead || 0) /
                                      (dashboardData.dashboard[0]?.total_lead ||
                                        1)) *
                                      502
                                  )
                                } ${Math.round(
                                  ((dashboardData.dashboard[0]?.pending_lead ||
                                    0) /
                                    (dashboardData.dashboard[0]?.total_lead ||
                                      1)) *
                                    502
                                )}`}
                                strokeDashoffset={
                                  -Math.round(
                                    ((dashboardData.dashboard[0]
                                      ?.pending_lead || 0) /
                                      (dashboardData.dashboard[0]?.total_lead ||
                                        1)) *
                                      502
                                  )
                                }
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="px-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span>
                                Pending Lead (
                                {dashboardData.dashboard[0]?.pending_lead || 0})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                              <span>
                                Inquired Lead (
                                {(dashboardData.dashboard[0]?.total_lead || 0) -
                                  (dashboardData.dashboard[0]?.pending_lead ||
                                    0)}
                                )
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardContent className="border-t border-gray-300 p-4">
                        <Button onClick={() => router.push("/leads")} className="w-full bg-blue-200 hover:bg-blue-300 text-black">
                          View All Leads
                        </Button>
                      </CardContent>
                    </>
                  )}
                </Card>

                {/* Quotations Card */}
                <Card className="w-full rounded-sm p-0 shadow-lg border border-gray-300 bg-gray-100">
                  {isLoading && !isError ? (
                    <CardContent className="flex items-center justify-start gap-2 p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Fetching</span>
                    </CardContent>
                  ) : (
                    <>
                      <CardHeader className="border-b border-gray-300 p-4">
                        <CardTitle className="text-xl font-bold text-gray-600">
                          Quotations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-center py-8">
                          {/* Donut Chart Representation */}
                          <div className="relative w-48 h-48">
                            <svg
                              width="192"
                              height="192"
                              className="transform -rotate-90"
                            >
                              <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="15"
                              />
                              <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="none"
                                stroke="#84cc16"
                                strokeWidth="15"
                                strokeDasharray={`${Math.round(
                                  ((dashboardData.dashboard[0]
                                    ?.pending_quotation || 0) /
                                    (dashboardData.dashboard[0]
                                      ?.total_quotation || 1)) *
                                    502
                                )} ${
                                  502 -
                                  Math.round(
                                    ((dashboardData.dashboard[0]
                                      ?.pending_quotation || 0) /
                                      (dashboardData.dashboard[0]
                                        ?.total_quotation || 1)) *
                                      502
                                  )
                                }`}
                                strokeLinecap="round"
                              />
                              <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="15"
                                strokeDasharray={`${
                                  502 -
                                  Math.round(
                                    ((dashboardData.dashboard[0]
                                      ?.pending_quotation || 0) /
                                      (dashboardData.dashboard[0]
                                        ?.total_quotation || 1)) *
                                      502
                                  )
                                } ${Math.round(
                                  ((dashboardData.dashboard[0]
                                    ?.pending_quotation || 0) /
                                    (dashboardData.dashboard[0]
                                      ?.total_quotation || 1)) *
                                    502
                                )}`}
                                strokeDashoffset={
                                  -Math.round(
                                    ((dashboardData.dashboard[0]
                                      ?.pending_quotation || 0) /
                                      (dashboardData.dashboard[0]
                                        ?.total_quotation || 1)) *
                                      502
                                  )
                                }
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="px-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
                              <span>
                                Pending Quotations (
                                {dashboardData.dashboard[0]
                                  ?.pending_quotation || 0}
                                )
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>
                                Order Send (
                                {(dashboardData.dashboard[0]?.total_quotation ||
                                  0) -
                                  (dashboardData.dashboard[0]
                                    ?.pending_quotation || 0)}
                                )
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardContent className="border-t border-gray-300 p-4">
                        <Button onClick={() => router.push("/followups")} className="w-full bg-green-300 hover:bg-green-400 text-black">
                          View All Quotations
                        </Button>
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>

              {/* Upcoming Reminders Card */}
              <Card className=" rounded-sm shadow-lg p-0 border border-gray-300 bg-gray-100">
                {isLoading && !isError ? (
                  <CardContent className="flex items-center justify-start gap-2 p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching</span>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="border-b border-gray-300 p-4">
                      <CardTitle className="text-xl font-bold text-gray-600">
                        Upcoming Reminders (Next 3 days)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3 mb-4">
                        {dashboardData.leadReminders &&
                        dashboardData.leadReminders.length > 0
                          ? dashboardData.leadReminders
                              .slice(0, 3)
                              .map((reminder, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-600" />
                                    <div>
                                      <div className="text-sm font-medium">
                                        Lead Follow-up
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Reminder #{index + 1}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Due Soon
                                  </div>
                                </div>
                              ))
                          : null}

                        {dashboardData.quotationReminders &&
                        dashboardData.quotationReminders.length > 0
                          ? dashboardData.quotationReminders
                              .slice(0, 3)
                              .map((reminder, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-gray-600" />
                                    <div>
                                      <div className="text-sm font-medium">
                                        Quotation Review
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Reminder #{index + 1}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Due Soon
                                  </div>
                                </div>
                              ))
                          : null}

                        {(!dashboardData.leadReminders ||
                          dashboardData.leadReminders.length === 0) &&
                          (!dashboardData.quotationReminders ||
                            dashboardData.quotationReminders.length === 0) && (
                            <div className="text-center py-4">
                              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">
                                No upcoming reminders
                              </p>
                            </div>
                          )}
                      </div>
                    </CardContent>
                    <CardContent className="border-t border-gray-300 p-4">
                      <Button className="w-full bg-gray-300 hover:bg-gray-400 text-black">
                        View All Tasks
                      </Button>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 
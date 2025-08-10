"use client";

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

export default function DashboardPage() {
  const { user } = useUserStore();

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
        <header className="flex h-16 shrink-0 items-center gap-2">
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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Revenue</h3>
                <p className="text-2xl font-bold">₹2,45,678</p>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Active Users</h3>
                <p className="text-2xl font-bold">567</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Welcome back, {user.data.name}!</h2>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your {user.data.company} account today.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-background rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">New order received</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">Inventory updated</span>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Report generated</span>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-background rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Orders</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Stock Items</span>
                    <span className="font-medium">8</span>
                  </div>
                                     <div className="flex justify-between">
                     <span className="text-sm">Today&apos;s Sales</span>
                     <span className="font-medium">₹45,230</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/store"
import { useLogout } from "@/hooks/useAuth"
import { 
  Home, 
  Wallet, 
  ListChecks, 
  Users, 
  LogOut,
  Building2 
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Followups",
    url: "/followups",
    icon: ListChecks,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: Wallet,
  },
]

export function AppSidebar() {
  const user = useUserStore((state) => state.user)
  const logout = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Building2 className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Prashant Group</span>
            <span className="text-xs text-muted-foreground">
              {user?.data.company}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-2">
          {user && (
            <div className="mb-3">
              <div className="text-sm font-medium">{user.data.name}</div>
              <div className="text-xs text-muted-foreground">
                @{user.data.username}
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

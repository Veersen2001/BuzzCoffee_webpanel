import * as React from "react"
import dasboardMenuItems from '@/panel/restaurant/common/menu-items';
import {

  ChefHat,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"



export function CustomSidebar({
  ...props
}) {
  return (
    (<Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">

                  <ChefHat className="size-4"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Coffee House</span>
                  <span className="truncate text-xs">By Buzz coffee</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dasboardMenuItems.navMain} />
        <NavProjects projects={dasboardMenuItems.projects} />
       
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dasboardMenuItems.user} />
      </SidebarFooter>
    </Sidebar>)
  );
}

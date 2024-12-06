import {
  BadgeIndianRupee,
  BookOpen,
  ChefHat,
  ClockArrowDown,
  HandPlatter,
  LifeBuoy,
  PieChart,
  SquarePlus,
  SquareTerminal,
  Users,
  Volleyball,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Amit",
    email: "m@example.com",
    avatar: "/avatars/man.png",
  },
  navMain: [
    {
      title: "Dashborad",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: PieChart,
    },
    {
      title: "POS",
      url: "#",
      icon: SquarePlus,
      items: [
        {
          title: "All POS List",
          url: "#",
        },
        {
          title: "Add POS",
          url: "#",
        },
      ],
    },
    {
      title: "Order Management",
      url: "#",
      icon: ClockArrowDown,
      items: [
        {
          title: "All Order",
          url: "/restaurant/dashboard/order/all",
        },
        {
          title: "Processing Order",
          url: "/restaurant/dashboard/order/processing",
        },
        {
          title: "Pending Order",
          url: "/restaurant/dashboard/order/pending",
        },

        {
          title: "Delivered Order",
          url: "/restaurant/dashboard/order/delivered",
        },
        {
          title: "Cancel Order",
          url: "/restaurant/dashboard/order/cancel",
        },
      ],
    },
    {
      title: "Inventory Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Inventory",
          url: "#",
        },
        {
          title: "Add menu item ",
          url: "#",
        },

        {
          title: "Bulk Import",
          url: "#",
        },
        {
          title: "Bulk Export",
          url: "#",
        },
      ],
    },
    {
      title: "Specific promotions",
      url: "#",
      icon: Volleyball,
    },
    {
      title: "Marketing & Coupons",
      url: "#",
      icon: BadgeIndianRupee,
    },
    {
      title: "Customer Feedback",
      url: "#",
      icon: LifeBuoy,
    },
  ],

  projects: [
    {
      name: "Restaurant",
      url: "#",
      icon: HandPlatter,
    },
    {
      name: "Staff",
      url: "#",
      icon: Users,
    },
  ],
};

export function RestaurantSidebar({ ...props }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ChefHat className="size-4" />
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

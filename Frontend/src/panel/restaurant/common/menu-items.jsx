import React from 'react'
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    ChefHat,
    SquareTerminal,
    BadgeIndianRupee,
    Volleyball ,
    SquarePlus ,
    ClipboardMinus,
    ClockArrowDown,
    HandPlatter,
    Users,
  } from "lucide-react"
  

const dasboardMenuItems = {
    user: {
      name: "Amit",
      email: "m@example.com",
      avatar: "/avatars/man.png",
    },
    navMain: [
      {
        title: "Dashborad",
        url: "/restaurant/dashboard",
        icon: SquareTerminal,
        isActive: true,
       
      },
      {
        title: "Reports & Analytics",
        url: "/restaurant/report",
        icon: PieChart,
  
       
      },
      {
        title: "POS",
        url: "/restaurant/pos/all",
        icon: SquarePlus,

      },
      // {
      //   title: "POS",
      //   url: "#",
      //   icon: SquarePlus,
      //   items: [
      //     {
      //       title: "All POS List",
      //       url: "/restaurant/pos/all",
      //     },
      //     // {
      //     //   title: "Add POS",
      //     //   url: "#",
      //     // },
          
      //   ],
      // },
      {
        title: "Order Management",
        url: "#",
        icon: ClockArrowDown,
        items: [
          {
            title: "All Order",
            url: "/restaurant/order/all",
          },
          {
            title: "Processing Order",
            url: "/restaurant/order/processing",
          },
          {
            title: "Preparing Order",
            url: "/restaurant/order/preparing",
          },
        
          {
            title: "Delivered Order",
            url: "/restaurant/order/delivered",
          },
          {
            title: "Cancel Order",
            url: "/restaurant/order/cancel",
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
            url: "/restaurant/inventory/all",
          },
          {
            title: "Add menu item ",
            url: "/restaurant/inventory/addmenu",
          },
          {
            title: "Addons ",
            url: "/restaurant/inventory/addons",
          },
        
          // {
          //   title: "Bulk Import",
          //   url: "/restaurant/inventory/import",
          // },
          // {
          //   title: "Bulk Export",
          //   url: "/restaurant/inventory/export",
          // },
        ],
      },
      // {
      //   title: "Specific promotions",
      //   url: "#",
      //   icon: Volleyball,
  
       
      // },
      {
        title: "Marketing & Coupons",
        url: "/restaurant/coupon/all",
        icon: BadgeIndianRupee,
     
      },
      {
        title: "Customer Feedback",
        url: "/restaurant/feedback",
        icon: LifeBuoy,
     
      },
    ],
   
    projects: [
      {
        name: "Restaurant",
        url: '/restaurant/setting',
        icon: HandPlatter,
      },
      {
        name: "Staff",
        url: "#",
        icon: Users,
      },
     
    ],
  };

  export default  dasboardMenuItems;
import {CustomSidebar}  from "@/panel/restaurant/common/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <SidebarProvider>
      <CustomSidebar />
      <SidebarInset>
        <header className="flex shrink-0 items-center gap-2 ">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="-ml-1 mt-1" />
            <Separator orientation="vertical" className="mr-2 h-10" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage></BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

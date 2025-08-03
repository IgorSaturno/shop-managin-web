import {
  ChartSpline,
  CircleUserRound,
  List,
  PackageSearch,
  Settings,
  ShoppingBag,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: ChartSpline,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    url: "/products",
    icon: PackageSearch,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: List,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "User",
    url: "/user",
    icon: CircleUserRound,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="flex h-full flex-col justify-between">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Vibrante</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}

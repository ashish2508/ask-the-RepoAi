"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import {
  Bot,
  CreditCard,
  LayoutDashboard,
  PlusIcon,
  Presentation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSideBar() {
  const pathname = usePathname();
  const {open} = useSidebar();
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Q&A",
      url: "/qa",
      icon: Bot,
    },
    {
      title: "Meetings",
      url: "/meetings",
      icon: Presentation,
    },
    {
      title: "Billing",
      url: "/billing",
      icon: CreditCard,
    },
  ];

  const projects = [
    {
      name: "Project 1",
    },
    {
      name: "Project 2",
    },
    {
      name: "Project 3",
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="item flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
            className="rounded-lg transition-all duration-300 group-hover:brightness-110"  
          />
          {open && (
            <h1 className="text-primary/80 text-xl font-bold">
              Ask RepoAi
            </h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          {
                            "!bg-primary !text-white no-underline":
                              pathname === item.url,
                          },
                          "list-none",
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div className="cursor-pointer">
                        <div
                          className={cn(
                            "text-primary hover:shadow-primary/60 flex size-7 items-center justify-center rounded-sm border bg-white transition-all duration-300 hover:scale-125 hover:shadow-xl hover:brightness-110",
                            {
                              "bg-primary text-white hover:shadow-white/60":
                                true,
                            },
                          )}
                        >
                          {project.name[0]}
                        </div>

                        <span>{project.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            <div className="h-2"></div>
            <div
              className={cn(
                open ? "flex justify-start px-2" : "flex justify-center",
              )}
            >
              <Link href="/create">
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "flex items-center justify-center gap-2 transition-all",
                    !open && "w-9 p-0",
                  )}
                >
                  <PlusIcon className="size-4" />
                  {open && <span>Create New Project</span>}
                </Button>
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

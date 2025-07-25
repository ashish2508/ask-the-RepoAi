"use client";

import { Button } from "@/components/ui/button";
import MagneticWrapper from "@/components/ui/magnetic-wrapper";
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
import useProject from "@/hooks/use-project";
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
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();

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

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="item flex items-center gap-2">
          <MagneticWrapper>
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={40}
              height={40}
              priority
              className="rounded-lg transition-all duration-300 group-hover:brightness-110"
            />
          </MagneticWrapper>
          {open && (
            <h1 className="text-primary/80 text-xl font-bold">Ask RepoAi</h1>
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
              {projects?.map((project) => {
                return (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <div
                        className={cn(
                          "cursor-pointer",
                          !open && "w-full px-1"
                        )}
                        onClick={() => setProjectId(project.id)}
                      >
                        <div
                          className={cn(
                            "text-primary hover:shadow-primary/60 flex size-7 items-center justify-center rounded-sm border bg-white ",
                            {
                              "bg-primary text-white hover:shadow-white/60":
                                project.id === projectId,
                            },
                            open ? "size-7" : "min-w-full h-7"
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
                    "flex cursor-pointer items-center justify-center gap-2 transition-all",
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

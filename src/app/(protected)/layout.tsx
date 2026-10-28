import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { UserButton } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { AppSideBar } from "./app-sidebar";

type Props = {
  children: ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="min-h-screen w-full bg-background p-0 md:p-4">
        <div className="border-sidebar-border bg-sidebar/90 sticky top-0 z-20 flex items-center gap-3 border-b p-3 px-4 shadow-sm backdrop-blur-xl md:top-4 md:border">
          <SidebarTrigger aria-label="Toggle navigation" />
          <div className="hidden text-xs font-medium text-muted-foreground sm:block">Repository workbench</div>
          <div className="ml-auto flex-1"></div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
        <div className="border-sidebar-border bg-sidebar/70 min-h-[calc(100vh-4rem)] overflow-y-auto border-x p-5 md:mt-4 md:min-h-[calc(100vh-6.5rem)] md:border md:p-7">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;

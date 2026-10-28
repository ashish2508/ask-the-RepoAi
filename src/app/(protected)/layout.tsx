import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { AppSideBar } from "./app-sidebar";
import { ThemeToggle } from "@/components/ui/themeToggle";

type Props = {
  children: ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="min-h-screen w-full p-3 md:p-5">
        <div className="border-sidebar-border bg-sidebar/85 sticky top-3 z-20 flex items-center gap-2 rounded-2xl border p-3 px-4 shadow-sm backdrop-blur-xl">
          {/* <SearchBar /> */}
          <div className="ml-auto"></div>
          <div className="flex-1"></div>
          {/* <ThemeToggle /> */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
        <div className="border-sidebar-border bg-sidebar/70 mt-4 min-h-[calc(100vh-6.5rem)] overflow-y-auto rounded-2xl border p-5 shadow-sm md:p-7">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;

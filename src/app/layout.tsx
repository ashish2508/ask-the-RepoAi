import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Ask the repoAi",
  description: "helps you chat to your repo",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [neobrutalism],
        signIn: { baseTheme: neobrutalism },
        signUp: { baseTheme: neobrutalism },
        
      }}
    >
      <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
        <body suppressHydrationWarning>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { CSSProperties } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DemoFooter } from "@/components/dashboard-ui";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Infradash — A clearer view of your GitLab",
    template: "%s · Infradash",
  },
  description:
    "A calm control room for your GitLab infrastructure. Explore users, runners, and upgrade readiness in a fully simulated workspace.",
  applicationName: "Infradash",
  icons: { icon: "/infradash-codexend/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <TooltipProvider>
          <SidebarProvider
            style={{ "--sidebar-width": "248px" } as CSSProperties}
          >
            <AppSidebar />
            <SidebarInset className="app-main">
              <SiteHeader />
              <main id="main-content" className="page-content" tabIndex={-1}>
                {children}
                <DemoFooter />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
        <Toaster position="bottom-right" richColors closeButton theme="light" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
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

const korean = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Infradash — GitLab 인프라를 한눈에",
    template: "%s · Infradash",
  },
  description:
    "GitLab 인프라를 한눈에 살피는 대시보드. 데모 워크스페이스에서 사용자, 러너, 업그레이드 준비 현황을 확인하세요.",
  applicationName: "Infradash",
  icons: { icon: "/infradash-codexend/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${geist.variable} ${mono.variable} ${korean.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          본문으로 바로가기
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
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          theme="light"
          containerAriaLabel="알림 메시지"
          toastOptions={{ closeButtonAriaLabel: "알림 닫기" }}
        />
      </body>
    </html>
  );
}

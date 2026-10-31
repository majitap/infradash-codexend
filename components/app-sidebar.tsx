"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  FlaskConical,
  LayoutDashboard,
  Server,
  Sparkles,
  Users,
  Layers3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigation, workspace } from "@/lib/mock-data";
import { useUpgradeProgress } from "@/hooks/use-upgrade-progress";

const icons = [LayoutDashboard, Users, Server, Layers3];

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { percent } = useUpgradeProgress();
  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };
  return (
    <Sidebar className="app-sidebar" collapsible="offcanvas">
      <SidebarHeader className="sidebar-header">
        <Link
          href="/"
          onClick={closeMobile}
          className="brand-link"
          aria-label="Infradash overview"
        >
          <BrandMark />
          <span>
            infradash<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="workspace-card">
          <span className="workspace-monogram">O</span>
          <div>
            <strong>{workspace.name}</strong>
            <span>Platform workspace</span>
          </div>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <div className="nav-eyebrow">WORKSPACE</div>
        <nav aria-label="Main navigation" className="main-nav">
          {navigation.map((item, index) => {
            const Icon = icons[index];
            const active =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url.replace(/\/$/, ""));
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`nav-link ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={closeMobile}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.title}</span>
                {item.title === "Upgrade" && (
                  <span className="nav-count">{percent}%</span>
                )}
                {active && <span className="nav-active-dot" />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-note">
          <span className="note-icon">
            <Sparkles size={18} />
          </span>
          <strong>
            A little clarity.
            <br />A lot of possibility.
          </strong>
          <p>Your infrastructure, in one calm place.</p>
          <Link href="/upgrade/" onClick={closeMobile}>
            Plan your next upgrade <ArrowUpRight size={16} />
          </Link>
        </div>
      </SidebarContent>
      <SidebarFooter className="sidebar-footer">
        <div className="demo-label">
          <FlaskConical size={15} />
          <span>Demo workspace</span>
          <span className="subtle-dot" />
        </div>
        <div className="sidebar-person">
          <span className="avatar avatar-violet">
            {workspace.person.initials}
          </span>
          <div>
            <strong>{workspace.person.name}</strong>
            <span>{workspace.person.role}</span>
          </div>
          <span className="person-online" title="Demo account" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

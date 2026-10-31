"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Command as CommandIcon,
  Search,
  ShieldCheck,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { attentionItems, navigation, workspace } from "@/lib/mock-data";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const current =
    navigation.find((item) =>
      item.url === "/"
        ? pathname === "/"
        : pathname.startsWith(item.url.replace(/\/$/, "")),
    )?.title ?? "워크스페이스";
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  return (
    <>
      <header className="site-header">
        <div className="breadcrumb">
          <SidebarTrigger className="sidebar-toggle" />
          <span className="breadcrumb-workspace">워크스페이스</span>
          <ChevronRight size={14} className="breadcrumb-workspace" />
          <span>{current}</span>
        </div>
        <div className="header-actions">
          <Button
            variant="ghost"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="페이지 검색"
          >
            <Search size={16} />
            <span>페이지 바로가기...</span>
            <kbd>
              <CommandIcon size={11} /> K
            </kbd>
          </Button>
          <span className="environment">
            <span className="status-dot green" />
            {workspace.environment}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="notification-button"
            aria-label="알림 보기"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell size={18} />
            <span />
          </Button>
          <button
            className="avatar avatar-violet header-avatar"
            aria-label="프로필 보기"
            onClick={() => setProfileOpen(true)}
          >
            {workspace.person.initials}
          </button>
        </div>
      </header>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="search-dialog" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>페이지 바로가기</DialogTitle>
            <DialogDescription>
              이동할 워크스페이스 페이지를 검색하세요.
            </DialogDescription>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="어떤 페이지를 찾으세요?" />
            <CommandList>
              <CommandEmpty>검색된 페이지가 없어요.</CommandEmpty>
              {navigation.map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${item.title} ${item.description}`}
                  onSelect={() => {
                    setSearchOpen(false);
                    router.push(item.url);
                  }}
                >
                  <div className="command-entry">
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                  <ArrowRight size={16} />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="detail-dialog">
          <DialogHeader>
            <DialogTitle>워크스페이스 알림</DialogTitle>
            <DialogDescription>
              데모 데이터 기준으로 확인할 알림 3건입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="notification-list">
            {attentionItems.map((item) => (
              <Link
                href={item.href}
                key={item.kind}
                onClick={() => setNotificationsOpen(false)}
              >
                <span className={`status-dot ${item.severity}`} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="detail-dialog">
          <DialogHeader>
            <DialogTitle>내 워크스페이스 프로필</DialogTitle>
            <DialogDescription>예시로 만든 데모 계정입니다.</DialogDescription>
          </DialogHeader>
          <div className="profile-summary">
            <span className="avatar avatar-violet">
              {workspace.person.initials}
            </span>
            <div>
              <strong>{workspace.person.name}</strong>
              <p>{workspace.person.email}</p>
            </div>
          </div>
          <div className="profile-role">
            <ShieldCheck size={18} />
            <span>
              {workspace.person.role} · {workspace.name}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

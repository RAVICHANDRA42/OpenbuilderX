"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Code,
  Image,
  FileText,
  Workflow,
  BookOpen,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Zap,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/code", label: "Code", icon: Code },
  { href: "/images", label: "Images", icon: Image },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/builder", label: "Builder", icon: Workflow },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/marketplace", label: "Marketplace", icon: Store },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/chat") return pathname === "/chat" || pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col bg-card border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/chat" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">OpenBuilder</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/chat" className="mx-auto">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 py-3 border-t">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Usage
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">API Calls</span>
                <span className="font-medium">145 / 500</span>
              </div>
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "29%" }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">2.1 / 10 GB</span>
              </div>
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-foreground/40 rounded-full"
                  style={{ width: "21%" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={cn("p-3 border-t", collapsed && "flex flex-col items-center gap-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/default.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">
                Pro Plan
              </p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 justify-start text-muted-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}
        {collapsed && (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {collapsed && (
          <Badge variant="secondary" className="text-[10px] px-1 py-0">
            Pro
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 z-40 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}

export { Sidebar };

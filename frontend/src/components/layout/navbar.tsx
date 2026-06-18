"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  User,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

interface NavbarProps {
  onMenuToggle?: () => void;
}

function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex-1 flex items-center gap-4">
        <div
          className="relative hidden md:flex items-center max-w-md flex-1"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-text items-center pl-10">
            <span className="text-muted-foreground">Search...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/default.png" alt="User" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 z-50">
              <div className="rounded-md border bg-popover p-1 shadow-md">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
                <div className="h-px bg-border my-1" />
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/settings?tab=billing"
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
                <div className="h-px bg-border my-1" />
                <button className="flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-lg rounded-lg border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-5 w-5 text-muted-foreground" />
              <Input
                className="border-0 h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Search anything..."
                autoFocus
              />
            </div>
            <div className="p-2">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Quick actions
              </p>
              {["New Chat", "New Code Session", "Generate Image"].map(
                (action) => (
                  <button
                    key={action}
                    className="flex w-full items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                  >
                    {action}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { Navbar };

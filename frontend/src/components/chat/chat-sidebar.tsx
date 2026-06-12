"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateRelative } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ChatSidebarProps) {
  const [search, setSearch] = React.useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card border-r w-72">
      <div className="p-3 border-b space-y-2">
        <Button onClick={onNew} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {search ? "No conversations found" : "No conversations yet"}
          </p>
        ) : (
          filtered.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors",
                activeId === conv.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-muted-foreground hover:text-accent-foreground"
              )}
              onClick={() => onSelect(conv.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{conv.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateRelative(conv.createdAt)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background transition-all"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export { ChatSidebar };

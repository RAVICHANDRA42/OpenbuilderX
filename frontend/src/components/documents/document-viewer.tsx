"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

interface DocumentViewerProps {
  content?: string;
  title?: string;
  totalPages?: number;
}

function DocumentViewer({ content, title, totalPages }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");

  if (!content) {
    return (
      <Card className="h-full">
        <EmptyState
          icon={FileText}
          title="No document selected"
          description="Upload a document or select one from the list to view its contents"
        />
      </Card>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {title || "Document"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-40 pl-8 text-xs"
            />
          </div>
          {totalPages && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="min-w-[60px] text-center text-xs">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {content.split("\n").map((line, i) => {
            if (searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase())) {
              const parts = line.split(new RegExp(`(${searchQuery})`, "gi"));
              return (
                <p key={i} className="mb-1">
                  {parts.map((part, j) =>
                    part.toLowerCase() === searchQuery.toLowerCase() ? (
                      <mark key={j} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
                        {part}
                      </mark>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            }
            return (
              <p key={i} className="mb-1">
                {line || "\u00A0"}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { DocumentViewer };

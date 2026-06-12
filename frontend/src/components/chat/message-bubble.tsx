"use client";

import * as React from "react";
import { Copy, RefreshCw, Check, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateRelative } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
  onRegenerate?: () => void;
}

function MessageBubble({ message, isLast, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("h-8 w-8 shrink-0", isUser && "bg-muted")}>
        <AvatarFallback>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center gap-2 mt-1",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-[11px] text-muted-foreground">
            {formatDateRelative(message.createdAt)}
          </span>

          <div
            className={cn(
              "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            {isLast && !isUser && onRegenerate && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onRegenerate}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MessageBubble };

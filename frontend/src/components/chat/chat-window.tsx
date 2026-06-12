"use client";

import * as React from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Message } from "@/types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (content: string) => void;
  onRegenerate?: () => void;
  className?: string;
}

function ChatWindow({
  messages,
  isLoading,
  onSend,
  onRegenerate,
  className,
}: ChatWindowProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              How can I help you today?
            </h2>
            <p className="text-muted-foreground max-w-md">
              I can help you write code, generate images, analyze documents,
              build workflows, and more.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg w-full">
              {[
                "Write a Python script to analyze CSV data",
                "Generate an image of a futuristic city",
                "Explain quantum computing in simple terms",
                "Help me debug this React component",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSend(suggestion)}
                  className="text-left text-sm p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={
                  index === messages.length - 1 &&
                  message.role === "assistant"
                }
                onRegenerate={onRegenerate}
              />
            ))}
          </>
        )}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="rounded-lg bg-muted p-4">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
}

export { ChatWindow };

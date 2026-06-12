"use client";

import * as React from "react";
import { Send, Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (content: string) => void;
  isLoading?: boolean;
}

function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-[200px] pr-12 resize-none py-3"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        size="icon"
        className="h-[44px] w-[44px] shrink-0"
        disabled={!input.trim() || isLoading}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

export { ChatInput };

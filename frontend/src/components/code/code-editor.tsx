"use client";

import * as React from "react";
import {
  Play,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LanguageSelector } from "@/components/code/language-selector";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  onLanguageChange: (lang: string) => void;
  onRun: () => void;
  isRunning?: boolean;
  readOnly?: boolean;
}

function CodeEditor({
  code,
  language,
  onChange,
  onLanguageChange,
  onRun,
  isRunning,
  readOnly,
}: CodeEditorProps) {
  const [copied, setCopied] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split("\n").length;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden flex flex-col",
        fullscreen && "fixed inset-4 z-50 shadow-2xl"
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <LanguageSelector value={language} onChange={onLanguageChange} />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRun}
            disabled={isRunning || !code.trim()}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 relative">
        <div className="select-none flex flex-col items-end px-3 py-3 text-sm leading-6 text-muted-foreground bg-muted/30 border-r font-mono">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i + 1} className="leading-6">
              {i + 1}
            </span>
          ))}
        </div>
        <Textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-0 rounded-none font-mono text-sm leading-6 resize-none p-3 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[300px]"
          placeholder="Write your code here..."
          spellCheck={false}
          readOnly={readOnly}
          resize="none"
        />
      </div>
    </div>
  );
}

export { CodeEditor };

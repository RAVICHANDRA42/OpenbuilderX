"use client";

import * as React from "react";
import { Copy, Check, AlertCircle, Terminal, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CodeOutputProps {
  output: string;
  error?: string;
  executionTime?: number;
  language?: string;
}

function CodeOutput({ output, error, executionTime, language }: CodeOutputProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!output && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border bg-card">
        <Terminal className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg">No Output Yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Run your code to see the output here
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Output</span>
          {language && (
            <Badge variant="secondary" className="text-[10px]">
              {language}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {executionTime !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {executionTime}ms
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
      <div className="p-4">
        {error && (
          <div className="flex items-start gap-2 mb-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <pre className="text-sm text-destructive whitespace-pre-wrap font-mono">
              {error}
            </pre>
          </div>
        )}
        {output && (
          <pre
            className={cn(
              "text-sm whitespace-pre-wrap font-mono",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}

export { CodeOutput };

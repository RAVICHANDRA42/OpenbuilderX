"use client";

import * as React from "react";
import {
  GripVertical,
  Settings,
  Trash2,
  Plug,
  PlugZap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkflowNodeProps {
  id: string;
  label: string;
  type: string;
  config?: Record<string, unknown>;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onConfigure?: (id: string) => void;
  style?: React.CSSProperties;
}

const typeColors: Record<string, string> = {
  "ai-chat": "border-violet-500/50 bg-violet-500/10",
  "code-exec": "border-blue-500/50 bg-blue-500/10",
  "image-gen": "border-pink-500/50 bg-pink-500/10",
  document: "border-amber-500/50 bg-amber-500/10",
  "data-transform": "border-cyan-500/50 bg-cyan-500/10",
  "api-call": "border-green-500/50 bg-green-500/10",
  condition: "border-orange-500/50 bg-orange-500/10",
  output: "border-emerald-500/50 bg-emerald-500/10",
};

function WorkflowNode({
  id,
  label,
  type,
  selected,
  onSelect,
  onDelete,
  onConfigure,
  style,
}: WorkflowNodeProps) {
  const colorClass = typeColors[type] || "border-gray-500/50 bg-gray-500/10";

  return (
    <div
      className={cn(
        "absolute rounded-lg border-2 p-3 min-w-[160px] cursor-pointer transition-shadow",
        colorClass,
        selected && "ring-2 ring-primary shadow-lg"
      )}
      style={style}
      onClick={() => onSelect?.(id)}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium flex-1 truncate">{label}</span>
        <Badge variant="outline" className="text-[10px] capitalize">
          {type.replace("-", " ")}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <div className="flex items-center gap-1">
          <Plug className="h-3 w-3 text-muted-foreground" />
          <PlugZap className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onConfigure?.(id);
            }}
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { WorkflowNode };

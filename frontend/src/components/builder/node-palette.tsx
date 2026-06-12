"use client";

import * as React from "react";
import {
  MessageSquare,
  Code,
  Image,
  FileText,
  GitBranch,
  Globe,
  ArrowRightLeft,
  Variable,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface NodeType {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const nodeTypes: NodeType[] = [
  {
    type: "ai-chat",
    label: "AI Chat",
    description: "LLM conversation node",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "text-violet-500",
  },
  {
    type: "code-exec",
    label: "Code Exec",
    description: "Execute code in any language",
    icon: <Code className="h-5 w-5" />,
    color: "text-blue-500",
  },
  {
    type: "image-gen",
    label: "Image Gen",
    description: "Generate images from prompts",
    icon: <Image className="h-5 w-5" />,
    color: "text-pink-500",
  },
  {
    type: "document",
    label: "Document",
    description: "Process and analyze docs",
    icon: <FileText className="h-5 w-5" />,
    color: "text-amber-500",
  },
  {
    type: "data-transform",
    label: "Data Transform",
    description: "Transform data between formats",
    icon: <ArrowRightLeft className="h-5 w-5" />,
    color: "text-cyan-500",
  },
  {
    type: "api-call",
    label: "API Call",
    description: "Make HTTP requests",
    icon: <Globe className="h-5 w-5" />,
    color: "text-green-500",
  },
  {
    type: "condition",
    label: "Condition",
    description: "Branch logic with conditions",
    icon: <GitBranch className="h-5 w-5" />,
    color: "text-orange-500",
  },
  {
    type: "variable",
    label: "Variable",
    description: "Store and reference values",
    icon: <Variable className="h-5 w-5" />,
    color: "text-teal-500",
  },
  {
    type: "output",
    label: "Output",
    description: "Final workflow output",
    icon: <Workflow className="h-5 w-5" />,
    color: "text-emerald-500",
  },
];

interface NodePaletteProps {
  onDragStart: (type: string, label: string) => void;
}

function NodePalette({ onDragStart }: NodePaletteProps) {
  const handleDragStart =
    (type: string, label: string) => (e: React.DragEvent) => {
      e.dataTransfer.setData("application/json", JSON.stringify({ type, label }));
      onDragStart(type, label);
    };

  return (
    <div className="w-64 bg-card border-r p-3 overflow-y-auto">
      <h3 className="text-sm font-medium mb-3">Nodes</h3>
      <div className="space-y-1">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={handleDragStart(node.type, node.label)}
            className="flex items-center gap-3 p-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-accent transition-colors group"
          >
            <div className={cn("shrink-0", node.color)}>{node.icon}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{node.label}</p>
              <p className="text-xs text-muted-foreground truncate">
                {node.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { NodePalette, type NodeType };

"use client";

import * as React from "react";
import { Plus, Play, Save, Download, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WorkflowNode } from "@/components/builder/workflow-node";

interface CanvasNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  config?: Record<string, unknown>;
}

interface WorkflowCanvasProps {
  nodes: CanvasNode[];
  selectedId?: string;
  onAddNode: (type: string, label: string, position: { x: number; y: number }) => void;
  onSelectNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onConfigureNode: (id: string) => void;
  onSave: () => void;
  onRun: () => void;
  onClear: () => void;
}

function WorkflowCanvas({
  nodes,
  selectedId,
  onAddNode,
  onSelectNode,
  onDeleteNode,
  onConfigureNode,
  onSave,
  onRun,
  onClear,
}: WorkflowCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      onAddNode(data.type, data.label, {
        x: e.clientX - rect.left - 80,
        y: e.clientY - rect.top - 40,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <h3 className="text-sm font-medium">Workflow Canvas</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={onRun}
            disabled={nodes.length === 0}
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={onSave}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={onClear}
            disabled={nodes.length === 0}
          >
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/50 to-background"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="rounded-full bg-muted p-4 mb-3 mx-auto w-fit">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Drag nodes from the palette to start building
              </p>
            </div>
          </div>
        )}

        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            id={node.id}
            label={node.label}
            type={node.type}
            config={node.config}
            selected={node.id === selectedId}
            onSelect={onSelectNode}
            onDelete={onDeleteNode}
            onConfigure={onConfigureNode}
            style={{
              left: node.position.x,
              top: node.position.y,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export { WorkflowCanvas };

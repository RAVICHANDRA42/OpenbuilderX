"use client";

import * as React from "react";
import { WorkflowCanvas } from "@/components/builder/workflow-canvas";
import { NodePalette } from "@/components/builder/node-palette";
import { generateId } from "@/lib/utils";

interface CanvasNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  config?: Record<string, unknown>;
}

function BuilderPage() {
  const [nodes, setNodes] = React.useState<CanvasNode[]>([
    {
      id: "node-1",
      type: "ai-chat",
      label: "Chat Input",
      position: { x: 80, y: 80 },
    },
    {
      id: "node-2",
      type: "code-exec",
      label: "Process Data",
      position: { x: 320, y: 80 },
    },
    {
      id: "node-3",
      type: "output",
      label: "Final Output",
      position: { x: 560, y: 80 },
    },
  ]);
  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  const handleAddNode = (
    type: string,
    label: string,
    position: { x: number; y: number }
  ) => {
    const newNode: CanvasNode = {
      id: generateId(),
      type,
      label,
      position,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleSelectNode = (id: string) => {
    setSelectedId(id);
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId(undefined);
  };

  const handleConfigureNode = (id: string) => {
    console.log("Configure node:", id);
  };

  const handleSave = () => {
    console.log("Workflow saved:", nodes);
  };

  const handleRun = () => {
    console.log("Running workflow:", nodes);
  };

  const handleClear = () => {
    setNodes([]);
    setSelectedId(undefined);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-4 lg:-m-6">
      <NodePalette onDragStart={() => {}} />
      <WorkflowCanvas
        nodes={nodes}
        selectedId={selectedId}
        onAddNode={handleAddNode}
        onSelectNode={handleSelectNode}
        onDeleteNode={handleDeleteNode}
        onConfigureNode={handleConfigureNode}
        onSave={handleSave}
        onRun={handleRun}
        onClear={handleClear}
      />
    </div>
  );
}

export default BuilderPage;

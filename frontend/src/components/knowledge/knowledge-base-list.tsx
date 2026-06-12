"use client";

import * as React from "react";
import {
  Plus,
  Search,
  BookOpen,
  MoreHorizontal,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateRelative } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  createdAt: string;
}

interface KnowledgeBaseListProps {
  bases: KnowledgeBase[];
  activeId?: string;
  onSelect: (id: string) => void;
  onCreate: (name: string, description: string) => void;
  onDelete: (id: string) => void;
}

function KnowledgeBaseList({
  bases,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: KnowledgeBaseListProps) {
  const [search, setSearch] = React.useState("");
  const [showCreate, setShowCreate] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");

  const filtered = bases.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim(), newDesc.trim());
    setNewName("");
    setNewDesc("");
    setShowCreate(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge bases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No knowledge bases"
            description={
              search
                ? "No results found"
                : "Create your first knowledge base to get started"
            }
            action={
              !search
                ? {
                    label: "Create Knowledge Base",
                    onClick: () => setShowCreate(true),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid gap-3">
            {filtered.map((kb) => (
              <Card
                key={kb.id}
                className={cn(
                  "p-4 cursor-pointer transition-colors hover:bg-accent/50",
                  activeId === kb.id && "border-primary"
                )}
                onClick={() => onSelect(kb.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{kb.name}</h3>
                      {kb.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {kb.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {kb.documentCount} documents
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDateRelative(kb.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(kb.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={showCreate} onOpenChange={setShowCreate}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create Knowledge Base</ModalTitle>
            <ModalDescription>
              Create a new knowledge base to store and organize your documents.
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="My Knowledge Base"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Brief description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export { KnowledgeBaseList };

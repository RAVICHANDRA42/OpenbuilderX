"use client";

import * as React from "react";
import {
  FileText,
  Search,
  Plus,
  MessageSquare,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateRelative } from "@/lib/utils";

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface KnowledgeBaseViewProps {
  documents: KnowledgeDocument[];
  onAddDocument: () => void;
  onDeleteDocument: (id: string) => void;
  onQuery: (query: string) => void;
  queryResult?: string;
  isQuerying?: boolean;
}

function KnowledgeBaseView({
  documents,
  onAddDocument,
  onDeleteDocument,
  onQuery,
  queryResult,
  isQuerying,
}: KnowledgeBaseViewProps) {
  const [query, setQuery] = React.useState("");

  const handleQuery = () => {
    if (!query.trim()) return;
    onQuery(query.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Documents</h2>
        <Button onClick={onAddDocument} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Add documents to your knowledge base to query them"
          action={{
            label: "Add Document",
            onClick: onAddDocument,
          }}
        />
      ) : (
        <div className="grid gap-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateRelative(doc.createdAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive shrink-0"
                  onClick={() => onDeleteDocument(doc.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Query Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            />
            <Button onClick={handleQuery} disabled={!query.trim() || isQuerying}>
              {isQuerying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Ask"
              )}
            </Button>
          </div>
          {queryResult && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm">{queryResult}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { KnowledgeBaseView };

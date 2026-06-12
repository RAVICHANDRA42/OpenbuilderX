"use client";

import * as React from "react";
import { KnowledgeBaseList } from "@/components/knowledge/knowledge-base-list";
import { KnowledgeBaseView } from "@/components/knowledge/knowledge-base-view";
import { generateId } from "@/lib/utils";

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  createdAt: string;
}

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const sampleBases: KnowledgeBase[] = [
  {
    id: "kb-1",
    name: "Product Documentation",
    description: "All product guides and manuals",
    documentCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "kb-2",
    name: "Research Papers",
    description: "AI/ML research paper summaries",
    documentCount: 8,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const sampleDocs: KnowledgeDocument[] = [
  {
    id: "doc-1",
    title: "Getting Started Guide",
    content: "Step-by-step guide for new users...",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doc-2",
    title: "API Reference",
    content: "Complete API documentation...",
    createdAt: new Date().toISOString(),
  },
];

function KnowledgePage() {
  const [bases, setBases] = React.useState(sampleBases);
  const [activeBase, setActiveBase] = React.useState<string>("kb-1");
  const [documents, setDocuments] = React.useState(sampleDocs);
  const [queryResult, setQueryResult] = React.useState("");

  const handleCreate = (name: string, description: string) => {
    const newBase: KnowledgeBase = {
      id: generateId(),
      name,
      description,
      documentCount: 0,
      createdAt: new Date().toISOString(),
    };
    setBases((prev) => [...prev, newBase]);
  };

  const handleDelete = (id: string) => {
    setBases((prev) => prev.filter((b) => b.id !== id));
    if (activeBase === id) {
      setActiveBase(bases[0]?.id || "");
    }
  };

  const handleAddDocument = () => {
    const newDoc: KnowledgeDocument = {
      id: generateId(),
      title: `Document ${documents.length + 1}`,
      content: "New document content...",
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleQuery = (query: string) => {
    setQueryResult(
      `Based on the documents in this knowledge base, here's what I found about "${query}":\n\nThe information you're looking for can be found across multiple documents. Key insights include relevant data points and connections between different topics that address your question comprehensively.`
    );
  };

  const activeBaseData = bases.find((b) => b.id === activeBase);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Knowledge Base</h1>

      {activeBaseData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <KnowledgeBaseList
              bases={bases}
              activeId={activeBase}
              onSelect={setActiveBase}
              onCreate={handleCreate}
              onDelete={handleDelete}
            />
          </div>
          <div className="lg:col-span-2">
            <KnowledgeBaseView
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              onQuery={handleQuery}
              queryResult={queryResult}
            />
          </div>
        </div>
      ) : (
        <KnowledgeBaseList
          bases={bases}
          activeId={activeBase}
          onSelect={setActiveBase}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default KnowledgePage;

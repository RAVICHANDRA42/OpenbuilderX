"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { DocumentAnalyzer } from "@/components/documents/document-analyzer";
import type { DocumentAnalysis } from "@/types";

function DocumentsPage() {
  const [activeDoc, setActiveDoc] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<DocumentAnalysis | undefined>();

  const handleUpload = (file: File) => {
    setActiveDoc(file.name);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis({
        summary:
          "This document provides a comprehensive overview of the key concepts and methodologies used in modern AI development. It covers fundamental principles, advanced techniques, and practical applications across various domains.",
        keyPoints: [
          "AI development requires a solid understanding of machine learning fundamentals",
          "Data quality and preprocessing are critical for model performance",
          "Modern AI systems leverage transformer architectures for natural language tasks",
          "Ethical considerations and bias mitigation are essential in AI deployment",
        ],
        sentiment: "positive",
        topics: [
          "Machine Learning",
          "Deep Learning",
          "NLP",
          "Data Science",
          "AI Ethics",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleAskQuestion = (question: string) => {
    console.log("Question asked:", question);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Documents</h1>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <DocumentUpload onUpload={handleUpload} />
        </TabsContent>

        <TabsContent value="view" className="mt-4">
          <DocumentViewer
            content={
              activeDoc
                ? `# Document Analysis\n\nThis is a sample document content that demonstrates the viewer.\n\n## Key Sections\n\n1. Introduction to AI-powered document analysis\n2. How machine learning models process text\n3. Extracting meaningful insights from documents\n4. Building knowledge bases from analyzed content\n\nThe future of document processing is here with OpenBuilder.`
                : undefined
            }
            title={activeDoc || undefined}
            totalPages={3}
          />
        </TabsContent>

        <TabsContent value="analyze" className="mt-4">
          <DocumentAnalyzer
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
            onAskQuestion={handleAskQuestion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DocumentsPage;

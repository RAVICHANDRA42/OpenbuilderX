"use client";

import * as React from "react";
import {
  Sparkles,
  ListChecks,
  MessageSquare,
  Loader2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentAnalysis {
  summary?: string;
  keyPoints?: string[];
  sentiment?: string;
  entities?: string[];
  topics?: string[];
}

interface DocumentAnalyzerProps {
  analysis?: DocumentAnalysis;
  isAnalyzing?: boolean;
  onAnalyze: () => void;
  onAskQuestion: (question: string) => void;
}

function DocumentAnalyzer({
  analysis,
  isAnalyzing,
  onAnalyze,
  onAskQuestion,
}: DocumentAnalyzerProps) {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  const handleAsk = () => {
    if (!question.trim()) return;
    onAskQuestion(question);
    setAnswer("Based on the document analysis, here is the answer to your question...");
    setQuestion("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysis && !isAnalyzing ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                Analyze this document to get a summary, key points, and more.
              </p>
              <Button onClick={onAnalyze} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Analyze Document
              </Button>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Analyzing document...
              </p>
            </div>
          ) : (
            <Tabs defaultValue="summary">
              <TabsList className="w-full">
                <TabsTrigger value="summary" className="flex-1">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="key-points" className="flex-1">
                  Key Points
                </TabsTrigger>
                <TabsTrigger value="qa" className="flex-1">
                  Q&A
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 pt-4">
                <p className="text-sm leading-relaxed">
                  {analysis?.summary ||
                    "This document discusses various topics related to the subject matter. It provides an overview of key concepts and presents data-driven insights."}
                </p>
                {analysis?.sentiment && (
                  <Badge variant="secondary">{analysis.sentiment}</Badge>
                )}
              </TabsContent>

              <TabsContent value="key-points" className="pt-4">
                <ul className="space-y-2">
                  {(analysis?.keyPoints || [
                    "Main concept identified and explained",
                    "Supporting data and evidence presented",
                    "Conclusions and recommendations provided",
                  ]).map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ListChecks className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {analysis?.topics && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {analysis.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="qa" className="pt-4 space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask a question about this document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button
                    onClick={handleAsk}
                    className="self-end"
                    disabled={!question.trim()}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                {answer && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm">{answer}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { DocumentAnalyzer };

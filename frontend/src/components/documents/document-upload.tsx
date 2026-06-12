"use client";

import * as React from "react";
import {
  Upload,
  File,
  X,
  FileText,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";

const acceptedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/json",
  "text/markdown",
];

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "done" | "error";
}

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

function DocumentUpload({ onUpload, isUploading }: DocumentUploadProps) {
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((f) =>
      acceptedTypes.includes(f.type)
    );
    if (validFiles.length === 0) return;

    const uploadEntries: UploadFile[] = validFiles.map((f) => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      size: f.size,
      type: f.type,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...uploadEntries]);

    validFiles.forEach((f, i) => {
      onUpload(f);
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((uf) =>
            uf.id === uploadEntries[i].id
              ? { ...uf, status: "done" as const, progress: 100 }
              : uf
          )
        );
      }, 1000);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />;
    if (type.includes("spreadsheet") || type.includes("csv"))
      return <FileSpreadsheet className="h-4 w-4" />;
    if (type.includes("zip") || type.includes("rar"))
      return <FileArchive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          className="hidden"
          onChange={handleFileInput}
        />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium mb-1">
          Drop files here or click to upload
        </h3>
        <p className="text-sm text-muted-foreground">
          Supported: PDF, DOCX, TXT, CSV, JSON, MD
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
              <Badge
                variant={
                  file.status === "done"
                    ? "default"
                    : file.status === "error"
                    ? "destructive"
                    : "secondary"
                }
                className="text-[10px]"
              >
                {file.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { DocumentUpload };

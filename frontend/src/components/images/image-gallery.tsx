"use client";

import * as React from "react";
import {
  Download,
  Trash2,
  Edit3,
  Expand,
  X,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Modal,
  ModalContent,
  ModalClose,
} from "@/components/ui/modal";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  width: number;
  height: number;
  createdAt: string;
}

interface ImageGalleryProps {
  images: GeneratedImage[];
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

function ImageGallery({ images, onDownload, onDelete, onEdit }: ImageGalleryProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const expandedImage = images.find((img) => img.id === expandedId);

  if (images.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No images yet"
        description="Generate your first image using the form above"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="group overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setExpandedId(image.id)}
                >
                  <Expand className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onDownload(image.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onEdit(image.id)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm truncate">{image.prompt}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {image.width} x {image.height}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={expandedId !== null} onOpenChange={() => setExpandedId(null)}>
        <ModalContent className="max-w-4xl">
          {expandedImage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {expandedImage.width} x {expandedImage.height}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(expandedImage.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(expandedImage.id)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
              <img
                src={expandedImage.url}
                alt={expandedImage.prompt}
                className="w-full rounded-lg"
              />
              <p className="text-sm text-muted-foreground">
                {expandedImage.prompt}
              </p>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export { ImageGallery };

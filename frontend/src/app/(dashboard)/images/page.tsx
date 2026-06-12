"use client";

import * as React from "react";
import { ImageGenerator } from "@/components/images/image-generator";
import { ImageGallery } from "@/components/images/image-gallery";
import { generateId } from "@/lib/utils";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  width: number;
  height: number;
  createdAt: string;
}

function ImagesPage() {
  const [images, setImages] = React.useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerate = async (params: {
    prompt: string;
    style: string;
    size: string;
    count: number;
  }) => {
    setIsLoading(true);
    const [width, height] = params.size.split("x").map(Number);

    setTimeout(() => {
      const newImages: GeneratedImage[] = Array.from(
        { length: params.count },
        (_, i) => ({
          id: generateId(),
          url: `/api/placeholder/${width}/${height}?text=Generated+Image+${i + 1}`,
          prompt: params.prompt,
          width,
          height,
          createdAt: new Date().toISOString(),
        })
      );
      setImages((prev) => [...newImages, ...prev]);
      setIsLoading(false);
    }, 2000);
  };

  const handleDownload = (id: string) => {
    console.log("Download image:", id);
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleEdit = (id: string) => {
    console.log("Edit image:", id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Image Generation</h1>
      <ImageGenerator onGenerate={handleGenerate} isLoading={isLoading} />
      <ImageGallery
        images={images}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default ImagesPage;

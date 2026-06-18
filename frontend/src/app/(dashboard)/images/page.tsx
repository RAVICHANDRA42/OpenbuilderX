"use client";

import * as React from "react";
import { ImageGenerator } from "@/components/images/image-generator";
import { ImageGallery } from "@/components/images/image-gallery";
import { post } from "@/lib/api-client";
import { generateId } from "@/lib/utils";
import toast from "react-hot-toast";

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

    try {
      const data = await post<{ id: string; url: string; prompt: string; style: string; size: string; created_at: string }>(
        "/images/generate",
        { prompt: params.prompt, style: params.style, size: params.size }
      );
      const newImage: GeneratedImage = {
        id: data.id || generateId(),
        url: data.url || "",
        prompt: data.prompt || params.prompt,
        width,
        height,
        createdAt: data.created_at || new Date().toISOString(),
      };
      setImages((prev) => [newImage, ...prev]);
      toast.success("Image generated successfully!");
    } catch {
      toast.error("Image generation failed. The model may still be loading on first run.");
    }
    setIsLoading(false);
  };

  const handleDownload = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img?.url) window.open(img.url, "_blank");
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

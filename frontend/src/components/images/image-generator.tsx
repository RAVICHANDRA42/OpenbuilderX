"use client";

import * as React from "react";
import { Sparkles, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";

const styles = [
  { value: "realistic", label: "Realistic" },
  { value: "anime", label: "Anime" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "3d", label: "3D Render" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "sketch", label: "Sketch" },
  { value: "watercolor", label: "Watercolor" },
  { value: "digital-art", label: "Digital Art" },
  { value: "cartoon", label: "Cartoon" },
  { value: "cyberpunk", label: "Cyberpunk" },
];

const sizes = [
  { value: "256x256", label: "256 x 256" },
  { value: "512x512", label: "512 x 512" },
  { value: "1024x1024", label: "1024 x 1024" },
  { value: "1024x1792", label: "1024 x 1792 (Portrait)" },
  { value: "1792x1024", label: "1792 x 1024 (Landscape)" },
];

interface ImageGeneratorProps {
  onGenerate: (params: {
    prompt: string;
    style: string;
    size: string;
    count: number;
  }) => void;
  isLoading?: boolean;
}

function ImageGenerator({ onGenerate, isLoading }: ImageGeneratorProps) {
  const [prompt, setPrompt] = React.useState("");
  const [style, setStyle] = React.useState("realistic");
  const [size, setSize] = React.useState("1024x1024");
  const [count, setCount] = React.useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate({ prompt: prompt.trim(), style, size, count });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Generate Image
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Style</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Size</label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Images</label>
            <Input
              type="number"
              min={1}
              max={4}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export { ImageGenerator, styles, sizes };

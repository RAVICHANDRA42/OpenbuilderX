"use client";

import * as React from "react";
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketplaceItemCard } from "@/components/marketplace/marketplace-item-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Store } from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  rating: number;
  downloads: number;
  imageUrl?: string;
}

interface MarketplaceGridProps {
  items: MarketplaceItem[];
  onView: (id: string) => void;
  onPurchase?: (id: string) => void;
  onSearch?: (query: string) => void;
}

function MarketplaceGrid({
  items,
  onView,
  onPurchase,
  onSearch,
}: MarketplaceGridProps) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState("popular");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const categories = [
    "all",
    "templates",
    "components",
    "workflows",
    "agents",
    "integrations",
    "tools",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search marketplace..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9 rounded-none rounded-l-md"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9 rounded-none rounded-r-md"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No items found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
          )}
        >
          {items.map((item) => (
            <MarketplaceItemCard
              key={item.id}
              {...item}
              onView={onView}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { MarketplaceGrid };

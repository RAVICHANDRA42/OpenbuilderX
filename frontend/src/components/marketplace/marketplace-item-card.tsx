"use client";

import * as React from "react";
import {
  Star,
  Download,
  Heart,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MarketplaceItemCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  rating: number;
  downloads: number;
  imageUrl?: string;
  onView: (id: string) => void;
  onPurchase?: (id: string) => void;
}

function MarketplaceItemCard({
  id,
  title,
  description,
  price,
  category,
  author,
  rating,
  downloads,
  imageUrl,
  onView,
  onPurchase,
}: MarketplaceItemCardProps) {
  return (
    <Card
      className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onView(id)}
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="rounded-full bg-muted-foreground/10 p-3 mx-auto w-fit">
                <Download className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-[10px]">
            {category}
          </Badge>
        </div>
        {price > 0 ? (
          <div className="absolute top-2 left-2">
            <Badge className="text-[10px]">${price}</Badge>
          </div>
        ) : (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-[10px]">
              Free
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold truncate">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {author}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {downloads}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onView(id);
            }}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          {onPurchase && (
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onPurchase(id);
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              {price > 0 ? `$${price}` : "Get"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export { MarketplaceItemCard };

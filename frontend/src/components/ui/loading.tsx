import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

function LoadingSpinner({ className, size = "default", ...props }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        size === "sm" && "h-8",
        size === "default" && "h-16",
        size === "lg" && "h-24",
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin text-muted-foreground",
          size === "sm" && "h-4 w-4",
          size === "default" && "h-8 w-8",
          size === "lg" && "h-12 w-12"
        )}
      />
    </div>
  );
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 w-full rounded",
        variant === "rectangular" && "rounded-md",
        className
      )}
      {...props}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}

export { LoadingSpinner, Skeleton, CardSkeleton, TableSkeleton };

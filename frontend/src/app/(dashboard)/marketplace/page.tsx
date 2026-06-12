"use client";

import * as React from "react";
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid";

const sampleItems = [
  {
    id: "1",
    title: "React Dashboard Template",
    description: "A complete dashboard template built with React and Tailwind CSS. Includes charts, tables, and dark mode.",
    price: 29,
    category: "templates",
    author: "OpenBuilder Labs",
    rating: 4.8,
    downloads: 1234,
  },
  {
    id: "2",
    title: "AI Chat Widget",
    description: "Embeddable chat widget with AI-powered responses. Easy to integrate into any website.",
    price: 0,
    category: "components",
    author: "AI Systems Inc",
    rating: 4.6,
    downloads: 892,
  },
  {
    id: "3",
    title: "Data Pipeline Workflow",
    description: "Automated data pipeline workflow for ETL operations. Supports multiple data sources.",
    price: 49,
    category: "workflows",
    author: "DataFlow Pro",
    rating: 4.9,
    downloads: 567,
  },
  {
    id: "4",
    title: "Customer Support Agent",
    description: "AI agent for automated customer support with ticket management and knowledge base integration.",
    price: 99,
    category: "agents",
    author: "SupportAI",
    rating: 4.7,
    downloads: 345,
  },
  {
    id: "5",
    title: "Slack Integration",
    description: "Seamless Slack integration for notifications, commands, and automated responses.",
    price: 0,
    category: "integrations",
    author: "OpenBuilder Labs",
    rating: 4.5,
    downloads: 2100,
  },
  {
    id: "6",
    title: "Code Review Assistant",
    description: "AI-powered code review tool that checks for bugs, style issues, and security vulnerabilities.",
    price: 19,
    category: "tools",
    author: "DevTools Pro",
    rating: 4.4,
    downloads: 1567,
  },
  {
    id: "7",
    title: "Image Processing Pipeline",
    description: "Automated image processing workflow with filtering, resizing, and optimization.",
    price: 39,
    category: "workflows",
    author: "MediaFlow",
    rating: 4.3,
    downloads: 789,
  },
  {
    id: "8",
    title: "Next.js Blog Starter",
    description: "Production-ready blog template with MDX support, RSS feed, and SEO optimization.",
    price: 0,
    category: "templates",
    author: "WebStart",
    rating: 4.9,
    downloads: 3200,
  },
];

function MarketplacePage() {
  const handleView = (id: string) => {
    console.log("View item:", id);
  };

  const handlePurchase = (id: string) => {
    console.log("Purchase item:", id);
  };

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover templates, components, workflows, and more
          </p>
        </div>
      </div>

      <MarketplaceGrid
        items={sampleItems}
        onView={handleView}
        onPurchase={handlePurchase}
        onSearch={handleSearch}
      />
    </div>
  );
}

export default MarketplacePage;

export type ChatRole = "user" | "assistant" | "system";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export type Language = "javascript" | "typescript" | "python" | "java" | "csharp" | "go" | "rust" | "html" | "css" | "sql" | "bash" | "json" | "yaml" | "markdown" | "other";

export interface CodeRequest {
  prompt: string;
  language: Language;
  description?: string;
  framework?: string;
}

export interface CodeResponse {
  code: string;
  explanation: string;
  language: Language;
  suggestions?: string[];
}

export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  model?: string;
  style?: string;
}

export interface Image {
  id: string;
  url: string;
  prompt: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment?: string;
  entities?: string[];
  topics?: string[];
  readabilityScore?: number;
}

export interface BuilderNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface WorkflowStep {
  id: string;
  nodeId: string;
  order: number;
  config: Record<string, unknown>;
}

export interface BuilderWorkflow {
  id: string;
  userId: string;
  name: string;
  description?: string;
  nodes: BuilderNode[];
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBase {
  id: string;
  userId: string;
  name: string;
  description?: string;
  documents: KnowledgeDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  knowledgeBaseId: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  rating: number;
  downloads: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  description?: string;
  capabilities: string[];
  config: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  previewUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: Pagination;
}

export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  children?: SidebarItem[];
}

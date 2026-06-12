"use client";

import * as React from "react";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { generateId } from "@/lib/utils";
import { post, get, del } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import type { Message, Conversation } from "@/types";

function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeConv, setActiveConv] = React.useState<string | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const { token, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (token) {
      get<Conversation[]>("/chat/conversations")
        .then(setConversations)
        .catch(() => {});
    }
  }, [token]);

  React.useEffect(() => {
    if (!activeConv && conversations.length > 0) {
      setActiveConv(conversations[0].id);
    }
  }, [conversations, activeConv]);

  React.useEffect(() => {
    if (activeConv && token) {
      get<Message[]>(`/chat/conversations/${activeConv}/messages`)
        .then(setMessages)
        .catch(() => setMessages([]));
    } else {
      setMessages([]);
    }
  }, [activeConv, token]);

  const handleSend = async (content: string) => {
    if (!activeConv || !token) return;

    const userMsg: Message = {
      id: generateId(),
      conversationId: activeConv,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await post<{ reply: string }>(
        `/chat/conversations/${activeConv}/messages`,
        { content }
      );
      const aiMsg: Message = {
        id: generateId(),
        conversationId: activeConv,
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallback: Message = {
        id: generateId(),
        conversationId: activeConv,
        role: "assistant",
        content: "I'm having trouble connecting to the server. Please try again later.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallback]);
    }
    setIsLoading(false);
  };

  const handleNew = async () => {
    if (!token) return;
    try {
      const conv = await post<Conversation>("/chat/conversations", { title: "New Conversation" });
      setConversations((prev) => [conv, ...prev]);
      setActiveConv(conv.id);
      setMessages([]);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await del(`/chat/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConv === id) {
        setActiveConv(conversations.find((c) => c.id !== id)?.id || null);
        setMessages([]);
      }
    } catch {}
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-4 lg:-m-6">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConv || ""}
        onSelect={setActiveConv}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSend={isAuthenticated ? handleSend : () => {}}
        className="flex-1"
      />
    </div>
  );
}

export default ChatPage;

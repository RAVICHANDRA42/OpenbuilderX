import { create } from "zustand";
import type { Conversation, Message } from "@/types";

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isStreaming: boolean;
  isLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  appendToLastMessage: (content: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  clearActiveConversation: () => void;
}

export const useChat = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isStreaming: false,
  isLoading: false,

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) =>
    set({
      activeConversation: conversation,
      messages: conversation?.messages ?? [],
    }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  appendToLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last) {
        messages[messages.length - 1] = {
          ...last,
          content: last.content + content,
        };
      }
      return { messages };
    }),

  setIsStreaming: (isStreaming) => set({ isStreaming }),

  setIsLoading: (isLoading) => set({ isLoading }),

  sendMessage: async (content: string) => {
    const { activeConversation, messages } = get();
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: activeConversation?.id ?? "",
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    set({ messages: [...messages, userMessage], isStreaming: true });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId: activeConversation?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          conversationId: activeConversation?.id ?? "",
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, assistantMessage],
        }));

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          get().appendToLastMessage(chunk);
        }

        get().updateMessage(assistantMessage.id, { content: assistantContent });
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      set({ isStreaming: false });
    }
  },

  clearActiveConversation: () =>
    set({
      activeConversation: null,
      messages: [],
    }),
}));

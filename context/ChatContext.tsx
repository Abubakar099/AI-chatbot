"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Message, Conversation, SendMessageInput } from "@/types/chat"

interface ChatContextType {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isLoading: boolean
  createNewChat: () => void
  selectConversation: (id: string) => void
  sendMessage: (input: string | SendMessageInput) => Promise<void>
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  isHydrated: boolean // NEW: Track hydration state to prevent mismatches
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)
export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // ADD THIS: Prevent hydration mismatch logic loops
  const [isHydrated, setIsHydrated] = useState(false)

  const refreshSidebar = useCallback(async () => {
    try {
      const res = await fetch("/api/chats")
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch (e) { console.error(e) }
  }, [])

  // 1. Set hydration and initial data
  useEffect(() => {
    setIsHydrated(true)
    refreshSidebar()
    const lastId = sessionStorage.getItem("lastChatId")
    if (lastId) setCurrentConversationId(lastId)
  }, [refreshSidebar])

  // 2. Load messages ONLY after hydration and when ID exists
  useEffect(() => {
    if (isHydrated && currentConversationId) {
      const fetchMessages = async () => {
        const res = await fetch(`/api/chats/${currentConversationId}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
          sessionStorage.setItem("lastChatId", currentConversationId)
        }
      }
      fetchMessages();
    } else if (isHydrated && !currentConversationId) {
      setMessages([]) // Fixes the freeze when clicking "New Chat"
    }
  }, [currentConversationId, isHydrated])

  // 4. New Chat Logic
  const createNewChat = useCallback(() => {
    setCurrentConversationId(null)
    setMessages([])
    sessionStorage.removeItem("lastChatId")
  }, [])

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id)
  }, [])

  const deleteConversation = useCallback(async (id: string) => {
    try {
      // Corrected to use the [id] route inside 'chats'
      const res = await fetch(`/api/chats/${id}`, { method: "DELETE" })
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id))
        if (currentConversationId === id) {
          createNewChat()
        }
      }
    } catch (e) {
      console.error("Failed to delete chat", e)
    }
  }, [currentConversationId, createNewChat])

  const renameConversation = useCallback(async (id: string, title: string) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || "Failed to rename chat")
      }

      setConversations(prev =>
        prev.map(conversation =>
          conversation.id === id
            ? { ...conversation, title: trimmedTitle }
            : conversation
        )
      )
    } catch (e) {
      console.error("Failed to rename chat", e)
    }
  }, [])

  const editMessage = useCallback(async (messageId: string, content: string) => {
    const trimmedContent = content.trim()
    if (!trimmedContent) return

    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmedContent }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || "Failed to edit message")
      }

      setMessages(prev =>
        prev.map(message =>
          message.id === messageId
            ? { ...message, content: trimmedContent }
            : message
        )
      )
    } catch (e) {
      console.error("Failed to edit message", e)
    }
  }, [])

  const sendMessage = useCallback(async (input: string | SendMessageInput) => {
    const payload = typeof input === "string" ? { content: input } : input
    const content = payload.content
    const imageUrl = payload.imageUrl ?? null
    const tempUserId = crypto.randomUUID()
    const userMessage: Message = { id: tempUserId, role: "user", content, imageUrl }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // POST to the singular 'chat' route (Gemini logic)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          imageUrl,
          chatId: currentConversationId,
          history: messages,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to get response")

      const savedUserMessage: Message = data.userMessage ?? userMessage
      const assistantMsg: Message = data.assistantMessage ?? {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      }

      setMessages(prev => [
        ...prev.map(message =>
          message.id === tempUserId ? savedUserMessage : message
        ),
        assistantMsg,
      ])

      // If this was the first message, sync the ID and update sidebar titles
      if (!currentConversationId) {
        setCurrentConversationId(data.chatId)
        sessionStorage.setItem("lastChatId", data.chatId)
        await refreshSidebar() // Refresh the sidebar to show the new AI-generated title
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }, [currentConversationId, messages, refreshSidebar])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        isLoading,
        createNewChat,
        selectConversation,
        sendMessage,
        deleteConversation,
        renameConversation,
        editMessage,
        isHydrated, // Expose hydration state to prevent mismatches
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useChatContext must be used within a ChatProvider")
  return context
}

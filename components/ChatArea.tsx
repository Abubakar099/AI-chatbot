'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import { askGemini, getChatSession } from '@/app/actions/chats'
import { useSearchParams } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  originalContent?: string | null
}

const ChatArea = () => {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('chat')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Load chat history when session changes
  useEffect(() => {
    const loadChat = async () => {
      if (currentSessionId) {
        try {
          const session = await getChatSession(currentSessionId)
          if (session) {
            setMessages(session.messages)
          }
        } catch (error) {
          console.error("[v0] Failed to load chat:", error)
        }
      } else {
        setMessages([])
      }
    }

    loadChat()
  }, [currentSessionId])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Optimistic update
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const result = await askGemini(currentSessionId, content)
      
      // Set session ID if this is a new chat
      if (!currentSessionId) {
        setCurrentSessionId(result.sessionId)
      }

      // Reload chat to get saved messages from DB
      const session = await getChatSession(result.sessionId)
      if (session) {
        setMessages(session.messages)
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => prev.slice(0, -1)) // Remove optimistic message
    } finally {
      setIsLoading(false)
    }
  }

  const isEmptyChat = messages.length === 0

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-background">
      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-6 flex flex-col"
      >
        {isEmptyChat && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent-foreground font-bold text-2xl">G</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Gemini</h1>
              <p className="text-muted-foreground max-w-md">
                Ask me anything. I can help with writing, coding, math, creative ideas, and much more.
              </p>
            </div>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
              {[
                'Explain quantum computing',
                'Build a React hook',
                'Python best practices',
                'Plan a trip to Japan',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="p-4 bg-card border border-border rounded-lg hover:bg-secondary transition-all text-foreground text-sm text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isEmptyChat && (
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-card rounded-2xl px-4 py-3 max-w-md">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce animation-delay-100" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce animation-delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default ChatArea

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Image, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('')
  const [rows, setRows] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      const newRows = Math.min(Math.ceil(scrollHeight / 24), 5)
      setRows(newRows)
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
      setRows(1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-end">
          {/* Input Container */}
          <div className="flex-1">
            <div className="bg-secondary rounded-2xl px-4 py-3 flex items-end gap-3">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Gemini..."
                rows={rows}
                disabled={isLoading}
                className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none resize-none max-h-[120px] leading-6 text-sm disabled:opacity-50"
              />

              {/* Icon Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-card text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-card text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-card text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="h-10 w-10 p-0 bg-accent hover:bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          Gemini can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  )
}

export default ChatInput

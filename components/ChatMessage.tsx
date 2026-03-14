'use client'

import { ThumbsUp, ThumbsDown, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ChatMessageProps {
  message: {
    id: string
    type: 'user' | 'ai'
    content: string
  }
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.type === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="bg-accent text-accent-foreground rounded-2xl px-4 py-3 max-w-md break-words">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex justify-start animate-fade-in group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-3 max-w-2xl">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-xs">G</span>
          </div>
        </div>

        {/* Message Bubble and Actions */}
        <div className="flex flex-col gap-2">
          <div className="bg-card border border-border rounded-2xl px-4 py-3 break-words">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex gap-1 transition-opacity ${
              showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Like"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Dislike"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
              title="Copy"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Regenerate"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage

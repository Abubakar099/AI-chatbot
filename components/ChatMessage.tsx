'use client'

import { ThumbsUp, ThumbsDown, Copy, RefreshCw, Edit2, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { updateMessage, deleteMessage } from '@/app/actions/chats'

interface ChatMessageProps {
  message: {
    id: string
    role: 'user' | 'ai'
    content: string
    originalContent?: string | null
  }
  onEdit?: (messageId: string, newContent: string) => void
}

const ChatMessage = ({ message, onEdit }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = async () => {
    if (editContent.trim() === message.content) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await updateMessage(message.id, editContent)
      setIsEditing(false)
      onEdit?.(message.id, editContent)
    } catch (error) {
      console.error("Failed to edit message:", error)
      setEditContent(message.content)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Delete this message?')) {
      try {
        await deleteMessage(message.id)
      } catch (error) {
        console.error("Failed to delete message:", error)
      }
    }
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in group">
        <div 
          className="bg-accent text-accent-foreground rounded-2xl px-4 py-3 max-w-md break-words"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-accent-foreground/10 text-accent-foreground rounded p-2 text-sm resize-none focus:outline-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.originalContent && (
                <p className="text-xs opacity-60 mt-1">
                  {`(edited from: "${message.originalContent.substring(0, 30)}...")`}
                </p>
              )}
              {showActions && (
                <div className="flex gap-1 mt-2 -mx-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-accent-foreground/70 hover:text-accent-foreground"
                    onClick={() => setIsEditing(true)}
                    title="Edit"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-accent-foreground/70 hover:text-accent-foreground"
                    onClick={handleDelete}
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </>
          )}
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

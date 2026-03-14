'use client'

import { ThumbsUp, ThumbsDown, Copy, RefreshCw, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { editMessage } from '@/app/actions/chats'

interface ChatMessageProps {
  message: {
    id: string
    type: 'user' | 'model'
    content: string
    isEdited?: boolean
  }
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)
  const [isSaving, setIsSaving] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditSave = async () => {
    if (editedContent.trim() === message.content) {
      setIsEditing(false)
      return
    }
    setIsSaving(true)
    try {
      await editMessage(message.id, editedContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error editing message:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (message.type === 'user') {
    return (
      <div className="flex justify-end animate-fade-in group">
        <div className="flex gap-2 max-w-md items-start">
          {isEditing ? (
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="bg-accent text-accent-foreground rounded-2xl px-4 py-3 w-full resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedContent(message.content)
                  }}
                  className="h-8 w-8 p-0"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSave}
                  className="h-8 px-2"
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-accent text-accent-foreground rounded-2xl px-4 py-3 break-words">
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.isEdited && (
                  <p className="text-xs opacity-75 mt-1">(edited)</p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-secondary rounded hover:text-foreground text-muted-foreground"
              >
                <Edit2 className="h-4 w-4" />
              </button>
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

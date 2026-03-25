"use client"

import { useEffect, useState } from "react"
import { Check, MessageSquare, PenIcon, Trash2, X } from "lucide-react"
import { useChatContext } from "@/context/ChatContext"
import type { Conversation } from "@/types/chat"

interface ConversationItemProps {
  convo: Conversation
  isActive: boolean
}

export default function ConversationItem({ convo, isActive }: ConversationItemProps) {
  const { selectConversation, deleteConversation, renameConversation } = useChatContext()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(convo.title)

  useEffect(() => {
    setDraftTitle(convo.title)
  }, [convo.title])

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteConversation(convo.id)
  }

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDraftTitle(convo.title)
    setIsEditing(true)
  }

  const handleEditCancel = (e?: React.MouseEvent | React.FocusEvent) => {
    e?.stopPropagation()
    setDraftTitle(convo.title)
    setIsEditing(false)
  }

  const handleRename = async (e?: React.MouseEvent | React.KeyboardEvent | React.FocusEvent) => {
    e?.stopPropagation()
    const trimmedTitle = draftTitle.trim()

    if (!trimmedTitle) {
      setDraftTitle(convo.title)
      setIsEditing(false)
      return
    }

    if (trimmedTitle !== convo.title) {
      await renameConversation(convo.id, trimmedTitle)
    }

    setIsEditing(false)
  }

  return (
    <div
      onClick={() => selectConversation(convo.id)}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? "bg-[#3c4043] text-white" 
          : "hover:bg-[#282a2c] text-[#e8eaed]"
      }`}
    >
      <MessageSquare size={16} className="shrink-0 opacity-70" />
      {isEditing ? (
        <>
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleRename(e)
              }

              if (e.key === "Escape") {
                handleEditCancel(e)
              }
            }}
            autoFocus
            className="flex-1 min-w-0 bg-[#131314] border border-[#5f6368] rounded px-2 py-1 text-sm outline-none"
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => void handleRename(e)}
            className="p-1 hover:bg-[#4a4b4f] rounded"
            aria-label="Save conversation name"
          >
            <Check size={14} className="text-[#9aa0a6] hover:text-green-400" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleEditCancel}
            className="p-1 hover:bg-[#4a4b4f] rounded"
            aria-label="Cancel rename"
          >
            <X size={14} className="text-[#9aa0a6]" />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm truncate">{convo.title}</span>
          <button
            onClick={handleEditStart}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#4a4b4f] rounded transition-opacity"
            aria-label="Rename conversation"
          >
            <PenIcon size={14} className="text-[#9aa0a6] hover:text-white" />
          </button>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#4a4b4f] rounded transition-opacity"
            aria-label="Delete conversation"
          >
            <Trash2 size={14} className="text-[#9aa0a6] hover:text-red-400" />
          </button>
        </>
      )}
    </div>
  )
}

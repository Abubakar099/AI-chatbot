"use client"

import { useEffect, useState } from "react"
import { Check, Pencil, Sparkles, User, X } from "lucide-react"
import { useChatContext } from "@/context/ChatContext"
import type { Message } from "@/types/chat"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const hasImage = Boolean(message.imageUrl)
  const { editMessage } = useChatContext()
  const [isEditing, setIsEditing] = useState(false)
  const [draftContent, setDraftContent] = useState(message.content)

  useEffect(() => {
    setDraftContent(message.content)
  }, [message.content])

  const handleEditStart = () => {
    setDraftContent(message.content)
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setDraftContent(message.content)
    setIsEditing(false)
  }

  const handleSave = async () => {
    const trimmedContent = draftContent.trim()
    if (!trimmedContent) {
      handleEditCancel()
      return
    }

    if (trimmedContent !== message.content) {
      await editMessage(message.id, trimmedContent)
    }

    setIsEditing(false)
  }

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
      )}

      <div
        className={`px-4 py-2 rounded-2xl max-w-[85%] ${
          isUser
            ? "bg-[#1e1f20] border border-[#3c4043] text-gray-200"
            : "bg-transparent text-gray-100"
        }`}
      >
        {isUser && isEditing ? (
          <div className="space-y-3">
            {hasImage && (
              <img
                src={message.imageUrl || undefined}
                alt="Uploaded message"
                className="max-h-64 w-full rounded-2xl object-cover"
              />
            )}
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  void handleSave()
                }

                if (e.key === "Escape") {
                  e.preventDefault()
                  handleEditCancel()
                }
              }}
              rows={Math.max(3, draftContent.split("\n").length)}
              autoFocus
              className="w-full min-w-[260px] bg-[#131314] border border-[#5f6368] rounded-xl px-3 py-2 outline-none resize-y whitespace-pre-wrap leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2d2e2f] hover:bg-[#3c4043] transition-colors"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={() => void handleSave()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#8ab4f8] text-[#131314] hover:bg-[#aecbfa] transition-colors"
              >
                <Check size={14} />
                Save
              </button>
            </div>
          </div>
        ) : isUser ? (
          <div className="space-y-2">
            {hasImage && (
              <img
                src={message.imageUrl || undefined}
                alt="Uploaded message"
                className="max-h-64 w-full rounded-2xl object-cover"
              />
            )}
            {message.content && (
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleEditStart}
                className="inline-flex items-center gap-1 text-xs text-[#9aa0a6] hover:text-white transition-colors"
              >
                <Pencil size={12} />
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {hasImage && (
              <img
                src={message.imageUrl || undefined}
                alt="Uploaded message"
                className="max-h-64 w-full rounded-2xl object-cover"
              />
            )}
            {message.content && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => <h2 className="text-lg font-bold text-blue-400 mt-4 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-md font-semibold text-purple-400 mt-3 mb-1">{children}</h3>,
                  ul: ({ children }) => <ul className="space-y-2 my-3">{children}</ul>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">-</span>
                      <span>{children}</span>
                    </li>
                  ),
                  p: ({ children }) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                  code: ({ children }) => (
                    <code className="bg-[#2d2e2f] px-1.5 py-0.5 rounded text-cyan-300 font-mono text-sm">
                      {children}
                    </code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-[#3c4043] rounded-full flex items-center justify-center shrink-0">
          <User size={16} className="text-gray-300" />
        </div>
      )}
    </div>
  )
}

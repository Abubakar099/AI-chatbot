"use client"

import { Plus, MessageSquare, Menu, X } from "lucide-react"
import { useChatContext } from "@/context/ChatContext"
import ConversationItem from "./ConversationaItem"
import { useState } from "react"

export default function Sidebar() {
  const { conversations, createNewChat, currentConversationId } = useChatContext()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e1f20] rounded-lg hover:bg-[#2b2c2f] transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-40 w-64 h-full bg-[#1e1f20] p-4 flex flex-col transition-transform duration-200`}
      >
        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className="flex gap-3 items-center px-4 py-3 mb-4 rounded-full border border-[#3c4043] hover:bg-[#282a2c] transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">New chat</span>
        </button>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-[#9aa0a6]">
              <MessageSquare size={24} className="mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-[#9aa0a6] px-3 py-2 text-red-500 font-medium">Recent</p>
              {conversations.map((convo) => (
                <ConversationItem
                  key={convo.id}
                  convo={convo}
                  isActive={convo.id === currentConversationId}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  )
}

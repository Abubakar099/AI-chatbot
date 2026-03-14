'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Plus, Search, Settings, User, Pin, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getChatHistory, createNewChat, deleteChat, renameChat } from '@/app/actions/chats'

interface Chat {
  id: string
  title: string
  createdAt: Date
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch chat history on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const history = await getChatHistory()
        setChats(history as Chat[])
      } catch (error) {
        console.error('Error fetching chats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChats()
  }, [])

  const handleCreateNewChat = async () => {
    try {
      const chatId = await createNewChat()
      // Refresh chat history
      const history = await getChatHistory()
      setChats(history as Chat[])
      // Optionally navigate to the new chat
      window.location.href = `/?chatId=${chatId}`
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return
    try {
      await deleteChat(chatId)
      setChats((prev) => prev.filter((c) => c.id !== chatId))
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return
    try {
      await renameChat(chatId, newTitle)
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
      )
      setEditingChatId(null)
      setEditingTitle('')
    } catch (error) {
      console.error('Error renaming chat:', error)
    }
  }

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">G</span>
            </div>
            <span className="text-sidebar-foreground font-semibold text-sm">Gemini</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-sidebar-accent"
        >
          <ChevronLeft className={`h-4 w-4 text-sidebar-foreground transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={handleCreateNewChat}
          className="w-full gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90 transition-opacity"
          size={isOpen ? 'default' : 'icon'}
        >
          <Plus className="h-4 w-4" />
          {isOpen && <span>New Chat</span>}
        </Button>
      </div>

      {/* Search */}
      {isOpen && (
        <div className="px-3 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-sidebar-accent opacity-50" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-sidebar-accent-foreground text-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-sidebar-primary transition-all text-sm"
            />
          </div>
        </div>
      )}

      {/* Chat History */}
      {isOpen && (
        <div className="px-3 pb-4 flex-1 overflow-y-auto">
          <div className="text-xs text-sidebar-accent-foreground uppercase tracking-wider font-semibold mb-2">
            Recent
          </div>
          {isLoading ? (
            <div className="text-sm text-sidebar-accent-foreground text-center py-4">
              Loading chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-sm text-sidebar-accent-foreground text-center py-4">
              No chats yet
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative flex items-center px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors"
                >
                  {editingChatId === chat.id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleRenameChat(chat.id, editingTitle)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameChat(chat.id, editingTitle)
                        } else if (e.key === 'Escape') {
                          setEditingChatId(null)
                        }
                      }}
                      autoFocus
                      className="flex-1 bg-sidebar-accent-foreground text-sidebar-foreground px-2 py-1 rounded text-sm outline-none"
                    />
                  ) : (
                    <>
                      <span className="text-sm text-sidebar-foreground flex-1 truncate">
                        {chat.title}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingChatId(chat.id)
                            setEditingTitle(chat.title)
                          }}
                          className="p-1 hover:bg-sidebar-accent-foreground rounded transition-colors"
                        >
                          <Edit2 className="h-3 w-3 text-sidebar-accent-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChat(chat.id)
                          }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <Button
          variant="ghost"
          size={isOpen ? 'default' : 'icon'}
          className="w-full gap-2 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="h-4 w-4" />
          {isOpen && <span className="text-sm">Settings</span>}
        </Button>
        <Button
          variant="ghost"
          size={isOpen ? 'default' : 'icon'}
          className="w-full gap-2 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <User className="h-4 w-4" />
          {isOpen && <span className="text-sm">Profile</span>}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar

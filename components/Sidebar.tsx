'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Plus, Search, Settings, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { getChatHistory, searchChats, createChatSession, deleteChatSession } from '@/app/actions/chats'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface ChatSession {
  id: string
  title: string
  updatedAt: Date
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentChatId = searchParams.get('chat')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState<ChatSession[]>([])
  const [filteredChats, setFilteredChats] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load chats on mount and when search changes
  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true)
      try {
        if (searchQuery.trim()) {
          const results = await searchChats(searchQuery)
          setFilteredChats(results)
        } else {
          const allChats = await getChatHistory()
          setChats(allChats)
          setFilteredChats(allChats)
        }
      } catch (error) {
        console.error("[v0] Failed to load chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChats()
  }, [searchQuery])

  const handleNewChat = async () => {
    try {
      const newSession = await createChatSession()
      router.push(`/?chat=${newSession.id}`)
    } catch (error) {
      console.error("[v0] Failed to create new chat:", error)
    }
  }

  const handleSelectChat = (chatId: string) => {
    router.push(`/?chat=${chatId}`)
  }

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    if (confirm('Delete this chat?')) {
      try {
        await deleteChatSession(chatId)
        setChats((prev) => prev.filter((c) => c.id !== chatId))
        setFilteredChats((prev) => prev.filter((c) => c.id !== chatId))
        
        // Navigate away if this was the current chat
        if (currentChatId === chatId) {
          router.push('/')
        }
      } catch (error) {
        console.error("[v0] Failed to delete chat:", error)
      }
    }
  }

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
          onClick={handleNewChat}
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
              className="w-full pl-10 pr-3 py-2 bg-sidebar-accent-foreground text-sidebar-foreground rounded-lg outline-none focus:ring-2 focus:ring-sidebar-primary transition-all text-sm placeholder-sidebar-accent"
            />
          </div>
        </div>
      )}

      {/* Chat List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {isLoading ? (
            <div className="text-xs text-sidebar-accent-foreground text-center py-4">Loading...</div>
          ) : filteredChats.length > 0 ? (
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  }`}
                >
                  <span className="text-sm flex-1 truncate">
                    {chat.title || 'Untitled'}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-primary/20"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-sidebar-accent-foreground text-center py-8">
              {searchQuery ? 'No chats found' : 'No chats yet. Start a new one!'}
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

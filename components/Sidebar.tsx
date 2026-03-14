'use client'

import { useState } from 'react'
import { ChevronLeft, Plus, Search, Settings, User, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [pinnedChats] = useState(['Project Planning', 'Code Review'])
  const [recentChats] = useState([
    'Explain quantum computing',
    'Build a React component',
    'Python best practices',
    'Database optimization',
  ])

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

      {/* Pinned Chats */}
      {isOpen && pinnedChats.length > 0 && (
        <div className="px-3 pb-4">
          <div className="text-xs text-sidebar-accent-foreground uppercase tracking-wider font-semibold mb-2">
            Pinned
          </div>
          <div className="space-y-1">
            {pinnedChats.map((chat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors group"
              >
                <Pin className="h-4 w-4 text-sidebar-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm text-sidebar-foreground flex-1 truncate">{chat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Chats */}
      {isOpen && recentChats.length > 0 && (
        <div className="px-3 pb-4 flex-1 overflow-y-auto">
          <div className="text-xs text-sidebar-accent-foreground uppercase tracking-wider font-semibold mb-2">
            Recent
          </div>
          <div className="space-y-1">
            {recentChats.map((chat, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors text-sm text-sidebar-foreground truncate"
              >
                {chat}
              </div>
            ))}
          </div>
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

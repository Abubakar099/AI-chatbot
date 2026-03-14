'use client'

import { Menu, Sun, Moon, Settings, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NavbarProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
  isDarkMode: boolean
  onThemeToggle: () => void
}

const Navbar = ({ sidebarOpen, onSidebarToggle, isDarkMode, onThemeToggle }: NavbarProps) => {
  const [modelOpen, setModelOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('Gemini 2.0')

  const models = ['Gemini 2.0', 'Gemini 1.5', 'Gemini 1.0', 'GPT-4 Vision']

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="h-8 w-8 hover:bg-secondary"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-xs">G</span>
          </div>
          <span className="font-semibold text-foreground text-sm">Chat</span>
        </div>
      </div>

      {/* Center - Model Selector */}
      <div className="flex-1 flex justify-center">
        <div className="relative">
          <Button
            variant="outline"
            className="gap-2 bg-secondary border-border text-foreground hover:bg-secondary"
            onClick={() => setModelOpen(!modelOpen)}
          >
            <span>{selectedModel}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Dropdown */}
          {modelOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-48">
              {models.map((model) => (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model)
                    setModelOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedModel === model
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="h-8 w-8 hover:bg-secondary"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-secondary"
        >
          <Settings className="h-4 w-4 text-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-secondary"
        >
          <User className="h-4 w-4 text-foreground" />
        </Button>
      </div>
    </div>
  )
}

export default Navbar

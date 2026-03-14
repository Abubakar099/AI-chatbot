'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import ChatArea from '@/components/ChatArea'
import { SetupCheck } from '@/components/SetupCheck'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <SetupCheck>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Navbar */}
            <Navbar
              sidebarOpen={sidebarOpen}
              onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
              isDarkMode={isDarkMode}
              onThemeToggle={() => setIsDarkMode(!isDarkMode)}
            />

            {/* Chat Area */}
            <ChatArea />
          </div>
        </div>
      </div>
    </SetupCheck>
  )
}

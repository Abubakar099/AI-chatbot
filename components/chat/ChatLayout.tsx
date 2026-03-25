"use client";

import { useChatContext } from "@/context/ChatContext";
import WelcomeScreen from "./WelcomeScreen";
import ChatInput from "./ChatInput";
import MessageListComponent from "./MessageList";
import Sidebar from "../sidebar/sidebar";

export default function ChatLayout() {
  const { messages, sendMessage, isLoading, isHydrated } = useChatContext()

  // Show nothing while hydrating to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="flex h-screen bg-[#131314] text-white">
        <Sidebar />
        <main className="flex flex-col flex-1 items-center justify-center">
          <div className="text-[#9aa0a6]">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#131314] text-white">
      <Sidebar />
      <main className="flex flex-col flex-1">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <MessageListComponent messages={messages} isLoading={isLoading} />
        )}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </main>
    </div>
  )
}

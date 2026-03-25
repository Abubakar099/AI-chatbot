"use client";

import { Code, MessageSquare,Sparkles, Lightbulb } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";

const suggestions = [
  {
    icon: Code,
    text: "Help me debug my code",
  },
  {
    icon: Lightbulb,
    text: "Give me some ideas for a project",
  },
  {
    icon: MessageSquare,
    text: "Explain quantum computing in simple terms",
  },
  {
    icon: Sparkles,
    text: "Write a haiku about the sea",
  }
]
export default function WelcomeScreen() {
  const {sendMessage} = useChatContext()
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 mt-30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles size={28} />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-normal mb-2">
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Hello, there
        </span>
      </h1>
      
      <p className="text-[#9aa0a6] text-lg mb-10">How can I help you today?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => sendMessage(suggestion.text)}
            className="flex items-start gap-3 p-4 bg-[#1e1f20] rounded-xl border border-[#3c4043] hover:bg-[#282a2c] transition-colors text-left group"
          >
            <suggestion.icon size={18} className="text-[#9aa0a6] mt-0.5 group-hover:text-blue-400 transition-colors" />
            <p className="text-sm text-[#e8eaed]">{suggestion.text}</p>
            
          </button>
        ))}
      </div>
    </div>


  )
}


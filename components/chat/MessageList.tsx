"use client";

import { useEffect ,useRef} from "react";
import ChatMessage from "./ChatMessage";
import type { Message } from "@/types/chat";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
}

export default function MessageList({messages,isLoading}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
            <div className="px-4 py-2  text-[#9aa0a6]">
              Thinking...
            </div>
          </div>
        )}
      <div ref={bottomRef} />
    </div>
  );
}
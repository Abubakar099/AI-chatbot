"use client";

import ChatLayout from "@/components/chat/ChatLayout";
import { ChatProvider } from "@/context/ChatContext";

export default function Home() {
  return (
    <>
     <ChatProvider>
      <ChatLayout />
     </ChatProvider>
    </>
  );
}
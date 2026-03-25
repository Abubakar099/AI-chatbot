// app/api/chats/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: 'desc' }
    })
    
    // Transform to match Conversation type
    const conversations = chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      messages: chat.messages.map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        imageUrl: msg.imageUrl,
        createdAt: msg.createdAt.toISOString(),
      }))
    }))
    
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Failed to fetch chats:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}




export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, chatId, title } = body;

    // 1. Create or update the chat
    let chat;
    if (chatId) {
      chat = await prisma.chat.upsert({
        where: { id: chatId },
        update: { updatedAt: new Date() },
        create: { 
          id: chatId,
          title: title || (message.length > 30 ? message.substring(0, 30) + "..." : message),
        },
      });
    } else {
      chat = await prisma.chat.create({
        data: { 
          title: title || (message.length > 30 ? message.substring(0, 30) + "..." : message),
        },
      });
    }

    // 2. Save the USER message
    await prisma.message.create({
      data: {
        content: message,
        imageUrl: body.imageUrl ?? null,
        role: "user",
        chatId: chat.id,
      },
    });

    // 3. GENERATE AI RESPONSE
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(message);
    const aiText = result.response.text();

    // 4. Save the ASSISTANT message to Prisma
    const assistantMessage = await prisma.message.create({
      data: {
        content: aiText,
        role: "assistant",
        chatId: chat.id,
      },

    });
console.log("chat is not showing", assistantMessage);

    // 5. Return the AI's message so the frontend can display it
    return NextResponse.json(assistantMessage);

  } catch (error) {
    console.error("Detailed Error:", error);
    return NextResponse.json({ error: "Failed to process AI response" }, { status: 500 });
  }
}

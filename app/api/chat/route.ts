import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"; // Use NextResponse for better compatibility

export const runtime = "nodejs";
export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const systemInstruction = `
- Always format your responses using Markdown.
- Use Headings (##, ###) to separate different sections of your answer.
- Use standard dashes (-) or emojis (🚀, ✅, 📌) for lists.
- NEVER use asterisks (*) for bolding or lists.
- Use Code Blocks (\`\`\`) for any technical references or command-line examples.
- Use Tables if you need to compare two or more items.
- Keep your layout clean with double line breaks between paragraphs.
`;

function buildChatTitle(message: string, hasImage: boolean) {
  const cleaned = message.replace(/\s+/g, " ").trim();
  if (!cleaned) return hasImage ? "Image message" : "New Chat";
  return cleaned.length > 40 ? `${cleaned.slice(0, 40).trim()}...` : cleaned;
}

function dataUrlToInlineData(imageUrl: string) {
  const match = imageUrl.match(/^data:(.+);base64,(.+)$/)
  if (!match) return null

  return {
    mimeType: match[1],
    data: match[2],
  }
}

export async function POST(req: Request) {
  try {
    const { message, imageUrl, history, chatId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    if (!message?.trim() && !imageUrl) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }

    let activeChatId = chatId;
    let savedUserMessage: { id: string; role: string; content: string; imageUrl: string | null };

    // 1. Handle Chat Creation & Title Generation
    if (!activeChatId) {
      const chatTitle = buildChatTitle(message, Boolean(imageUrl));

      const newChat = await prisma.chat.create({
        data: {
          title: chatTitle,
          messages: {
            create: { role: "user", content: message, imageUrl: imageUrl ?? null },
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 1,
          },
        },
      });
      activeChatId = newChat.id;
      savedUserMessage = newChat.messages[0];
    } else {
      // Update existing chat with User message
      savedUserMessage = await prisma.message.create({
        data: {
          chatId: activeChatId,
          role: "user",
          content: message,
          imageUrl: imageUrl ?? null,
        },
      });
      await prisma.chat.update({
        where: { id: activeChatId },
        data: {
          updatedAt: new Date(),
        },
      });
    }

    // 2. Generate AI Response
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction,
    });
    const chatHistory = history?.map((msg: any) => {
      const parts = []

      if (msg.content) {
        parts.push({ text: msg.content })
      }

      if (msg.imageUrl) {
        const inlineData = dataUrlToInlineData(msg.imageUrl)
        if (inlineData) {
          parts.push({ inlineData })
        }
      }

      return {
        role: msg.role === "user" ? "user" : "model",
        parts,
      }
    }).filter((msg: any) => msg.parts.length > 0) || [];

    const chatSession = model.startChat({ history: chatHistory });
    const nextParts = []

    if (message) {
      nextParts.push({ text: message })
    }

    if (imageUrl) {
      const inlineData = dataUrlToInlineData(imageUrl)
      if (inlineData) {
        nextParts.push({ inlineData })
      }
    }

    const result = await chatSession.sendMessage(nextParts);
    const aiResponse = result.response.text();

    // 3. Save AI Response to Database
    const savedAssistantMessage = await prisma.message.create({
      data: {
        chatId: activeChatId,
        role: "assistant",
        content: aiResponse,
      },
    });

    // 4. ALWAYS RETURN HERE
    return NextResponse.json({ 
      reply: aiResponse, 
      chatId: activeChatId,
      userMessage: {
        id: savedUserMessage.id,
        role: savedUserMessage.role,
        content: savedUserMessage.content,
        imageUrl: savedUserMessage.imageUrl,
      },
      assistantMessage: {
        id: savedAssistantMessage.id,
        role: savedAssistantMessage.role,
        content: savedAssistantMessage.content,
        imageUrl: null,
      },
    });

  } catch (error: any) {
    console.error("Chat Route Error:", error);

    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: "Gemini rate limit reached. Please wait a bit and try again.",
          retryable: true,
        },
        { status: 429 }
      );
    }
    
    // 5. ALWAYS RETURN IN CATCH BLOCK
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

'use server'

import { prisma } from "@/lib/prisma"
import { model } from "@/lib/gemini"
import { revalidatePath } from "next/cache"

export async function createChatSession() {
    const session = await prisma.chatSession.create({ 
        data: { title: "" } 
    })
    return session
}

export async function askGemini(sessionId: string | null, prompt: string) {
    // 1. Ensure we have a session
    let session = sessionId
        ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
        : null

    if (!session) {
        session = await prisma.chatSession.create({ data: { title: "" } })
    }

    // 2. Save User Message
    await prisma.message.create({
        data: {
            role: 'user',
            content: prompt,
            sessionId: session.id
        }
    })

    // 3. Get AI Response from Gemini
    let aiResponse = ""
    try {
        const result = await model.generateContent(prompt)
        aiResponse = result.response.text()
    } catch (error) {
        console.error("[v0] Gemini error:", error)
        aiResponse = "Sorry, I encountered an error. Please try again."
    }

    // 4. Save AI Message
    await prisma.message.create({
        data: {
            role: 'ai',
            content: aiResponse,
            sessionId: session.id
        }
    })

    // 5. Auto-generate title after first exchange if empty
    if (!session.title) {
        try {
            const titlePrompt = `Summarize this conversation topic in 3-4 words, no punctuation: "${prompt}"`
            const titleResult = await model.generateContent(titlePrompt)
            const newTitle = titleResult.response.text().trim()
            
            await prisma.chatSession.update({
                where: { id: session.id },
                data: { title: newTitle }
            })
        } catch (error) {
            console.error("[v0] Title generation error:", error)
            // Fallback to truncated prompt
            await prisma.chatSession.update({
                where: { id: session.id },
                data: { title: prompt.substring(0, 50) }
            })
        }
    }

    revalidatePath('/') 
    return { sessionId: session.id, aiResponse }
}

export async function getChatHistory() {
    const sessions = await prisma.chatSession.findMany({
        include: {
            messages: true
        },
        orderBy: { updatedAt: 'desc' }
    })
    return sessions
}

export async function getChatSession(sessionId: string) {
    const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    })
    return session
}

export async function updateMessage(messageId: string, newContent: string) {
    const message = await prisma.message.findUnique({
        where: { id: messageId }
    })

    if (!message) {
        throw new Error("Message not found")
    }

    // Save original content if not already saved
    const updated = await prisma.message.update({
        where: { id: messageId },
        data: {
            content: newContent,
            originalContent: message.originalContent || message.content
        }
    })

    revalidatePath('/')
    return updated
}

export async function deleteMessage(messageId: string) {
    await prisma.message.delete({
        where: { id: messageId }
    })
    revalidatePath('/')
}

export async function searchChats(query: string) {
    if (!query.trim()) {
        return await getChatHistory()
    }

    const sessions = await prisma.chatSession.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { 
                    messages: {
                        some: {
                            content: { contains: query, mode: 'insensitive' }
                        }
                    }
                }
            ]
        },
        include: {
            messages: true
        },
        orderBy: { updatedAt: 'desc' }
    })

    return sessions
}

export async function deleteChatSession(sessionId: string) {
    await prisma.chatSession.delete({
        where: { id: sessionId }
    })
    revalidatePath('/')
}

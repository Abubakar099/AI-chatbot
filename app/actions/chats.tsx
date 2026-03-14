'use server'

import { prisma } from "@/lib/prisma"
import { model } from "@/lib/gemini"
import { revalidatePath } from "next/cache"

const DEFAULT_USER_ID = "default-user"

// Generate AI title for a chat based on the first message
async function generateChatTitle(prompt: string): Promise<string> {
    try {
        const result = await model.generateContent(
            `Generate a short, concise title (max 50 chars) for a chat that starts with: "${prompt}". Only return the title, nothing else.`
        )
        const title = result.response.text().trim()
        return title.length > 0 ? title : "New Chat"
    } catch (error) {
        console.error("Error generating title:", error)
        return "New Chat"
    }
}

export async function createNewChat(initialPrompt?: string): Promise<string> {
    // Create a new chat
    const title = initialPrompt ? await generateChatTitle(initialPrompt) : "New Chat"
    
    const chat = await prisma.chat.create({
        data: {
            title,
            userId: DEFAULT_USER_ID,
        }
    })
    
    return chat.id
}

export async function askGemini(chatId: string | null, prompt: string) {
    try {
        // 1. Ensure we have a chat
        let chat = chatId
            ? await prisma.chat.findUnique({ where: { id: chatId } })
            : null

        if (!chat) {
            // Create a new chat if none exists
            const title = await generateChatTitle(prompt)
            chat = await prisma.chat.create({
                data: {
                    title,
                    userId: DEFAULT_USER_ID,
                }
            })
        }

        // 2. Save User Message
        await prisma.message.create({
            data: {
                role: 'user',
                content: prompt,
                chatId: chat.id
            }
        })

        // 3. Get AI Response from Gemini
        const result = await model.generateContent(prompt)
        const aiResponse = result.response.text()

        // 4. Save AI Message
        await prisma.message.create({
            data: {
                role: 'model',
                content: aiResponse,
                chatId: chat.id
            }
        })

        revalidatePath('/') // Refresh the sidebar data
        return { chatId: chat.id, aiResponse }
    } catch (error) {
        console.error("Error in askGemini:", error)
        throw error
    }
}

export async function getChatHistory() {
    try {
        return await prisma.chat.findMany({
            where: {
                userId: DEFAULT_USER_ID
            },
            include: {
                messages: { take: 1, orderBy: { createdAt: 'desc' } }
            },
            orderBy: { updatedAt: 'desc' }
        })
    } catch (error) {
        console.error("Error fetching chat history:", error)
        return []
    }
}

export async function deleteChat(chatId: string) {
    try {
        await prisma.chat.delete({
            where: { id: chatId }
        })
        revalidatePath('/')
    } catch (error) {
        console.error("Error deleting chat:", error)
        throw error
    }
}

export async function renameChat(chatId: string, newTitle: string) {
    try {
        await prisma.chat.update({
            where: { id: chatId },
            data: { title: newTitle }
        })
        revalidatePath('/')
    } catch (error) {
        console.error("Error renaming chat:", error)
        throw error
    }
}

export async function getChatMessages(chatId: string) {
    try {
        return await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }
        })
    } catch (error) {
        console.error("Error fetching messages:", error)
        return []
    }
}

export async function editMessage(messageId: string, newContent: string) {
    try {
        await prisma.message.update({
            where: { id: messageId },
            data: {
                content: newContent,
                isEdited: true,
                editedAt: new Date()
            }
        })
        revalidatePath('/')
    } catch (error) {
        console.error("Error editing message:", error)
        throw error
    }
}

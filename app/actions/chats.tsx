'use server'

import { prisma } from "@/lib/prisma"
import { model } from "@/lib/gemini"
import { revalidatePath } from "next/cache"

export async function askGemini(sessionId: string | null, prompt: string) {
    // 1. Ensure we have a session
    let session = sessionId
        ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
        : await prisma.chatSession.create({ data: {} })

    if (!session) session = await prisma.chatSession.create({ data: {} })

    // 2. Save User Message
    await prisma.message.create({
        data: {
            role: 'user',
            content: prompt,
            sessionId: session.id
        }
    })

    // 3. Get AI Response from Gemini
    const result = await model.generateContent(prompt)
    const aiResponse = result.response.text()

    // 4. Save AI Message
    await prisma.message.create({
        data: {
            role: 'ai',
            content: aiResponse,
            sessionId: session.id
        }
    })

    revalidatePath('/') // Refresh the sidebar data
    return { sessionId: session.id, aiResponse }
}

export async function getChatHistory() {
    return await prisma.chatSession.findMany({
        include: {
            messages: { take: 1, orderBy: { createdAt: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
    })
}
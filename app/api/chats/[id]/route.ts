import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// 1. GET: Fetch messages for a specific chat
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    })

    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 })

    return NextResponse.json({
      messages: chat.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        imageUrl: msg.imageUrl,
      }))
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// 2. DELETE: Remove a chat
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await prisma.chat.deleteMany({ where: { id } })

    if (deleted.count === 0) {
      return NextResponse.json({ success: true, alreadyDeleted: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

// 3. PATCH: Rename a chat
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { title } = await req.json()
    const updated = await prisma.chat.update({
      where: { id },
      data: { title: title.trim() },
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Rename failed" }, { status: 500 })
  }
}

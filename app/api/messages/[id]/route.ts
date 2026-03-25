import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { content } = await req.json()
    const trimmedContent = String(content ?? "").trim()

    if (!trimmedContent) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { content: trimmedContent },
      select: {
        id: true,
        role: true,
        content: true,
      },
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Mic, Image, X } from "lucide-react"
import type { SendMessageInput } from "@/types/chat"


interface ChatInputProps {
  onSend: (input: SendMessageInput) => Promise<void>
  isLoading: boolean
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedImage)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedImage])

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error("Failed to read image"))
      reader.readAsDataURL(file)
    })

  const handleSend = async () => {
    if ((!message.trim() && !selectedImage) || isLoading) return

    const imageUrl = selectedImage ? await fileToDataUrl(selectedImage) : null

    await onSend({
      content: message,
      imageUrl,
    })

    setMessage("")
    handleRemoveImage()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      e.target.value = ""
      return
    }

    setSelectedImage(file)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto w-full mx-40 rounded-lg ">
      <div className="bg-[#1e1f20] rounded-3xl border border-[#3c4043] px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {previewUrl && selectedImage && (
          <div className="mb-3 inline-flex items-start gap-3 rounded-2xl border border-[#3c4043] bg-[#131314] p-3">
            <img
              src={previewUrl}
              alt={selectedImage.name}
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="max-w-44 truncate text-sm text-white">{selectedImage.name}</p>
              <p className="text-xs text-[#9aa0a6]">Image selected</p>
            </div>
            <button
              onClick={handleRemoveImage}
              className="p-1 text-[#9aa0a6] hover:text-white"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-3">
        <button
          onClick={handleImageClick}
          type="button"
          className="p-2 hover:bg-[#282a2c] rounded-full transition-colors text-[#9aa0a6] hover:text-white"
        >
          <Image size={20} />
        </button>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none resize-none max-h-32 text-white placeholder:text-[#9aa0a6]"
          placeholder=""
          rows={1}
          disabled={isLoading}
        />

        <button type="button" className="p-2 hover:bg-[#282a2c] rounded-full transition-colors text-[#9aa0a6] hover:text-white">
          <Mic size={20} />
        </button>

        <button
          onClick={handleSend}
          disabled={(!message.trim() && !selectedImage) || isLoading}
          className={`p-2 rounded-full transition-colors ${
            (message.trim() || selectedImage) && !isLoading
              ? "bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#131314]"
              : "bg-[#3c4043] text-[#9aa0a6] cursor-not-allowed"
          }`}
        >
          <Send size={20} />
        </button>
        </div>
      </div>
      
      <p className="text-xs text-center text-[#9aa0a6] mt-3">
        Gemini may display inaccurate info, including about people, so double-check its responses. Image selection is ready in the UI.
      </p>
    </div>
  )
}

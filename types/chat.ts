export type Message = {
    id : string
    role : "user" | "assistant"
    content : string
    imageUrl?: string | null
}

export type Conversation = {
    id : string
    messages : Message[]
    createdAt : string
    title : string
}

export type SendMessageInput = {
    content: string
    imageUrl?: string | null
}

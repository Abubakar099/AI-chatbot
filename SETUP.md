# AI Chatbot Setup Guide

This guide will help you get the AI Chatbot application running with Prisma and SQLite.

## Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

## Setup Steps

### 1. Install Dependencies

The dependencies are already listed in `package.json`, which includes:
- **@prisma/client** - Prisma ORM client
- **@prisma/adapter-better-sqlite3** - SQLite adapter for Prisma
- **better-sqlite3** - SQLite database driver
- **@google/generative-ai** - Google Gemini API client

Run the automatic setup:
```bash
npm install
# or
yarn install
# or
pnpm install
```

This will automatically:
1. Generate the Prisma client (`npm run postinstall`)
2. Create the SQLite database file (`dev.db`)
3. Initialize the database schema

### 2. Configure Environment Variables

Create a `.env.local` file in the project root with:

```
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_gemini_api_key_here"
```

**To get your Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the generated key
4. Paste it into `.env.local` as `GEMINI_API_KEY=your_key`

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will open at `http://localhost:3000`

## Database Structure

The application uses SQLite with the following schema:

### Chat Model
- `id` - Unique chat identifier
- `title` - AI-generated chat title
- `userId` - User identifier
- `createdAt` - Chat creation timestamp
- `updatedAt` - Last update timestamp
- Messages - Related messages in this chat

### Message Model
- `id` - Unique message identifier
- `chatId` - Reference to parent chat
- `role` - Either "user" or "model" (Gemini role)
- `content` - Message text content
- `isEdited` - Whether message was edited
- `editedAt` - Edit timestamp
- `createdAt` - Message creation timestamp

## Features Implemented

✅ **Create New Chats** - Start fresh conversations with AI-generated titles

✅ **Persistent Chat History** - All chats saved to SQLite database

✅ **Chat Management**
- Rename chat titles
- Delete chats
- Search through chat history

✅ **Message Editing** - Edit sent messages inline

✅ **Prevent Concurrent Requests** - Input disabled while waiting for AI response

✅ **Page Persistence** - Chat data persists across page refreshes

## Troubleshooting

### "Module not found" errors for clsx, tailwind-merge, etc.

Run `npm install` again to ensure all dependencies are installed.

### "Can't resolve '@prisma/client'"

The Prisma client needs to be generated. Run:
```bash
npx prisma generate
```

### "Database connection failed"

1. Check that `DATABASE_URL` is set correctly in `.env.local`
2. Ensure the `dev.db` file exists in the project root
3. Run `npx prisma db push` to sync the schema

### "GEMINI_API_KEY not found"

1. Get an API key from https://makersuite.google.com/app/apikey
2. Add it to `.env.local`: `GEMINI_API_KEY=your_key`
3. Restart the dev server

### "TypeError: Cannot read property 'generateContent' of undefined"

Make sure the Gemini API key is valid and set in `.env.local`

## Manual Prisma Commands

If needed, you can manually run Prisma commands:

```bash
# Generate Prisma client
npx prisma generate

# Sync database schema
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# View migrations
npx prisma migrate status
```

## Project Structure

```
/
├── app/
│   ├── api/
│   │   └── init/            # Database initialization endpoint
│   ├── actions/
│   │   └── chats.tsx        # Server actions for chat operations
│   ├── layout.tsx
│   └── page.tsx             # Main chat interface
├── components/
│   ├── ChatArea.tsx         # Main chat display
│   ├── ChatInput.tsx        # Message input box
│   ├── ChatMessage.tsx      # Individual message display with edit
│   ├── Sidebar.tsx          # Chat history sidebar
│   └── ui/                  # UI components
├── lib/
│   ├── prisma.ts           # Prisma client instance
│   ├── gemini.ts           # Gemini API initialization
│   └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema definition
├── scripts/
│   ├── setup.js            # Automatic setup script
│   └── migrate.ts          # Manual migration script
└── .env.local              # Environment variables (local only)
```

## Development Notes

- The database file `dev.db` is stored locally for development
- For production, consider using a managed database service
- The app uses React Server Components for optimal performance
- Prisma hooks are configured for automatic client reuse in Next.js

Happy chatting! 🚀

installation setup

npx create-next-app@latest my-app --typescript --tailwind --app --eslint
@import "tailwindcss";
npm install @google/generative-ai @prisma/client @prisma/adapter-better-sqlite3 better-sqlite3
npm install -D prisma @types/better-sqlite3
npx prisma init --datasource-provider sqlite --output ../app/generated/prisma
npx prisma migrate dev 
npx prisma migrate dev --name init

<!-- dotenv, which is needed to load your DATABASE_URL from the .env file: -->
npm install dotenv

npx shadcn@latest init
npx shadcn@latest add button card input scroll-area


Run Migrations: Run npx prisma migrate dev --name init to create the new tables.

Create GET Route: Create app/api/chats/route.ts to simply return prisma.chat.findMany().
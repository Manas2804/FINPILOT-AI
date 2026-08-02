# FINPILOT AI

Prototype 1 is a production-structured personal finance management platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth, bcrypt, React Hook Form, Zod, Zustand, Recharts, and Lucide.

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.

3. Generate Prisma client and apply the schema:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

## Features

- Landing page with fintech SaaS UI
- Email/password registration and login
- Protected dashboard, income, expense, loan, and profile routes
- PostgreSQL schema for users, incomes, expenses, loans, and categories
- Authenticated CRUD APIs
- Monthly income, expenses, savings, savings rate, and financial health score
- Recharts analytics for income vs expense, expense categories, savings trend, and loan progress
- Modular services and reusable components ready for Prototype 2 AI advisor features

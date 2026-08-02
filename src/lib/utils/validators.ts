import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export const incomeSchema = z.object({
  source: z.string().min(2),
  amount: z.coerce.number().positive(),
  category: z.string().min(1),
  date: z.coerce.date(),
  description: z.string().optional(),
});

export const expenseSchema = z.object({
  title: z.string().min(2),
  amount: z.coerce.number().positive(),
  category: z.string().min(1),
  date: z.coerce.date(),
  description: z.string().optional(),
});

export const loanSchema = z.object({
  loanName: z.string().min(2),
  loanType: z.string().min(1),
  principalAmount: z.coerce.number().positive(),
  interestRate: z.coerce.number().min(0),
  emiAmount: z.coerce.number().positive(),
  remainingAmount: z.coerce.number().min(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const profileSchema = z.object({
  name: z.string().min(2),
});

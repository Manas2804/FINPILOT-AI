import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

type DemoUser = { id: string; name: string; email: string; password: string; createdAt: Date; updatedAt: Date };
type DemoIncome = { id: string; userId: string; amount: number; source: string; category: string; description?: string; date: Date; createdAt: Date };
type DemoExpense = { id: string; userId: string; amount: number; title: string; category: string; description?: string; date: Date; createdAt: Date };
type DemoLoan = { id: string; userId: string; loanName: string; loanType: string; principalAmount: number; interestRate: number; emiAmount: number; remainingAmount: number; startDate: Date; endDate: Date; createdAt: Date };
type DemoEntityMap = { incomes: DemoIncome; expenses: DemoExpense; loans: DemoLoan };
type DemoCollection = keyof DemoEntityMap;
type DemoStoreData = { users: DemoUser[]; incomes: DemoIncome[]; expenses: DemoExpense[]; loans: DemoLoan[] };

type SerializedDate<T> = Omit<T, "createdAt" | "updatedAt" | "date" | "startDate" | "endDate"> & {
  createdAt: string;
  updatedAt?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
};
type SerializedStore = {
  users: SerializedDate<DemoUser>[];
  incomes: SerializedDate<DemoIncome>[];
  expenses: SerializedDate<DemoExpense>[];
  loans: SerializedDate<DemoLoan>[];
};

const demoStoreFile = path.join(process.cwd(), ".dist", "finpilot-demo-store.json");

export const isDemoStore = !process.env.DATABASE_URL;

function createEmptyStore(): DemoStoreData {
  return { users: [], incomes: [], expenses: [], loans: [] };
}

function ensureStoreFile() {
  if (fs.existsSync(demoStoreFile)) return;
  fs.mkdirSync(path.dirname(demoStoreFile), { recursive: true });
  fs.writeFileSync(demoStoreFile, JSON.stringify(createEmptyStore(), null, 2), "utf-8");
}

function readStore(): DemoStoreData {
  ensureStoreFile();
  const raw = fs.readFileSync(demoStoreFile, "utf-8");
  const parsed = JSON.parse(raw) as Partial<SerializedStore>;
  return {
    users: (parsed.users ?? []).map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt ?? user.createdAt),
    })) as DemoUser[],
    incomes: (parsed.incomes ?? []).map((income) => ({
      ...income,
      date: new Date(income.date ?? income.createdAt),
      createdAt: new Date(income.createdAt),
    })) as DemoIncome[],
    expenses: (parsed.expenses ?? []).map((expense) => ({
      ...expense,
      date: new Date(expense.date ?? expense.createdAt),
      createdAt: new Date(expense.createdAt),
    })) as DemoExpense[],
    loans: (parsed.loans ?? []).map((loan) => ({
      ...loan,
      startDate: new Date(loan.startDate ?? loan.createdAt),
      endDate: new Date(loan.endDate ?? loan.createdAt),
      createdAt: new Date(loan.createdAt),
    })) as DemoLoan[],
  };
}

function writeStore(store: DemoStoreData) {
  ensureStoreFile();
  const serialized: SerializedStore = {
    users: store.users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() })),
    incomes: store.incomes.map((income) => ({ ...income, date: income.date.toISOString(), createdAt: income.createdAt.toISOString() })),
    expenses: store.expenses.map((expense) => ({ ...expense, date: expense.date.toISOString(), createdAt: expense.createdAt.toISOString() })),
    loans: store.loans.map((loan) => ({
      ...loan,
      startDate: loan.startDate.toISOString(),
      endDate: loan.endDate.toISOString(),
      createdAt: loan.createdAt.toISOString(),
    })),
  };
  fs.writeFileSync(demoStoreFile, JSON.stringify(serialized, null, 2), "utf-8");
}

export async function findDemoUserByEmail(email: string) {
  const store = readStore();
  return store.users.find((user) => user.email === email.toLowerCase()) ?? null;
}

export async function createDemoUser(data: { name: string; email: string; password: string }) {
  const store = readStore();
  const now = new Date();
  const user = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email.toLowerCase(),
    password: await bcrypt.hash(data.password, 12),
    createdAt: now,
    updatedAt: now,
  };
  store.users.push(user);
  writeStore(store);
  return user;
}

export async function ensureDemoOAuthUser(data: { name?: string | null; email: string }) {
  const existing = await findDemoUserByEmail(data.email);
  if (existing) return existing;
  return createDemoUser({
    name: data.name || data.email.split("@")[0],
    email: data.email,
    password: crypto.randomUUID(),
  });
}

export async function findDemoUserById(id: string) {
  const store = readStore();
  return store.users.find((user) => user.id === id) ?? null;
}

export function updateDemoUser(id: string, name: string) {
  const store = readStore();
  const user = store.users.find((item) => item.id === id);
  if (user) {
    user.name = name;
    user.updatedAt = new Date();
    writeStore(store);
  }
  return user;
}

export function demoList<K extends DemoCollection>(collection: K, userId: string) {
  const store = readStore();
  const items = store[collection] as DemoEntityMap[K][];
  return items.filter((item) => item.userId === userId).sort((a, b) => Number((b as { date?: Date; createdAt?: Date }).date ?? b.createdAt) - Number((a as { date?: Date; createdAt?: Date }).date ?? a.createdAt));
}

export function demoCreate<K extends DemoCollection>(collection: K, userId: string, data: Omit<DemoEntityMap[K], "id" | "userId" | "createdAt">) {
  const store = readStore();
  const items = store[collection] as DemoEntityMap[K][];
  const record = { ...data, id: crypto.randomUUID(), userId, createdAt: new Date() } as DemoEntityMap[K];
  items.push(record);
  writeStore(store);
  return record;
}

export function demoUpdate<K extends DemoCollection>(collection: K, userId: string, id: string, data: Partial<Omit<DemoEntityMap[K], "id" | "userId" | "createdAt">>) {
  const store = readStore();
  const items = store[collection] as DemoEntityMap[K][];
  const index = items.findIndex((item) => item.id === id && item.userId === userId);
  if (index === -1) throw new Error("Not found");
  items[index] = { ...items[index], ...data } as DemoEntityMap[K];
  writeStore(store);
  return items[index];
}

export function demoDelete<K extends DemoCollection>(collection: K, userId: string, id: string) {
  const store = readStore();
  const items = store[collection] as DemoEntityMap[K][];
  const index = items.findIndex((item) => item.id === id && item.userId === userId);
  if (index === -1) throw new Error("Not found");
  const record = items.splice(index, 1)[0];
  writeStore(store);
  return record;
}

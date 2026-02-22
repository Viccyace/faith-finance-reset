import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import BudgetMonth from "@/models/BudgetMonth";
import { z } from "zod";

const incomeSrcSchema = z.object({
  label: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(3),
});

const categorySchema = z.object({
  name: z.string().min(1),
  plannedAmount: z.number().min(0),
  color: z.string().optional(),
});

const budgetSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
  incomes: z.array(incomeSrcSchema).optional(),
  categories: z.array(categorySchema).optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  await dbConnect();
  const budget = await BudgetMonth.findOne({ userId: (session.user as any).id, month, year });
  return NextResponse.json(budget || null);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = budgetSchema.parse(body);
    await dbConnect();

    const budget = await BudgetMonth.findOneAndUpdate(
      { userId: (session.user as any).id, month: data.month, year: data.year },
      { ...data, userId: (session.user as any).id },
      { upsert: true, new: true }
    );
    return NextResponse.json(budget);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
